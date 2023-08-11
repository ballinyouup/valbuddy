import { NextjsSite } from "sst/constructs";

export default function Site({ stack }: any) {
    const site = new NextjsSite(stack, "site");
    stack.addOutputs({
        url: site.url,
    });
}