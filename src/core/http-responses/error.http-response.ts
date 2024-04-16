import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";
import {} from "prisma/prisma-client/index";

export const errorResponse = (exception: any) => {
  const statusCode = getExceptionStatus(exception);
  const message = getExceptionMessage(exception);
  const headers = getHeaders();
  return new NextResponse(
    JSON.stringify({
      success: false,
      message: message,
      statusCode: statusCode,
    }),
    { status: statusCode, headers }
  );
};

export const getExceptionStatus = (exception: any) => {
  return exception instanceof ApiError
    ? exception.statusCode
    : HttpStatusCode.InternalServerError;
};

export const getExceptionMessage = (exception: any) => {
  return exception instanceof Error
    ? exception.message
    : "Internal Server Error";
};

export function getHeaders() {
  return { "content-type": "application/json" };
}
