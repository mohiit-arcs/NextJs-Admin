import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { auth } from "@/services/backend/acl.service";
import { removeItemFromCart } from "@/services/backend/app/cart.service";

export const PATCH = auth(async (request: ApiRequest, { params }: any) => {
  try {
    const { amount, taxAmount, totalAmount, cartItemId } = await request.json();
    const id = Number(params.id);

    return successResponse({
      data: {
        success: await removeItemFromCart(
          parseFloat(amount),
          parseFloat(taxAmount),
          parseFloat(totalAmount),
          id,
          parseInt(cartItemId),
          request.user?.id!
        ),
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
});
