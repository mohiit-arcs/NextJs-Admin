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
        street: {
          type: "string",
        },
        city: {
          type: "string",
        },
        zipcode: {
          type: "string",
        },
        state: {
          type: "string",
        },
        country: {
          type: "string",
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
    count: {
      type: "number",
    },
    message: {
      type: "string",
    },
  },
};
