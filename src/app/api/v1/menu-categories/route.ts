import { badRequest } from "@/core/errors/http.error";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { messages } from "@/messages/backend/index.message";
import { acl } from "@/services/backend/acl.service";
import {
  createMenuCategory,
  listMenuCategory,
  updateMenuCategory,
} from "@/services/backend/menuCategory.service";

export const POST = acl(
  "menu-category",
  "full",
  async (request: ApiRequest) => {
    try {
      const { name, restaurantId } = await request.json();

      const createMenuCategoryData = {
        name,
      };

      return successResponse({
        data: {
          success: await createMenuCategory(
            createMenuCategoryData,
            parseInt(restaurantId),
            request.user?.id!
          ),
        },
        message: messages.response.menuCategoryCreated,
      });
    } catch (error) {
      return errorResponse(error);
    }
  }
);

export const PATCH = acl(
  "menu-category",
  "full",
  async (request: ApiRequest) => {
    try {
      const { name, id } = await request.json();
      const updateMenuCategoryData = {
        name,
      };
      return successResponse({
        data: {
          success: await updateMenuCategory(
            updateMenuCategoryData,
            parseInt(id)
          ),
        },
        message: messages.response.menuCategoryCreated,
      });
    } catch (error) {
      return errorResponse(error);
    }
  }
);

export const GET = acl("menu-category", "full", async (request: ApiRequest) => {
  try {
    const { searchParams } = request.nextUrl;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search")?.trim() || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const restaurantId = searchParams.get("restaurantId") as string;
    if (isNaN(parseInt(page)) || isNaN(parseInt(limit))) {
      throw badRequest(messages.error.badRequest);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    return successResponse({
      data: await listMenuCategory(
        search,
        sortBy,
        sortOrder,
        skip,
        take,
        request.user?.id!,
        parseInt(restaurantId)
      ),
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
});
