import { messages } from "@/messages/backend/index.message";
import { HttpStatusCode } from "axios";

export const HttpStatusMessages = {
  [HttpStatusCode.Ok]: messages.httpStatusCode.ok,
  [HttpStatusCode.Created]: messages.httpStatusCode.created,
  [HttpStatusCode.NoContent]: messages.httpStatusCode.noContent,
  [HttpStatusCode.BadRequest]: messages.httpStatusCode.badRequest,
  [HttpStatusCode.Unauthorized]: messages.httpStatusCode.unauthorized,
  [HttpStatusCode.Forbidden]: messages.httpStatusCode.forbidden,
  [HttpStatusCode.NotFound]: messages.httpStatusCode.notFound,
  [HttpStatusCode.InternalServerError]:
    messages.httpStatusCode.internalServerError,
};
