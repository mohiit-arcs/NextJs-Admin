import { notFound } from "@/core/errors/http.error";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { acl } from "@/services/backend/acl.service";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = acl("restaurants", "full", async (request: NextRequest) => {
  try {
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
});
