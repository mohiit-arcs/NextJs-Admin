import { notFound } from "@/core/errors/http.error";
import { successResponse } from "@/core/http-responses/success.http-response";
import { getFoodItemById } from "@/services/backend/foodItem.service";
import { verifyToken } from "@/services/backend/jwt.service";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest, { params }: any) {
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
    const id = Number(params.id);
    console.log(id);
    const foodItem = await prisma.foodItem.findFirst({
      where: { id: id, userId: userData?.id },
      select: {
        id: true,
      },
    });
    if (foodItem?.id) {
      await prisma.foodItem.update({
        where: { id: id },
        data: {
          deletedAt: new Date(),
        },
      });

      const totalFoodItems = await prisma.foodItem.count({
        where: {
          deletedAt: { equals: null },
        },
      });

      const response = NextResponse.json({
        success: true,
        message: "Food Item Deleted Successfully",
        statusCode: HttpStatusCode.Created,
        count: totalFoodItems,
      });

      return response;
    }
    throw notFound("Food Item not found");
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
  }
}

export async function GET(request: NextRequest, { params }: any) {
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
    const id = Number(params.id);
    return successResponse({
      data: await getFoodItemById(id, userData?.id!),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
  }
}
