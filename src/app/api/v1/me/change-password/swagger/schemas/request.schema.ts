export const ChangePasswordRequest = {
  type: "object",
  properties: {
    currentPassword: {
      type: "string",
    },
    newPassword: {
      type: "string",
    },
  },
};
