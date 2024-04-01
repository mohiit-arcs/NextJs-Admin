import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { messages } from "@/messages/backend/index.message";
import { createOrder } from "@/services/backend/app/order.service";

export const POST = async (request: ApiRequest) => {
  try {
    const { amount, restaurantId, userId } = await request.json();

    return successResponse({
      data: {
        success: await createOrder(
          parseInt(amount),
          parseInt(restaurantId),
          parseInt(userId)
        ),
      },
      message: messages.response.orderCreated,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
};
