import { NextjsSite } from "sst/constructs";

export default function Site({ stack }: any) {
    const site = new NextjsSite(stack, "site", {
        environment: {
            API_URL: process.env.API_URL as string,
        }
    });
    stack.addOutputs({
        url: site.url,
    });
}