export const FoodItemDetailsRequest = [
  {
    name: "id",
    required: true,
    in: "path",
    schema: {
      type: "number",
    },
  },
];

export const FoodItemDeleteRequest = [
  {
    name: "id",
    required: true,
    in: "path",
    schema: {
      type: "number",
    },
  },
];
