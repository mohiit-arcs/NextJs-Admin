export const MenuCategoriesListRequest = [
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

export const CreateMenuCategoryRequest = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    restaurantId: {
      type: "number",
    },
  },
};

export const UpdateMenuCategoryRequest = {
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
