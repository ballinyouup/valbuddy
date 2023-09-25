import * as cdk from "aws-cdk-lib";
import { Bucket } from "sst/constructs";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { Duration } from "aws-cdk-lib";
import { StackContext } from "sst/constructs/FunctionalStack";
import {
    BucketAccessControl,
    HttpMethods,
} from "aws-cdk-lib/aws-s3";
import { env } from "../env";
import {
    Certificate,
    CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";

export function Backend({ stack }: StackContext) {
    // Hosted Zone is a Domain that is using AWS Nameservers, and contains
    // DNS Settings.
    const hostedZone = route53.HostedZone.fromLookup(stack, "HostedZone", {
        domainName: "valbuddy.com",
    });
    // Create A New SSL Certificate for "api" subdomain.
    // Validates using DNS from the Hosted Zone
    const gatewayCert = new Certificate(stack, "ValbuddyCert", {
        domainName: "api.valbuddy.com",
        validation: CertificateValidation.fromDns(hostedZone),
    });

    // Create A New SSL Certificate for "img" subdomain.
    // Validates using DNS from the Hosted Zone
    const imgCert = new Certificate(stack, "images-cert", {
        domainName: "img.valbuddy.com",
        validation: CertificateValidation.fromDns(hostedZone),
    });

    // Using our CircleCI pipeline, we create the bootstrap binary from our go backend
    // and zip it and add it to the Code prop. The bootstrap handler is the binary we added to the zip.
    // We use the new AL2 Runtime with ARM64 Architecture for big performance/deployment gains.
    const lambdaFunction = new lambda.Function(stack, "valbuddy-lambda", {
        code: lambda.Code.fromAsset("bootstrap.zip"),
        handler: "bootstrap",
        runtime: lambda.Runtime.PROVIDED_AL2,
        memorySize: 1024,
        timeout: Duration.seconds(30),
        architecture: lambda.Architecture.ARM_64,
        environment: {
            DISCORD_ID: env.DISCORD_ID,
            DISCORD_SECRET: env.DISCORD_SECRET,
            API_URL: env.API_URL,
            COOKIE_DOMAIN: env.COOKIE_DOMAIN,
            DATABASE_URL: env.DATABASE_URL,
            FRONTEND_URL: env.FRONTEND_URL,
            NEXT_PUBLIC_API_URL: env.NEXT_PUBLIC_API_URL,
            TWITCH_ID: env.TWITCH_ID,
            TWITCH_SECRET: env.TWITCH_SECRET,
        },
        functionName: "valbuddy-lambda"
    });

    // Create a rest api, that gets permissions to execute the lambda.
    // Must Define two default integrations with responses to get this to work. Will break if not included.
    // Must add binary media types "multipart/form-data" to allow form data to pass through.
    // Assigns the domain and cert with the CDK
    // Creates policies to allow invoking lambda as well as allowing anyone to access gateway
    const gateway = new cdk.aws_apigateway.RestApi(stack, "valbuddy-gateway", {
        binaryMediaTypes: ["multipart/form-data"],
        defaultCorsPreflightOptions: {
            allowOrigins: ["*"],
            allowHeaders: ["*"],
            allowMethods: ["ANY"]
        },
        defaultIntegration: new apigateway.LambdaIntegration(lambdaFunction, {
            integrationResponses: [{
                statusCode: "200"
            }]
        }),
        disableExecuteApiEndpoint: true,
        endpointTypes: [apigateway.EndpointType.REGIONAL],
        domainName: {
            domainName: "api.valbuddy.com",
            endpointType: apigateway.EndpointType.REGIONAL,
            certificate: gatewayCert,
        },
        policy: new cdk.aws_iam.PolicyDocument({
            statements: [
                new cdk.aws_iam.PolicyStatement({
                    principals: [new cdk.aws_iam.ServicePrincipal("apigateway.amazonaws.com")],
                    actions: ["lambda:InvokeFunction"],
                    effect: cdk.aws_iam.Effect.ALLOW,
                    resources: ["*"],
                }),
                new cdk.aws_iam.PolicyStatement({
                    actions: ['execute-api:Invoke'],
                    resources: ['*'],
                    effect: cdk.aws_iam.Effect.ALLOW,
                    principals: [new cdk.aws_iam.ArnPrincipal('*')],
                }),
            ],
        }),
    });
    // Lambda /{proxy+} route that handles everything excluding the root path.
    gateway.root.addProxy({
        anyMethod: true,
        defaultIntegration: new apigateway.LambdaIntegration(lambdaFunction, {
            integrationResponses: [{
                statusCode: "200"
            }]
        }),
    });
    // Add permissions to the API Gateway to invoke the lambda.
    lambdaFunction.addPermission('ApiGatewayInvoke', {
        principal: new cdk.aws_iam.ServicePrincipal('apigateway.amazonaws.com'),
        action: 'lambda:InvokeFunction',
        sourceArn: gateway.arnForExecuteApi(),
    });

    // Creates the S3 bucket containing public images
    const bucket = new Bucket(stack, "valbuddy-images", {
        cdk: {
            bucket: {
                bucketName: "img.valbuddy.com",
                cors: [
                    {
                        allowedMethods: [
                            HttpMethods.GET,
                            HttpMethods.POST,
                            HttpMethods.PUT,
                            HttpMethods.DELETE,
                            HttpMethods.HEAD,
                        ],
                        allowedOrigins: ["*"],
                        allowedHeaders: ["*"],
                    },
                ],
                blockPublicAccess: new cdk.aws_s3.BlockPublicAccess({
                    blockPublicAcls: false,
                    ignorePublicAcls: false,
                    blockPublicPolicy: false,
                    restrictPublicBuckets: false,
                }),
                accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                websiteIndexDocument: "index.html",
            },
        },
    });
    // Adds Public Read Policy
    bucket.cdk.bucket.addToResourcePolicy(
        new cdk.aws_iam.PolicyStatement({
            sid: "AllowPublicRead",
            principals: [new cdk.aws_iam.ArnPrincipal('*')],
            actions: ["s3:GetObject"],
            effect: cdk.aws_iam.Effect.ALLOW,
            resources: [`${bucket.bucketArn}/*`],
        }),
    );

    // Creates distribution to allow S3 images to be served in CDN
    // Adds additional domain name and certificate
    const imageCDN = new cloudfront.Distribution(stack, "ImageCDN", {
        defaultBehavior: {
            origin: new cdk.aws_cloudfront_origins.S3Origin(bucket.cdk.bucket),
            viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
        },
        domainNames: ["img.valbuddy.com"],
        certificate: imgCert,
    });


    // Gives permissions for reading and writing to Lambda for CRUD operations.
    bucket.cdk.bucket.grantReadWrite(lambdaFunction);

    // Creates a new alias for API Gateway for "api" subdomain
    new route53.ARecord(stack, "ApiARecord", {
        zone: hostedZone,
        target: route53.RecordTarget.fromAlias(
            new cdk.aws_route53_targets.ApiGateway(gateway)
        ),
        recordName: "api",
    });

    // Creates a new alias for Cloudfront for "img" subdomain
    const imgCDN = new route53.ARecord(stack, "ImgCDNARecord", {
        zone: hostedZone,
        target: route53.RecordTarget.fromAlias(
            new cdk.aws_route53_targets.CloudFrontTarget(imageCDN)
        ),
        recordName: "img",
    });

    stack.addOutputs({
        bucketCDN: imgCDN.domainName,
        apiURL: gateway.url,
        lambdaURL: lambdaFunction.addFunctionUrl().url,
    });
}
