import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Duration } from "aws-cdk-lib";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";


export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const gatewayCert = new Certificate(this, "ValbuddyCert", {
      domainName: "api.valbuddy.com",
      validation: CertificateValidation.fromDns()
    });

    const lambdaFunction = new lambda.Function(this, "valbuddy-lambda", {
      code: lambda.Code.fromAsset(`${process.env.HOME_PATH as string}/backend/zip`),
      handler: "bootstrap",
      runtime: lambda.Runtime.PROVIDED_AL2,
      environment: {
        DISCORD_ID: process.env.DISCORD_ID as string,
        DISCORD_SECRET: process.env.DISCORD_SECRET as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        API_URL: process.env.API_URL as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        COOKIE_DOMAIN: process.env.COOKIE_DOMAIN as string,
        TWITCH_ID: process.env.TWITCH_ID as string,
        TWITCH_SECRET: process.env.TWITCH_SECRET as string,
      },
      memorySize: 1024,
      timeout: Duration.seconds(15),
      architecture: lambda.Architecture.ARM_64,
    });

    const gateway = new apigateway.RestApi(this, "valbuddy-gateway", {
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
      deployOptions: {
        stageName: "prod",
      },
    });
    gateway.addDomainName("ValbuddyDomain", {
      domainName: "api.valbuddy.com",
      certificate: gatewayCert

    });
    gateway.root.addProxy({
      defaultIntegration: new apigateway.LambdaIntegration(
        lambdaFunction
      ),
      anyMethod: true,
    });

    const bucket = new s3.Bucket(this, "valbuddy-images", {
      publicReadAccess: true,
      bucketName: "img.valbuddy.com",
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.POST,
            s3.HttpMethods.PUT,
            s3.HttpMethods.DELETE,
            s3.HttpMethods.HEAD,
          ],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const imageCDN = new cloudfront.Distribution(this, "ImageCDN", {
      defaultBehavior: { origin: new origins.S3Origin(bucket) },
    });

    bucket.grantReadWrite(lambdaFunction);
    const hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: "valbuddy.com",
    });

    // new route53.ARecord(this, 'ApiARecord', {
    //   zone: hostedZone,
    //   target: route53.RecordTarget.fromAlias(new route53Targets.ApiGatewayDomain(gateway.domainName!)),
    //   recordName: 'api',
    // });

    new route53.ARecord(this, "ImgCDNARecord", {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(imageCDN)
      ),
      recordName: "img",
    });

    new cdk.CfnOutput(this, "BucketURL", {
      value: bucket.bucketWebsiteUrl,
    });

    new cdk.CfnOutput(this, "BackendURL", {
      value: `https://${gateway.domainName?.domainName}`,
    });

    new cdk.CfnOutput(this, "LambdaURL", {
      value: lambdaFunction.functionArn,
    });
  }
}
