import { badRequest } from "@/core/errors/http.error";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { messages } from "@/messages/backend/index.message";
import {
  createFoodItem,
  foodItemList,
  updateFoodItem,
} from "@/services/backend/foodItem.service";
import { verifyToken } from "@/services/backend/jwt.service";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        HttpStatusCode.Unauthorized,
        "Authorization token is missing or invalid"
      );
    }
    const token = authHeader.replace("Bearer ", "");
    const userData = await verifyToken(token);

    const { name, restaurantId, categoryId } = await request.json();

    if (name.trim() === "") {
      throw badRequest("Food Item name cannot be empty");
    }

    if (isNaN(parseInt(restaurantId)) || isNaN(parseInt(categoryId))) {
      throw badRequest(messages.error.badRequest);
    }

    const foodItem = {
      name,
    };

    return successResponse({
      data: {
        success: await createFoodItem(
          foodItem,
          parseInt(restaurantId),
          parseInt(categoryId),
          userData?.id!
        ),
      },
      message: messages.response.createFoodItem,
    });
  } catch (error: any) {
    console.log(error);
    return errorResponse(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        HttpStatusCode.Unauthorized,
        "Authorization token is missing or invalid"
      );
    }
    const token = authHeader.replace("Bearer ", "");
    const userData = await verifyToken(token);
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

    const response = await foodItemList(
      search,
      sortBy,
      sortOrder,
      skip,
      take,
      userData?.id!
    );

    return NextResponse.json({
      success: true,
      result: response.foodItems,
      count: response.count,
      statusCode: HttpStatusCode.Ok,
    });
  } catch (error: any) {
    console.log(error);
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        HttpStatusCode.Unauthorized,
        "Authorization token is missing or invalid"
      );
    }
    const token = authHeader.replace("Bearer ", "");
    const userData = await verifyToken(token);
    const { id, name } = await request.json();

    if (name.trim() === "") {
      throw badRequest("Food Item name cannot be empty");
    }

    const updatedFoodItem = {
      name,
    };

    return successResponse({
      data: {
        success: await updateFoodItem(
          Number(id),
          updatedFoodItem,
          userData?.id!
        ),
      },
      message: messages.response.requestUpdated,
    });
  } catch (error: any) {
    return errorResponse(error);
  }
}
