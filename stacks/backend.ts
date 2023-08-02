import { EndpointType } from "aws-cdk-lib/aws-apigateway";
import { ApiGatewayV1Api, Function } from "sst/constructs";

export default function Backend({ stack }) {
    const lambdaFunc = new Function(stack, "goLambda", {
        handler: "./api/main.go",
        runtime: "go1.x",
        environment: {
            DISCORD_ID: process.env.DISCORD_ID as string,
            DISCORD_SECRET: process.env.DISCORD_SECRET as string,
            DATABASE_URL: process.env.DATABASE_URL as string,
            API_URL: process.env.API_URL as string
        }
    })
    new ApiGatewayV1Api(stack, "goApi", {
        routes: {
            "ANY /{proxy+}": lambdaFunc,
        },
        cdk: {
            restApi: {
                endpointConfiguration: {
                    types: [EndpointType.REGIONAL]
                },
                defaultCorsPreflightOptions: {
                    allowOrigins: ["*"],
                    allowCredentials: false,
                    allowHeaders: ["*"],
                    allowMethods: ["ANY"],
                }
            },
        }
    });

}