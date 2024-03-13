export const RestaurantDetailsRequest = [
  {
    name: "id",
    required: true,
    in: "path",
    schema: {
      type: "number",
    },
  },
];

export const RestaurantDeleteRequest = [
  {
    name: "id",
    required: true,
    in: "path",
    schema: {
      type: "number",
    },
  },
];
