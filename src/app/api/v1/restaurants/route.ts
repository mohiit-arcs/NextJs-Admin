import { badRequest } from "@/core/errors/http.error";
import { messages } from "@/messages/backend/index.message";
import { errorResponse } from "@/core/http-responses/error.http-response";
import {
  createRestaurant,
  restaurantList,
  updateRestaurant,
} from "@/services/backend/restaurant.service";
import { CreateRestaurant } from "@/interfaces/backend/resturant.interface";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { acl } from "@/services/backend/acl.service";

export const POST = acl("restaurants", "full", async (request: ApiRequest) => {
  try {
    if (request.user?.role?.slug != "restaurantAdmin") {
      throw badRequest(messages.error.notAllowed);
    }
    const {
      name,
      email,
      imageData,
      menuCategory,
      phoneNumber,
      street,
      city,
      zipcode,
      state,
      country,
    } = await request.json();

    let userId = request.user?.id;

    const restaurant: CreateRestaurant = {
      name,
      email,
      imageData,
      menuCategory,
      phoneNumber,
      street,
      city,
      zipcode,
      state,
      country,
    };

    return successResponse({
      data: {
        success: await createRestaurant(restaurant, userId),
      },
      message: messages.response.createRestaurant,
    });
  } catch (error: any) {
    console.log(error);
    return errorResponse(error);
  }
});

export const GET = acl("restaurants", "full", async (request: ApiRequest) => {
  try {
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
      data: await restaurantList(
        search,
        sortBy,
        sortOrder,
        skip,
        take,
        request.user?.id!
      ),
    });
  } catch (error: any) {
    console.log(error);
    return errorResponse(error);
  }
});

export const PATCH = acl("restaurants", "full", async (request: ApiRequest) => {
  try {
    const {
      id,
      name,
      email,
      imageData,
      menuCategory,
      phoneNumber,
      street,
      city,
      zipcode,
      state,
      country,
    } = await request.json();

    const updatedRestaurant: CreateRestaurant = {
      name,
      email,
      imageData,
      menuCategory,
      phoneNumber,
      street,
      city,
      zipcode,
      state,
      country,
    };

    return successResponse({
      data: {
        success: await updateRestaurant(
          Number(id),
          updatedRestaurant,
          request.user?.id!
        ),
      },
      message: messages.response.requestUpdated,
    });
  } catch (error: any) {
    return errorResponse(error);
  }
});
