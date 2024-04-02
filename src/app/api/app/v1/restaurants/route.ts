import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { auth } from "@/services/backend/acl.service";
import { getAllRestaurants } from "@/services/backend/app/resturant.service";

export const GET = auth(async (request: ApiRequest) => {
  try {
    return successResponse({
      data: await getAllRestaurants(),
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
});
