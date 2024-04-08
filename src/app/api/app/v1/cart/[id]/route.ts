import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { auth } from "@/services/backend/acl.service";
import { clearCart } from "@/services/backend/app/cart.service";

export const DELETE = auth(async (request: ApiRequest, { params }: any) => {
  try {
    const id = Number(params.id);
    return successResponse({
      data: await clearCart(id, request.user?.id!),
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
});
