import { badRequest } from "@/core/errors/http.error";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { messages } from "@/messages/backend/index.message";
import { acl } from "@/services/backend/acl.service";
import { getOrdersListByRestaurantId } from "@/services/backend/order.service";

export const GET = acl(
  "restaurants",
  "full",
  async (request: ApiRequest, { params }: any) => {
    try {
      const id = Number(params.id);
      const { searchParams } = request.nextUrl;
      const page = searchParams.get("page") || "1";
      const limit = searchParams.get("limit") || "10";
      const search = searchParams.get("search")?.trim() || "";
      const sortBy = searchParams.get("sortBy") || "createdAt";
      const sortOrder = searchParams.get("sortOrder") || "desc";
      if (isNaN(parseInt(page)) || isNaN(parseInt(limit))) {
        throw badRequest(messages.error.badRequest);
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      return successResponse({
        data: await getOrdersListByRestaurantId(
          search,
          sortBy,
          sortOrder,
          skip,
          take,
          id
        ),
      });
    } catch (error: any) {
      console.log(error);
      return errorResponse(error);
    }
  }
);
