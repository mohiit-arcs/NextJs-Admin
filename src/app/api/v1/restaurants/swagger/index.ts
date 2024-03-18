import _ from "lodash";
import { publicResponses } from "../../swagger";
import { RestaurantListRequest } from "./schemas";

export * from "./schemas";
const successListResponse = {
  description: "Success: Restaurants list success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/RestaurantListResponse",
      },
    },
  },
};

const successUpdateResponse = {
  description: "Success: Restaurant update success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/UpdateRestaurantResponse",
      },
    },
  },
};

const successCreateResponse = {
  description: "Success: Restaurant created success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/CreateRestaurantResponse",
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

export const RestaurantsAPI = {
  get: {
    "x-controller-name": "Restaurants",
    "x-operation-name": "find",
    tags: ["Restaurants"],
    description: "This api is for restaurants.",
    summary: "Endpoint for restaurants",
    responses: publicListResponses,
    parameters: RestaurantListRequest,
    operationId: "findRestaurants",
  },
  post: {
    "x-controller-name": "Restaurants",
    "x-operation-name": "create",
    tags: ["Restaurants"],
    description: "This api is to create the restaurant.",
    summary: "Endpoint for creating the restaurant",
    responses: publicCreateResponses,
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateRestaurantRequest",
          },
        },
      },
    },
    operationId: "createRestaurant",
  },
  patch: {
    "x-controller-name": "Restaurants",
    "x-operation-name": "update",
    tags: ["Restaurants"],
    description: "This api is to update the restaurant.",
    summary: "Endpoint for updating the restaurant",
    responses: publicUpdateResponses,
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateRestaurantRequest",
          },
        },
      },
    },
    operationId: "updateRestaurant",
  },
};
