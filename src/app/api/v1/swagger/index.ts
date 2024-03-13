export const successResponse = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {},
    },
    message: {
      type: "string",
    },
  },
};

export const publicResponses = {
  "200": {
    description: "Success response",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/SuccessResponseModel",
        },
      },
    },
  },
  "400": {
    description: "Error: Bad request",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },
  "404": {
    description: "Error: Not found error",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },
  "500": {
    description: "Error: Internal server error",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },
};

export const privateResponse = {
  ...publicResponses,
  "401": {
    description: "Error: Unauthorized",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },
};
