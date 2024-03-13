import { successResponse } from "@/app/api/v1/swagger";
import _ from "lodash";

export const CreateRestaurantResponse = _.cloneDeep(successResponse);

CreateRestaurantResponse.properties.data = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
    },
  },
};

export const UpdateRestaurantResponse = _.cloneDeep(successResponse);

UpdateRestaurantResponse.properties.data = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
    },
  },
};

export const RestaurantListResponse = {
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
              email: {
                type: "string",
              },
              phoneNumber: {
                type: "string",
              },
              image: {
                type: "string",
              },
              location: {
                type: "object",
                properties: {
                  street: {
                    type: "string",
                  },
                  city: {
                    type: "string",
                  },
                  zipCode: {
                    type: "string",
                  },
                  state: {
                    type: "string",
                  },
                  country: {
                    type: "string",
                  },
                  id: {
                    type: "number",
                  },
                },
              },
              createdAt: {
                type: "date",
              },
              updatedAt: {
                type: "date",
              },
              deletedAt: {
                type: "date",
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
