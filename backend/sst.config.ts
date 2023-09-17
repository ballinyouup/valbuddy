import { SSTConfig } from "sst";
import Backend from "./stacks/backend";

export default {
  config(_input) {
    return {
      name: "valbuddy-backend",
      region: "us-east-2",
    };
  },
  stacks(app) {
    app.stack(Backend)
  },
} satisfies SSTConfig;
