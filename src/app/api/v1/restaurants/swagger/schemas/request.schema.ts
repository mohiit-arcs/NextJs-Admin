export const RestaurantListRequest = [
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

export const CreateRestaurantRequest = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    email: {
      type: "string",
    },
    imageData: {
      type: "object",
      properties: {
        imageName: {
          type: "string",
        },
        imageMimetype: {
          type: "string",
        },
        fullImage: {
          type: "string",
        },
        thumbnailImage: {
          type: "string",
        },
      },
    },
    phoneNumber: {
      type: "string",
    },
    street: {
      type: "string",
    },
    city: {
      type: "string",
    },
    zipcode: {
      type: "string",
    },
    state: {
      type: "string",
    },
    country: {
      type: "string",
    },
  },
};

export const UpdateRestaurantRequest = {
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
    imageData: {
      type: "object",
      properties: {
        imageName: {
          type: "string",
        },
        imageMimetype: {
          type: "string",
        },
        fullImage: {
          type: "string",
        },
        thumbnailImage: {
          type: "string",
        },
      },
    },
    phoneNumber: {
      type: "string",
    },
    street: {
      type: "string",
    },
    city: {
      type: "string",
    },
    zipcode: {
      type: "string",
    },
    state: {
      type: "string",
    },
    country: {
      type: "string",
    },
  },
};
