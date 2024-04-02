export const OrdersListResponse = {
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
              status: {
                type: "string",
              },
              amount: {
                type: "number",
              },
              taxAmount: {
                type: "number",
              },
              items: {
                type: "number",
              },
              user: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                },
              },
              restaurant: {
                type: "object",
                properties: {
                  name: {
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
