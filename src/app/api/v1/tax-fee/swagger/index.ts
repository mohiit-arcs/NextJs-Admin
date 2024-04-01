import _ from "lodash";
import { publicResponses } from "../../swagger";
import { TaxFeeListRequest } from "./schemas";

export * from "./schemas";
const successListResponse = {
  description: "Success: Tax Fee list success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/TaxFeeListResponse",
      },
    },
  },
};

const successUpdateResponse = {
  description: "Success: Tax Fee update success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/UpdateTaxFeeResponse",
      },
    },
  },
};

const successCreateResponse = {
  description: "Success: Tax Fee created success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/CreateTaxFeeResponse",
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

export const TaxFeeAPI = {
  get: {
    "x-controller-name": "TaxFee",
    "x-operation-name": "find",
    tags: ["TaxFee"],
    description: "This api is for finding tax fee(s).",
    summary: "Endpoint for tax fee(s)",
    responses: publicListResponses,
    parameters: TaxFeeListRequest,
    operationId: "findTaxFee",
  },
  post: {
    "x-controller-name": "TaxFee",
    "x-operation-name": "create",
    tags: ["TaxFee"],
    description: "This api is to create the Tax Fee.",
    summary: "Endpoint for creating the Tax Fee",
    responses: publicCreateResponses,
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateTaxFeeRequest",
          },
        },
      },
    },
    operationId: "createTaxFee",
  },
  patch: {
    "x-controller-name": "TaxFee",
    "x-operation-name": "update",
    tags: ["TaxFee"],
    description: "This api is to update the Tax Fee.",
    summary: "Endpoint for updating the Tax Fee",
    responses: publicUpdateResponses,
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateTaxFeeRequest",
          },
        },
      },
    },
    operationId: "updateTaxFee",
  },
};
