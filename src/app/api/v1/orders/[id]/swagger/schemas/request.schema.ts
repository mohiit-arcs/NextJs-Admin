export const OrdersListRequest = [
  {
    name: "id",
    required: true,
    in: "path",
    schema: {
      type: "number",
    },
  },
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
