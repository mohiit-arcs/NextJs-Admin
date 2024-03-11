import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";

export function badRequest(message: string) {
  return new ApiError(HttpStatusCode.BadRequest, message);
}

export function forbidden(message: string) {
  return new ApiError(HttpStatusCode.Forbidden, message);
}

export function internalServerError(message: string) {
  return new ApiError(HttpStatusCode.InternalServerError, message);
}

export function notFound(message: string) {
  return new ApiError(HttpStatusCode.NotFound, message);
}

export function unauthorized(message: string) {
  return new ApiError(HttpStatusCode.Unauthorized, message);
}
