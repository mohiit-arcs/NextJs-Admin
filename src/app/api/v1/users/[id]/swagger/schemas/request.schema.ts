export const UserDetailsRequest = [
  {
    name: "id",
    required: true,
    in: "path",
    schema: {
      type: "number",
    },
  },
];

export const UserDeleteRequest = [
  {
    name: "id",
    required: true,
    in: "path",
    schema: {
      type: "number",
    },
  },
];
