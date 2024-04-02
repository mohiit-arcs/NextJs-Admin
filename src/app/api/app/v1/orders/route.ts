import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { messages } from "@/messages/backend/index.message";
import { auth } from "@/services/backend/acl.service";
import { createOrder } from "@/services/backend/app/order.service";

export const POST = auth(async (request: ApiRequest) => {
  try {
    const { amount, taxAmount, itemCount, restaurantId } = await request.json();

    return successResponse({
      data: {
        success: await createOrder(
          parseFloat(amount),
          parseFloat(taxAmount),
          parseInt(itemCount),
          parseInt(restaurantId),
          request.user?.id!
        ),
      },
      message: messages.response.orderCreated,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
});
