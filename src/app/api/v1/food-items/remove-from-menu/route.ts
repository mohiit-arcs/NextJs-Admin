import { badRequest } from "@/core/errors/http.error";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { messages } from "@/messages/backend/index.message";
import { removeFromMenu } from "@/services/backend/foodItem.service";
import { verifyToken } from "@/services/backend/jwt.service";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        HttpStatusCode.Unauthorized,
        "Authorization token is missing or invalid"
      );
    }
    const token = authHeader.replace("Bearer ", "");
    const userData = await verifyToken(token);
    const { id, restaurantId, categoryId } = await request.json();
    if (isNaN(restaurantId) || isNaN(categoryId)) {
      throw badRequest(messages.error.badRequest);
    }

    return successResponse({
      data: await removeFromMenu(
        id,
        parseInt(restaurantId),
        parseInt(categoryId),
        userData?.id!
      ),
    });
  } catch (error: any) {
    console.log(error);
    return errorResponse(error);
  }
}
