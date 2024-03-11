import { badRequest } from "@/core/errors/http.error";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { verifyToken } from "@/services/backend/jwt.service";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

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
    const { id, restaurantId, categoryId } = await request.json();

    if (isNaN(parseInt(restaurantId)) || isNaN(parseInt(categoryId))) {
      throw badRequest("You entered something wrong. Please try again");
    }

    const existingFoodItem = await prisma.foodItem.findFirst({
      where: { id: parseInt(id), userId: userData?.id },
      select: {
        id: true,
        menu: {
          where: {
            restaurantId: parseInt(restaurantId),
            menuCategoryId: parseInt(categoryId),
          },
        },
      },
    });

    if (existingFoodItem?.menu.length != 0) {
      throw badRequest("Food Item Already Added");
    }

    await prisma.foodItem.update({
      where: { id: parseInt(id), userId: userData?.id },
      data: {
        menu: {
          create: {
            restaurantId: parseInt(restaurantId),
            menuCategoryId: parseInt(categoryId),
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Food Item Added",
      statusCode: HttpStatusCode.Ok,
    });
  } catch (error: any) {
    console.log(error);
    return errorResponse(error);
  }
}
