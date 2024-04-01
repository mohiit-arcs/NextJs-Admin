import { successResponse } from "@/app/api/v1/swagger";
import _ from "lodash";

export const CreateTaxFeeResponse = _.cloneDeep(successResponse);

CreateTaxFeeResponse.properties.data = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
    },
  },
};

export const UpdateTaxFeeResponse = _.cloneDeep(successResponse);

UpdateTaxFeeResponse.properties.data = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
    },
  },
};

export const TaxFeeListResponse = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        rows: {
          type: "array",
          items: {
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
        count: {
          type: "number",
        },
      },
    },
  },
};
