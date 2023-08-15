import { NextjsSite } from "sst/constructs";

export default function Site({ stack }: any) {
    const site = new NextjsSite(stack, "site", {
        environment: {
            NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL as string
        }
    });
    stack.addOutputs({
        url: site.url,
    });
}