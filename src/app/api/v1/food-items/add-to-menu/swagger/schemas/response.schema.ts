import { successResponse } from "@/app/api/v1/swagger";
import _ from "lodash";

export const AddToMenuResponse = _.cloneDeep(successResponse);

AddToMenuResponse.properties.data = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
    },
    message: {
      type: "string",
    },
  },
};
