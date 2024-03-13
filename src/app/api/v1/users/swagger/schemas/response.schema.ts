import { successResponse } from "@/app/api/v1/swagger";
import _ from "lodash";

export const UpdateUserResponse = _.cloneDeep(successResponse);

UpdateUserResponse.properties.data = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
    },
  },
};

export const UserListResponse = {
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
              roleId: {
                type: "number",
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
