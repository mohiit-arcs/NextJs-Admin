import { successResponse } from "@/app/api/v1/swagger";
import _ from "lodash";

export const CreateFoodItemResponse = _.cloneDeep(successResponse);

CreateFoodItemResponse.properties.data = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
    },
  },
};

export const UpdateFoodItemResponse = _.cloneDeep(successResponse);

UpdateFoodItemResponse.properties.data = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
    },
  },
};

export const FoodItemsListResponse = {
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
              price: {
                type: "number",
              },
              restaurants: {
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
                    email: {
                      type: "string",
                    },
                    phoneNumber: {
                      type: "string",
                    },
                  },
                },
              },
              categories: {
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
                    slug: {
                      type: "string",
                    },
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
