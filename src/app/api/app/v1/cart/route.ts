import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { auth } from "@/services/backend/acl.service";
import {
  createCart,
  getCartDetails,
  updateCartItem,
} from "@/services/backend/app/cart.service";

export const GET = auth(async (request: ApiRequest) => {
  try {
    return successResponse({
      data: await getCartDetails(request.user?.id!),
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
});

export const POST = auth(async (request: ApiRequest) => {
  try {
    const { amount, taxAmount, totalAmount, restaurantId, foodItems } =
      await request.json();

    return successResponse({
      data: await createCart(
        parseFloat(amount),
        parseFloat(taxAmount),
        parseFloat(totalAmount),
        parseInt(restaurantId),
        foodItems,
        request.user?.id!
      ),
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
});

export const PATCH = auth(async (request: ApiRequest) => {
  try {
    const { amount, taxAmount, totalAmount, cartItemId, quantity } =
      await request.json();

    return successResponse({
      data: {
        success: await updateCartItem(
          parseFloat(amount),
          parseFloat(taxAmount),
          parseFloat(totalAmount),
          parseInt(cartItemId),
          quantity,
          request.user?.id!
        ),
      },
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
});
