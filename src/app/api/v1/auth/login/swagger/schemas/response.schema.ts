import { successResponse } from "@/app/api/v1/swagger";
import _ from "lodash";

export const LoginResponse = _.cloneDeep(successResponse);

LoginResponse.properties.data = {
  type: "object",
  properties: {
    profile: {
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
    token: {
      type: "string",
    },
  },
};
