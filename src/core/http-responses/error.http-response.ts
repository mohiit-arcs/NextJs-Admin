import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";
import {} from "prisma/prisma-client/index";

export const errorResponse = (exception: any) => {
  const statusCode = getExceptionStatus(exception);
  const message = getExceptionMessage(exception);
  return NextResponse.json({
    success: false,
    message: message,
    statusCode: statusCode,
  });
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
