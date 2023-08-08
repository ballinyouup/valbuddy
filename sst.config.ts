import { SSTConfig } from "sst";
import Site from "./stacks/site";
import Backend from "./stacks/backend";
export default {
  config(_input) {
    return {
      name: "nextjs-go",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(Site)
    app.stack(Backend)
  },
} satisfies SSTConfig;
