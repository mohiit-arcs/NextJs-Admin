import _ from "lodash";
import { publicResponses } from "../../../swagger";
import { MenuCategoryDetailsRequest } from "./schemas/request.schema";

export * from "./schemas";
const successGetResponse = {
  description: "Success: Menu Category Detail success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/MenuCategoryDetailsResponse",
      },
    },
  },
};

const publicGetResponses = _.cloneDeep(publicResponses);

publicGetResponses["200"] = _.cloneDeep(successGetResponse);

export const MenuCategoryByIdAPI = {
  get: {
    "x-controller-name": "MenuCategoryById",
    "x-operation-name": "findById",
    tags: ["MenuCategory Request"],
    description: "This api is to get Menu Category by id.",
    summary: "Endpoint to get Menu Category's data",
    responses: _.cloneDeep(publicGetResponses),
    parameters: MenuCategoryDetailsRequest,
    operationId: "findMenuCategoryById",
  },
};
