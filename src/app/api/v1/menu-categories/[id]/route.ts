import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { acl } from "@/services/backend/acl.service";
import { getMenuCategoryById } from "@/services/backend/menuCategory.service";

export const GET = acl(
  "menu-category",
  "full",
  async (request: ApiRequest, { params }: any) => {
    try {
      const id = Number(params.id);
      return successResponse({
        data: await getMenuCategoryById(id, request.user?.id!),
      });
    } catch (error: any) {
      return errorResponse(error);
    }
  }
);
