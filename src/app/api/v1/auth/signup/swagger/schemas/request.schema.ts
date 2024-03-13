export const SignupRequest = {
  type: "object",
  properties: {
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
