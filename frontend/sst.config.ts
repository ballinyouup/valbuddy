import { SSTConfig } from "sst";
import Site from "./stacks/site";

export default {
  config(_input) {
    return {
      name: "valbuddy-frontend",
      region: "us-east-2",
    };
  },
  stacks(app) {
    app.stack(Site);
  },
} satisfies SSTConfig;
