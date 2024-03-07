import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const roles = await prisma.role.findMany({
      where: {
        slug: { not: "superAdmin" },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    if (roles.length == 0) {
      throw new ApiError(HttpStatusCode.NotFound, "No Roles Found");
    }

    return NextResponse.json({
      success: true,
      result: roles,
      count: roles.length,
      statusCode: HttpStatusCode.Ok,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
  }
}
