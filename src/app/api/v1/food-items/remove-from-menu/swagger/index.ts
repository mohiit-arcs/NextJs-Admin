import _ from "lodash";
import { publicResponses } from "../../../swagger";
import { RemoveFromMenuRequest } from "./schemas/request.schema";

export * from "./schemas";

const successUpdateResponse = {
  description: "Success: Remove Food Item from Menu success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/RemoveFromMenuResponse",
      },
    },
  },
};

let publicUpdateResponses = publicResponses;

publicUpdateResponses["200"] = successUpdateResponse;
publicUpdateResponses = _.cloneDeep(publicUpdateResponses);

export const RemoveFromMenuAPI = {
  patch: {
    "x-controller-name": "FoodItemRequests",
    "x-operation-name": "removeFromMenu",
    tags: ["FoodItem Request"],
    description: "This api is to remove Food Item from menu.",
    summary: "Endpoint to remove Food Item from menu",
    responses: _.cloneDeep(publicUpdateResponses),
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/RemoveFromMenuRequest",
          },
        },
      },
    },
    operationId: "removeFromMenu",
  },
};
