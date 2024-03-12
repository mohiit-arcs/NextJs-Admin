import { badRequest } from "@/core/errors/http.error";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { messages } from "@/messages/backend/index.message";
import { acl } from "@/services/backend/acl.service";
import { addToMenu } from "@/services/backend/foodItem.service";

export const PATCH = acl("restaurants", "full", async (request: ApiRequest) => {
  try {
    const { id, restaurantId, categoryId } = await request.json();

    if (isNaN(parseInt(restaurantId)) || isNaN(parseInt(categoryId))) {
      throw badRequest(messages.error.badRequest);
    }

    return successResponse({
      data: await addToMenu(
        parseInt(id),
        parseInt(restaurantId),
        parseInt(categoryId),
        request.user?.id!
      ),
    });
  } catch (error: any) {
    console.log(error);
    return errorResponse(error);
  }
});
