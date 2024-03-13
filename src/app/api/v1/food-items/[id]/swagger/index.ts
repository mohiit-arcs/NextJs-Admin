import _ from "lodash";
import { privateResponse, publicResponses } from "../../../swagger";
import {
  FoodItemDetailsRequest,
  FoodItemDeleteRequest,
} from "./schemas/request.schema";

export * from "./schemas";
const successGetResponse = {
  description: "Success: Food Item Detail success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/FoodItemDetailsResponse",
      },
    },
  },
};

const successDeleteResponse = {
  description: "Success: Delete Food Item success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/FoodItemDeleteResponse",
      },
    },
  },
};

const publicGetResponses = _.cloneDeep(publicResponses);
const privateDeleteResponses = _.cloneDeep(privateResponse);

publicGetResponses["200"] = _.cloneDeep(successGetResponse);
privateDeleteResponses["200"] = _.cloneDeep(successDeleteResponse);

export const FoodItemByIdAPI = {
  get: {
    "x-controller-name": "FoodItemRequests",
    "x-operation-name": "findById",
    tags: ["FoodItem Request"],
    description: "This api is to get FoodItem by id.",
    summary: "Endpoint to get FoodItem's data",
    responses: _.cloneDeep(publicGetResponses),
    parameters: FoodItemDetailsRequest,
    operationId: "findFoodItemById",
  },
  delete: {
    "x-controller-name": "FoodItemRequests",
    "x-operation-name": "deleteById",
    tags: ["FoodItem Request"],
    description: "This api is to delete FoodItem by id.",
    summary: "Endpoint to delete FoodItem",
    responses: _.cloneDeep(privateDeleteResponses),
    parameters: FoodItemDeleteRequest,
    operationId: "deleteFoodItemById",
  },
};
