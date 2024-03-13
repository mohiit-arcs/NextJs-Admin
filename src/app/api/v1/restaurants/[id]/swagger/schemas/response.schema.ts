import { successResponse } from "@/app/api/v1/swagger";
import _ from "lodash";

export const RestaurantDetailsResponse = _.cloneDeep(successResponse);

RestaurantDetailsResponse.properties.data = {
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
      },
    },
  },
};

export const RestaurantDeleteResponse = _.cloneDeep(successResponse);

RestaurantDeleteResponse.properties.data = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
    },
  },
};
