import { NextjsSite, StackContext } from "sst/constructs";

export default function Frontend({ stack }: StackContext) {
    const site = new NextjsSite(stack, "frontend", {
        customDomain: {
            domainName: "valbuddy.com",
            domainAlias: "www.valbuddy.com",
            hostedZone: "valbuddy.com",
        }
    });
    stack.addOutputs({
        url: site.customDomainUrl,
    });
}