import _ from "lodash";
import { publicResponses } from "../../../swagger";

export * from "./schemas";
const successResponse = {
  description: "Success: Login response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/LoginResponse",
      },
    },
  },
};

publicResponses["200"] = successResponse;
export const LoginAPI = {
  post: {
    "x-controller-name": "Authentication",
    "x-operation-name": "login",
    tags: ["Authentication"],
    description: "This api is for login a user",
    summary: "Endpoint to login",
    responses: _.cloneDeep(publicResponses),
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/LoginRequest",
          },
        },
      },
    },
    operationId: "login",
  },
};
