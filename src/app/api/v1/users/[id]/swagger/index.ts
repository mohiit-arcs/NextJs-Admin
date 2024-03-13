import _ from "lodash";
import { privateResponse, publicResponses } from "../../../swagger";
import {
  UserDeleteRequest,
  UserDetailsRequest,
} from "./schemas/request.schema";

export * from "./schemas";
const successGetResponse = {
  description: "Success: User Detail success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/UserDetailsResponse",
      },
    },
  },
};

const successDeleteResponse = {
  description: "Success: Delete user success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/UserDeleteResponse",
      },
    },
  },
};

const publicGetResponses = _.cloneDeep(publicResponses);
const privateDeleteResponses = _.cloneDeep(privateResponse);

publicGetResponses["200"] = _.cloneDeep(successGetResponse);
privateDeleteResponses["200"] = _.cloneDeep(successDeleteResponse);

export const UserByIdAPI = {
  get: {
    "x-controller-name": "UserRequests",
    "x-operation-name": "findById",
    tags: ["User Request"],
    description: "This api is to get user by id.",
    summary: "Endpoint to get user's data",
    responses: _.cloneDeep(publicGetResponses),
    parameters: UserDetailsRequest,
    operationId: "findUserById",
  },
  delete: {
    "x-controller-name": "UserRequests",
    "x-operation-name": "deleteById",
    tags: ["User Request"],
    description: "This api is to delete user by id.",
    summary: "Endpoint to delete user",
    responses: _.cloneDeep(privateDeleteResponses),
    parameters: UserDeleteRequest,
    operationId: "deleteUserById",
  },
};
