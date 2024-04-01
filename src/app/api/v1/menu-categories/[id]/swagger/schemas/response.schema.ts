import { successResponse } from "@/app/api/v1/swagger";
import _ from "lodash";

export const MenuCategoryDetailsResponse = _.cloneDeep(successResponse);

MenuCategoryDetailsResponse.properties.data = {
  type: "object",
  properties: {
    details: {
      type: "object",
      properties: {
        id: {
          type: "number",
        },
        name: {
          type: "string",
        },
      },
    },
  },
};
