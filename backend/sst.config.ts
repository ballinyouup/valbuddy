import { SSTConfig } from "sst";
import { Backend } from "./stacks/cdk-stack";

export default {
  config(_input) {
    return {
      name: "Backend",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(Backend);
  }
} satisfies SSTConfig;
