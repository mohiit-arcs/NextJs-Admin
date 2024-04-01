import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { getRestaurantMenuById } from "@/services/backend/app/resturant.service";

export const GET = async (request: ApiRequest, { params }: any) => {
  try {
    const id = Number(params.id);

    return successResponse({
      data: await getRestaurantMenuById(id),
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
};
