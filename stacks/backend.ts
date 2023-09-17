import { EndpointType } from "aws-cdk-lib/aws-apigateway";
import { HttpMethods } from "aws-cdk-lib/aws-s3";
import {
    ApiGatewayV1Api,
    Bucket,
    Function,
    StackContext,
} from "sst/constructs";

export default function Backend({ stack }: StackContext) {
    const bucket = new Bucket(stack, "valbuddyImages", {
        cdk: {
            bucket: {
                publicReadAccess: true,
                bucketName: "img.valbuddy.com",
                cors: [
                    {
                        allowedMethods: [
                            HttpMethods.GET,
                            HttpMethods.POST,
                            HttpMethods.PUT,
                            HttpMethods.DELETE,
                            HttpMethods.HEAD
                        ],
                        allowedOrigins: ["*"],
                        allowedHeaders: ["*"]
                    }
                ],
            }
        }
    });

    const lambdaFunc = new Function(stack, "al2GoLambda", {
        handler: "./api",
        runtime: "container",
        environment: {
            DISCORD_ID: process.env.DISCORD_ID as string,
            DISCORD_SECRET: process.env.DISCORD_SECRET as string,
            DATABASE_URL: process.env.DATABASE_URL as string,
            API_URL: process.env.API_URL as string,
            FRONTEND_URL: process.env.FRONTEND_URL as string,
            COOKIE_DOMAIN: process.env.COOKIE_DOMAIN as string,
            TWITCH_ID: process.env.TWITCH_ID as string,
            TWITCH_SECRET: process.env.TWITCH_SECRET as string
        },
        permissions: ["s3"],
        bind: [bucket],
        description: "VALBUDDY Backend Lambda using provided.al2 runtime",
        architecture: "arm_64",
    });

    const gateway = new ApiGatewayV1Api(stack, "goApi", {
        routes: {
            "ANY /{proxy+}": lambdaFunc
        },
        cdk: {
            restApi: {
                endpointConfiguration: {
                    types: [EndpointType.REGIONAL]
                },
                defaultCorsPreflightOptions: {
                    allowOrigins: ["*"],
                    allowCredentials: true,
                    allowHeaders: ["*"],
                    allowMethods: ["ANY"]
                },
                binaryMediaTypes: ["multipart/form-data"]
            }
        },
        customDomain: {
            domainName: "api.valbuddy.com",
            hostedZone: "valbuddy.com",
            endpointType: "regional"
        }
    });

    stack.addOutputs({
        bucketURL: bucket.bucketName,
        backendURL: gateway.customDomainUrl,
        lambdaURL: lambdaFunc.url
    });

    return {
        bucket: bucket,
        lambda: lambdaFunc,
        gateway: gateway,
    };
}
