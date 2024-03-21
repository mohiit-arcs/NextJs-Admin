import { successResponse } from "@/app/api/v1/swagger";
import _ from "lodash";

export const ChangePasswordResponse = _.cloneDeep(successResponse);

ChangePasswordResponse.properties.data = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
    },
  },
};
