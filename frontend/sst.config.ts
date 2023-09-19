import { SSTConfig } from "sst";
import Frontend from "./stacks/frontend";

export default {
  config(_input) {
    return {
      name: "valbuddyFrontend",
      region: "us-east-2",
    };
  },
  stacks(app) {
    app.stack(Frontend);
  },
} satisfies SSTConfig;
