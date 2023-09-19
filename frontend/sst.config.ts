import { SSTConfig } from "sst";
import Frontend from "./stacks/frontend";

export default {
  config(_input) {
    return {
      name: "valbuddy-frontend",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(Frontend);
  },
} satisfies SSTConfig;
