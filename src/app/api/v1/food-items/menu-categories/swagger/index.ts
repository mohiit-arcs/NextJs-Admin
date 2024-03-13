import _ from "lodash";
import { publicResponses } from "../../../swagger";

export * from "./schemas";
const successListResponse = {
  description: "Success: Menu Categories success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/MenuCategoriesResponse",
      },
    },
  },
};

let publicListResponses;
publicListResponses = publicResponses;
publicListResponses["200"] = _.cloneDeep(successListResponse);
publicListResponses = _.cloneDeep(publicListResponses);

export const MenuCategoriesAPI = {
  get: {
    "x-controller-name": "MenuCategories",
    "x-operation-name": "find",
    tags: ["MenuCategories"],
    description: "This api is for Menu Categories.",
    summary: "Endpoint for Menu Categories",
    responses: publicListResponses,
    operationId: "findMenuCategories",
  },
};
