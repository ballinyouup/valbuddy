import { SvelteKitSite } from "sst/constructs";

export default function Site({ stack }) {
    const site = new SvelteKitSite(stack, "site");
    stack.addOutputs({
        url: site.url,
    });
}