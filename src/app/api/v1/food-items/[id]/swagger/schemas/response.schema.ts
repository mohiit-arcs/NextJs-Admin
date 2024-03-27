import { successResponse } from "@/app/api/v1/swagger";
import _ from "lodash";

export const FoodItemDetailsResponse = _.cloneDeep(successResponse);

FoodItemDetailsResponse.properties.data = {
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
        price: {
          type: "number",
        },
        menu: {
          type: "array",
          items: {
            type: "object",
            properties: {
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
                  image: {
                    type: "string",
                  },
                  userId: {
                    type: "number",
                  },
                },
              },
              menuCategory: {
                type: "object",
                properties: {
                  id: {
                    type: "number",
                  },
                  name: {
                    type: "string",
                  },
                  slug: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const FoodItemDeleteResponse = _.cloneDeep(successResponse);

FoodItemDeleteResponse.properties.data = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
    },
    count: {
      type: "number",
    },
    message: {
      type: "string",
    },
  },
};
