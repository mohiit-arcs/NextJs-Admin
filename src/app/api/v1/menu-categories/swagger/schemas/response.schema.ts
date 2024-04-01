import { successResponse } from "@/app/api/v1/swagger";
import _ from "lodash";

export const CreateMenuCategoryResponse = _.cloneDeep(successResponse);

CreateMenuCategoryResponse.properties.data = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
    },
  },
};

export const UpdateMenuCategoryResponse = _.cloneDeep(successResponse);

UpdateMenuCategoryResponse.properties.data = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
    },
  },
};

export const MenuCategoryListResponse = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        rows: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "number",
              },
              name: {
                type: "string",
              },
              restaurant: {
                type: "object",
                properties: {
                  id: {
                    type: "number",
                  },
                  name: {
                    type: "string",
                  },
                  email: {
                    type: "string",
                  },
                  phoneNumber: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        count: {
          type: "number",
        },
      },
    },
  },
};
