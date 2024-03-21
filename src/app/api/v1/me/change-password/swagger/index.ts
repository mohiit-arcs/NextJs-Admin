import _ from "lodash";
import { privateResponse } from "../../../swagger";

export * from "./schemas";
const successResponse = {
  description: "Success: Change password success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/ChangePasswordResponse",
      },
    },
  },
};
privateResponse["200"] = successResponse;

export const ChangePasswordAPI = {
  post: {
    "x-controller-name": "Me",
    "x-operation-name": "changePassword",
    tags: ["Me"],
    description: "This api is for changing password of existing user.",
    summary: "Endpoint to change password",
    responses: _.cloneDeep(privateResponse),
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ChangePasswordRequest",
          },
        },
      },
    },
    operationId: "changePassword",
  },
};
