import _ from "lodash";
import { publicResponses } from "../../swagger";
import { FoodItemsListRequest } from "./schemas";

export * from "./schemas";
const successListResponse = {
  description: "Success: Food Item list success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/FoodItemsListResponse",
      },
    },
  },
};

const successUpdateResponse = {
  description: "Success: Food Item update success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/UpdateFoodItemResponse",
      },
    },
  },
};

const successCreateResponse = {
  description: "Success: Food Item created success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/CreateFoodItemResponse",
      },
    },
  },
};

let publicListResponses, publicUpdateResponses, publicCreateResponses;
publicListResponses =
  publicUpdateResponses =
  publicCreateResponses =
    publicResponses;
publicListResponses["200"] = _.cloneDeep(successListResponse);
publicListResponses = _.cloneDeep(publicListResponses);

publicCreateResponses["200"] = successCreateResponse;
publicCreateResponses = _.cloneDeep(publicCreateResponses);

publicUpdateResponses["200"] = successUpdateResponse;
publicUpdateResponses = _.cloneDeep(publicUpdateResponses);

export const FoodItemsAPI = {
  get: {
    "x-controller-name": "FoodItems",
    "x-operation-name": "find",
    tags: ["FoodItems"],
    description: "This api is for finding food items.",
    summary: "Endpoint for food items",
    responses: publicListResponses,
    parameters: FoodItemsListRequest,
    operationId: "findFoodItems",
  },
  post: {
    "x-controller-name": "FoodItems",
    "x-operation-name": "create",
    tags: ["FoodItems"],
    description: "This api is to create the Food Item.",
    summary: "Endpoint for creating the Food Item",
    responses: publicCreateResponses,
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateFoodItemRequest",
          },
        },
      },
    },
    operationId: "createFoodItem",
  },
  patch: {
    "x-controller-name": "FoodItems",
    "x-operation-name": "update",
    tags: ["FoodItems"],
    description: "This api is to update the Food Item.",
    summary: "Endpoint for updating the Food Item",
    responses: publicUpdateResponses,
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateFoodItemRequest",
          },
        },
      },
    },
    operationId: "updateFoodItem",
  },
};
