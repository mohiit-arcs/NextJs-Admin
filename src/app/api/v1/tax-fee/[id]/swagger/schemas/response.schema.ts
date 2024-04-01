import { successResponse } from "@/app/api/v1/swagger";
import _ from "lodash";

export const TaxFeeDetailsResponse = _.cloneDeep(successResponse);

TaxFeeDetailsResponse.properties.data = {
  type: "object",
  properties: {
    details: {
      type: "object",
      properties: {
        id: {
          type: "number",
        },
        tax_name: {
          type: "string",
        },
        tax_type: {
          type: "string",
        },
        value: {
          type: "number",
        },
        restaurant: {
          type: "object",
          properties: {
            id: {
              type: "number",
            },
            name: {
              type: "string",
            },
            email: {
              type: "string",
            },
            phoneNumber: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

export const TaxFeeDeleteResponse = _.cloneDeep(successResponse);

TaxFeeDeleteResponse.properties.data = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
    },
    count: {
      type: "number",
    },
    message: {
      type: "string",
    },
  },
};
