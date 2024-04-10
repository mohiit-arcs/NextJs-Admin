export const TaxFeeListRequest = [
  {
    name: "page",
    in: "query",
    schema: {
      type: "number",
    },
  },
  {
    name: "limit",
    in: "query",
    schema: {
      type: "number",
    },
  },
  {
    name: "search",
    in: "query",
    schema: {
      type: "string",
    },
  },
  {
    name: "sortBy",
    in: "query",
    schema: {
      type: "string",
    },
  },
  {
    name: "sortOrder",
    in: "query",
    schema: {
      type: "string",
    },
  },
  {
    name: "restaurantId",
    in: "query",
    schema: {
      type: "number",
    },
  },
];

export const CreateTaxFeeRequest = {
  type: "object",
  properties: {
    tax_name: {
      type: "string",
    },
    tax_type: {
      type: "string",
    },
    value: {
      type: "number",
    },
    restaurantId: {
      type: "number",
    },
  },
};

export const UpdateTaxFeeRequest = {
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
    restaurantId: {
      type: "number",
    },
  },
};
