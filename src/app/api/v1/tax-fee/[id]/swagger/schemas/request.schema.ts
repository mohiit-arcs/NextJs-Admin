export const TaxFeeDetailsRequest = [
  {
    name: "id",
    required: true,
    in: "path",
    schema: {
      type: "number",
    },
  },
];

export const TaxFeeDeleteRequest = [
  {
    name: "id",
    required: true,
    in: "path",
    schema: {
      type: "number",
    },
  },
];
