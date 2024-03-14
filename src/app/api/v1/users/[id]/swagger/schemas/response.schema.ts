import { successResponse } from "@/app/api/v1/swagger";
import _ from "lodash";

export const UserDetailsResponse = _.cloneDeep(successResponse);

UserDetailsResponse.properties.data = {
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
        role: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            slug: {
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

export const UserDeleteResponse = _.cloneDeep(successResponse);

UserDeleteResponse.properties.data = {
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
