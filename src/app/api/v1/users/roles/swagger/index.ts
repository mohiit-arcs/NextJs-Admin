import _ from "lodash";
import { publicResponses } from "../../../swagger";

export * from "./schemas";
const successListResponse = {
  description: "Success: Users roles success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/UserRolesResponse",
      },
    },
  },
};

let publicListResponses;
publicListResponses = publicResponses;
publicListResponses["200"] = _.cloneDeep(successListResponse);
publicListResponses = _.cloneDeep(publicListResponses);

export const UserRolesAPI = {
  get: {
    "x-controller-name": "UserRoles",
    "x-operation-name": "find",
    tags: ["UserRoles"],
    description: "This api is for users's roles.",
    summary: "Endpoint for users' roles",
    responses: publicListResponses,
    operationId: "findUserRoles",
  },
};
