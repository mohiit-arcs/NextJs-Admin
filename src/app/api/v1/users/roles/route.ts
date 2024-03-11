import { notFound } from "@/core/errors/http.error";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
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
      throw notFound("No Roles Found");
    }

    return NextResponse.json({
      success: true,
      result: roles,
      count: roles.length,
      statusCode: HttpStatusCode.Ok,
    });
  } catch (error: any) {
    return errorResponse(error);
  }
}
