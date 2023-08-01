import { EndpointType } from "aws-cdk-lib/aws-apigateway";
import { ApiGatewayV1Api, Function } from "sst/constructs";

export default function Backend({ stack }) {
    const lambdaFunc = new Function(stack, "goLambda", {
        handler: "./api/main.go",
        runtime: "go1.x",
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