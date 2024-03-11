import { notFound } from "@/core/errors/http.error";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { verifyToken } from "@/services/backend/jwt.service";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

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
    await verifyToken(token);
    const menuCategories = await prisma.menuCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    if (menuCategories.length == 0) {
      throw notFound("No Menu Categories Found");
    }

    return NextResponse.json({
      success: true,
      result: menuCategories,
      count: menuCategories.length,
      statusCode: HttpStatusCode.Ok,
    });
  } catch (error: any) {
    console.log(error);
    return errorResponse(error);
  }
}
