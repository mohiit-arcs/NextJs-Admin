import _ from "lodash";
import { publicResponses } from "../../../swagger";

export * from "./schemas";
const successResponse = {
  description: "Success: Signup success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/SignupResponse",
      },
    },
  },
};

publicResponses["200"] = successResponse;
export const SignupAPI = {
  post: {
    "x-controller-name": "Authentication",
    "x-operation-name": "signup",
    tags: ["Authentication"],
    description: "This api is for signup of a new user",
    summary: "Endpoint to signup",
    responses: _.cloneDeep(publicResponses),
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/SignupRequest",
          },
        },
      },
    },
    operationId: "signup",
  },
};
