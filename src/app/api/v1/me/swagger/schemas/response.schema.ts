import { successResponse } from "@/app/api/v1/swagger";
import _ from "lodash";

export const UserProfileResponse = _.cloneDeep(successResponse);

UserProfileResponse.properties.data = {
  type: "object",
  properties: {
    profile: {
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
              },
            },
          },
        },
      },
    },
  },
};

export const UserProfileUpdateResponse = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        success: {
          type: "boolean",
        },
      },
    },
    message: {
      type: "string",
    },
  },
};
