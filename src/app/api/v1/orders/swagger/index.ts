import _ from "lodash";
import { OrdersListRequest } from "./schemas";
import { publicResponses } from "../../swagger";

export * from "./schemas";
const successListResponse = {
  description: "Success: Orders list success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/OrdersListResponse",
      },
    },
  },
};

let publicListResponses;
publicListResponses = publicResponses;
publicListResponses["200"] = _.cloneDeep(successListResponse);
publicListResponses = _.cloneDeep(publicListResponses);

export const OrdersAPI = {
  get: {
    "x-controller-name": "Orders",
    "x-operation-name": "find",
    tags: ["Orders"],
    description: "This api is for orders.",
    summary: "Endpoint for orders",
    responses: publicListResponses,
    parameters: OrdersListRequest,
    operationId: "findOrdersByRestaurantId",
  },
};
