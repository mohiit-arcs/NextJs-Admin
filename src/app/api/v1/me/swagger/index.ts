import _ from "lodash";
import { privateResponse, publicResponses } from "../../swagger";

export * from "./schemas";
const successResponse = {
  description: "Get user success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/UserProfileResponse",
      },
    },
  },
};

const successUpdateResponse = {
  description: "Success: User profile update response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/UserProfileUpdateResponse",
      },
    },
  },
};

const publicUpdateResponses = _.cloneDeep(publicResponses);

privateResponse["200"] = successResponse;
publicUpdateResponses["200"] = _.cloneDeep(successUpdateResponse);

export const UserProfileAPI = {
  get: {
    "x-controller-name": "Me",
    "x-operation-name": "profile",
    tags: ["Me"],
    description: "This api is for getting the user profile info",
    summary: "Endpoint to get the user profile",
    responses: _.cloneDeep(privateResponse),
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UserProfileRequest",
          },
        },
      },
    },
    operationId: "profile",
  },
};
