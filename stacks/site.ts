import { NextjsSite, StackContext } from "sst/constructs";

export default function Site({ stack }: StackContext) {
    const site = new NextjsSite(stack, "site", {
        environment: {
            NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL as string
        },
        customDomain: {
            domainName: "valbuddy.com",
            domainAlias: "www.valbuddy.com",
            hostedZone: "valbuddy.com", 
        }
    });
    stack.addOutputs({
        url: site.url,
    });
}