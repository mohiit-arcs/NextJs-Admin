import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { acl } from "@/services/backend/acl.service";
import {
  deleteRestaurnatById,
  getRestaurantById,
} from "@/services/backend/restaurant.service";

export const DELETE = acl(
  "restaurants",
  "full",
  async (request: ApiRequest, { params }: any) => {
    try {
      const id = Number(params.id);
      return successResponse({
        data: await deleteRestaurnatById(id, request.user?.id!),
      });
    } catch (error: any) {
      return errorResponse(error);
    }
  }
);

export const GET = acl(
  "restaurants",
  "full",
  async (request: ApiRequest, { params }: any) => {
    try {
      const id = Number(params.id);
      return successResponse({
        data: await getRestaurantById(id, request.user?.id!),
      });
    } catch (error: any) {
      return errorResponse(error);
    }
  }
);
