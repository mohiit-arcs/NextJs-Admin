import { successResponse } from "@/app/api/v1/swagger";
import _ from "lodash";

export const SignupResponse = _.cloneDeep(successResponse);

SignupResponse.properties.data = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
    },
  },
};
