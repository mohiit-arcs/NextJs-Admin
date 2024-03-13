export const config = {
  jwt: {
    secret: process.env.JWT_SECRET,
    expiry: Number(process.env.NEXT_PUBLIC_JWT_EXPIRY || "604800"),
  },
  swagger: {
    openapi: String(process.env.NEXT_PUBLIC_SWAGGER_OPENAPI_VERSION),
    info: {
      title: String(process.env.NEXT_PUBLIC_SWAGGER_TITLE),
      version: String(process.env.NEXT_PUBLIC_SWAGGER_VERSION),
    },
    serverUrl:
      process.env.NEXT_PUBLIC_SWAGGER_IS_PORT_REQUIRED === "true"
        ? `${process.env.NEXT_PUBLIC_APP_SCHEMA}://${process.env.NEXT_PUBLIC_APP_HOST}:${process.env.NEXT_PUBLIC_APP_PORT}/${process.env.NEXT_PUBLIC_ROUTE_PREFIX}`
        : `${process.env.NEXT_PUBLIC_APP_SCHEMA}://${process.env.NEXT_PUBLIC_APP_HOST}/${process.env.NEXT_PUBLIC_ROUTE_PREFIX}`,
  },
};
