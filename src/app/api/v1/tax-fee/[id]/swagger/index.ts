import _ from "lodash";
import { privateResponse, publicResponses } from "../../../swagger";
import {
  TaxFeeDeleteRequest,
  TaxFeeDetailsRequest,
} from "./schemas/request.schema";

export * from "./schemas";
const successGetResponse = {
  description: "Success: Tax Fee Detail success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/TaxFeeDetailsResponse",
      },
    },
  },
};

const successDeleteResponse = {
  description: "Success: Delete Tax Fee success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/TaxFeeDeleteResponse",
      },
    },
  },
};

const publicGetResponses = _.cloneDeep(publicResponses);
const privateDeleteResponses = _.cloneDeep(privateResponse);

publicGetResponses["200"] = _.cloneDeep(successGetResponse);
privateDeleteResponses["200"] = _.cloneDeep(successDeleteResponse);

export const TaxFeeByIdAPI = {
  get: {
    "x-controller-name": "TaxFeeRequests",
    "x-operation-name": "findById",
    tags: ["Tax Fee Request"],
    description: "This api is to get Tax Fee by id.",
    summary: "Endpoint to get Tax Fee's data",
    responses: _.cloneDeep(publicGetResponses),
    parameters: TaxFeeDetailsRequest,
    operationId: "findTaxFeeById",
  },
  delete: {
    "x-controller-name": "TaxFeeRequests",
    "x-operation-name": "deleteById",
    tags: ["Tax Fee Request"],
    description: "This api is to delete Tax Fee by id.",
    summary: "Endpoint to delete Tax Fee",
    responses: _.cloneDeep(privateDeleteResponses),
    parameters: TaxFeeDeleteRequest,
    operationId: "deleteTaxFeeById",
  },
};
