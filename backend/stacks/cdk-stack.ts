import * as cdk from "aws-cdk-lib";
import { ApiGatewayV1Api, Bucket, Config } from "sst/constructs";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { Duration } from "aws-cdk-lib";
import { env } from "../env";
import { StackContext } from "sst/constructs/FunctionalStack";
import {
    BlockPublicAccess,
    BucketAccessControl,
    HttpMethods,
} from "aws-cdk-lib/aws-s3";
// import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";

export function Backend({ stack }: StackContext) {
    const hostedZone = route53.HostedZone.fromLookup(stack, "HostedZone", {
        domainName: "valbuddy.com",
    });

    // const gatewayCert = new Certificate(stack, "ValbuddyCert", {
    //     domainName: "api.valbuddy.com",
    //     validation: CertificateValidation.fromDns(hostedZone)
    // });

    // const DISCORD_ID = new Config.Secret(stack, env.DISCORD_ID);
    // const DISCORD_SECRET = new Config.Secret(stack, env.DISCORD_SECRET);
    // const API_URL = new Config.Secret(stack, env.API_URL);
    // const COOKIE_DOMAIN = new Config.Secret(stack, env.COOKIE_DOMAIN);
    // const DATABASE_URL = new Config.Secret(stack, env.DATABASE_URL);
    // const FRONTEND_URL = new Config.Secret(stack, env.FRONTEND_URL);
    // const HOME_PATH = new Config.Secret(stack, env.HOME_PATH);
    // const NEXT_PUBLIC_API_URL = new Config.Secret(
    //     stack,
    //     env.NEXT_PUBLIC_API_URL
    // );
    // const TWITCH_ID = new Config.Secret(stack, env.TWITCH_ID);
    // const TWITCH_SECRET = new Config.Secret(stack, env.TWITCH_SECRET);

    const lambdaFunction = new lambda.Function(stack, "valbuddy-lambda", {
        code: lambda.Code.fromAsset("/zip/lambda.zip"),
        handler: "bootstrap",
        runtime: lambda.Runtime.PROVIDED_AL2,
        memorySize: 1024,
        timeout: Duration.seconds(30),
        architecture: lambda.Architecture.ARM_64,
    });

    const gateway = new ApiGatewayV1Api(stack, "valbuddy-gateway", {
        cdk: {
            restApi: {
                endpointConfiguration: {
                    types: [apigateway.EndpointType.REGIONAL],
                },
                defaultCorsPreflightOptions: {
                    allowOrigins: apigateway.Cors.ALL_ORIGINS,
                    allowCredentials: true,
                    allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
                    allowMethods: apigateway.Cors.ALL_METHODS,
                },
                binaryMediaTypes: ["multipart/form-data"],
            },
        },
        routes: {
            "ANY /{proxy+}": {
                cdk: {
                    function: lambdaFunction,
                },
            },
        },
        customDomain: "api.valbuddy.com"
    });

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
                blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
                accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                websiteIndexDocument: "index.html"
            },
        },
    });

    const imageCDN = new cloudfront.Distribution(stack, "ImageCDN", {
        defaultBehavior: { origin: new cdk.aws_cloudfront_origins.S3Origin(bucket.cdk.bucket) },
    });

    bucket.cdk.bucket.grantReadWrite(lambdaFunction);

    // new route53.ARecord(stack, "ApiARecord", {
    //     zone: hostedZone,
    //     target: route53.RecordTarget.fromAlias(
    //         new cdk.aws_route53_targets.ApiGateway(gateway.cdk.restApi)
    //     ),
    //     recordName: "api",
    // });

    const imgCDN = new route53.ARecord(stack, "ImgCDNARecord", {
        zone: hostedZone,
        target: route53.RecordTarget.fromAlias(
            new cdk.aws_route53_targets.CloudFrontTarget(imageCDN)
        ),
        recordName: "img",
    });

    stack.addOutputs({
        bucketCDN: imgCDN.domainName,
        apiURL: gateway.customDomainUrl,
        lambdaURL: lambdaFunction.addFunctionUrl().url
    });
}
