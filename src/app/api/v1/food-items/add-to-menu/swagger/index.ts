import _ from "lodash";
import { publicResponses } from "../../../swagger";
import { AddToMenuRequest } from "./schemas/request.schema";

export * from "./schemas";

const successUpdateResponse = {
  description: "Success: Add Food Item to Menu success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/AddToMenuResponse",
      },
    },
  },
};

let publicUpdateResponses = publicResponses;

publicUpdateResponses["200"] = successUpdateResponse;
publicUpdateResponses = _.cloneDeep(publicUpdateResponses);

export const AddToMenuAPI = {
  patch: {
    "x-controller-name": "FoodItemRequests",
    "x-operation-name": "addToMenu",
    tags: ["FoodItem Request"],
    description: "This api is to add Food Item to menu.",
    summary: "Endpoint to add Food Item to menu",
    responses: _.cloneDeep(publicUpdateResponses),
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/AddToMenuRequest",
          },
        },
      },
    },
    operationId: "addToMenu",
  },
};
