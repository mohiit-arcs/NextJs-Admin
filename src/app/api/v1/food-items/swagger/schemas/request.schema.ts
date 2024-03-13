export const FoodItemsListRequest = [
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
];

export const CreateFoodItemRequest = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    restaurantId: {
      type: "number",
    },
    categoryId: {
      type: "number",
    },
  },
};

export const UpdateFoodItemRequest = {
  type: "object",
  properties: {
    id: {
      type: "number",
    },
    name: {
      type: "string",
    },
  },
};
