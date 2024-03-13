import _ from "lodash";
import { privateResponse, publicResponses } from "../../../swagger";
import {
  RestaurantDeleteRequest,
  RestaurantDetailsRequest,
} from "./schemas/request.schema";

export * from "./schemas";
const successGetResponse = {
  description: "Success: Restaurant Detail success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/RestaurantDetailsResponse",
      },
    },
  },
};

const successDeleteResponse = {
  description: "Success: Delete Restaurant success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/RestaurantDeleteResponse",
      },
    },
  },
};

const publicGetResponses = _.cloneDeep(publicResponses);
const privateDeleteResponses = _.cloneDeep(privateResponse);

publicGetResponses["200"] = _.cloneDeep(successGetResponse);
privateDeleteResponses["200"] = _.cloneDeep(successDeleteResponse);

export const RestaurantByIdAPI = {
  get: {
    "x-controller-name": "RestaurantRequests",
    "x-operation-name": "findById",
    tags: ["Restaurant Request"],
    description: "This api is to get Restaurant by id.",
    summary: "Endpoint to get Restaurant's data",
    responses: _.cloneDeep(publicGetResponses),
    parameters: RestaurantDetailsRequest,
    operationId: "findRestaurantById",
  },
  delete: {
    "x-controller-name": "RestaurantRequests",
    "x-operation-name": "deleteById",
    tags: ["Restaurant Request"],
    description: "This api is to delete Restaurant by id.",
    summary: "Endpoint to delete Restaurant",
    responses: _.cloneDeep(privateDeleteResponses),
    parameters: RestaurantDeleteRequest,
    operationId: "deleteRestaurantById",
  },
};
