import { successResponse } from "@/app/api/v1/swagger";
import _ from "lodash";

export const RemoveFromMenuResponse = _.cloneDeep(successResponse);

RemoveFromMenuResponse.properties.data = {
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
