import _ from "lodash";
import { publicResponses } from "../../swagger";
import { UserListRequest } from "./schemas";

export * from "./schemas";
const successListResponse = {
  description: "Success: Users list success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/UserListResponse",
      },
    },
  },
};

const successUpdateResponse = {
  description: "Success: User update success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/UpdateUserResponse",
      },
    },
  },
};
let publicListResponses, publicUpdateResponses;
publicListResponses = publicUpdateResponses = publicResponses;
publicListResponses["200"] = _.cloneDeep(successListResponse);
publicListResponses = _.cloneDeep(publicListResponses);

publicUpdateResponses["200"] = successUpdateResponse;
publicUpdateResponses = _.cloneDeep(publicUpdateResponses);

export const UsersAPI = {
  get: {
    "x-controller-name": "Users",
    "x-operation-name": "find",
    tags: ["Users"],
    description: "This api is for users.",
    summary: "Endpoint for users",
    responses: publicListResponses,
    parameters: UserListRequest,
    operationId: "findUsers",
  },
  patch: {
    "x-controller-name": "Users",
    "x-operation-name": "update",
    tags: ["Users"],
    description: "This api is to update the user.",
    summary: "Endpoint for updating the user",
    responses: publicUpdateResponses,
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateUserRequest",
          },
        },
      },
    },
    operationId: "updateUser",
  },
};
