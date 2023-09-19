import { SSTConfig } from "sst";
import Site from "./stacks/site";

export default {
  config(_input) {
    return {
      name: "valbuddyFrontend",
      region: "us-east-2",
    };
  },
  stacks(app) {
    app.stack(Site);
  },
} satisfies SSTConfig;
