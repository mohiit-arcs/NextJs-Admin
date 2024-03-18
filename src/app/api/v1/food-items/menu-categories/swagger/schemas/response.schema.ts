export const MenuCategoriesResponse = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        result: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              slug: {
                type: "string",
              },
              id: {
                type: "number",
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
