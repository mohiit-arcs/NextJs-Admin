export const UserListRequest = [
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

export const UpdateUserRequest = {
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
    password: {
      type: "string",
    },
    role: {
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
};
