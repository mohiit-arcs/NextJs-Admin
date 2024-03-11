import { notFound } from "@/core/errors/http.error";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { messages } from "@/messages/backend/index.message";
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
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: id, userId: userData?.id },
      select: {
        id: true,
      },
    });
    if (restaurant?.id) {
      await prisma.restaurant.update({
        where: { id: id },
        data: {
          deletedAt: new Date(),
        },
      });

      const totalRestaurants = await prisma.restaurant.count({
        where: {
          deletedAt: { equals: null },
        },
      });

      const response = NextResponse.json({
        success: true,
        message: "Restaurant Deleted Successfully",
        statusCode: HttpStatusCode.Created,
        count: totalRestaurants,
      });

      return response;
    }
    throw notFound("Restaurant not found");
  } catch (error: any) {
    return errorResponse(error);
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
    const user = await prisma.restaurant.findFirst({
      where: { id: id, userId: userData?.id },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        image: true,
        location: true,
      },
    });

    if (user?.id) {
      return NextResponse.json({
        success: true,
        data: {
          details: user,
        },
      });
    }

    throw notFound(messages.error.userNotFound);
  } catch (error: any) {
    return errorResponse(error);
  }
}
