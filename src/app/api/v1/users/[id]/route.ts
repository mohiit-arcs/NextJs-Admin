import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const id = Number(params.id);
    console.log(id);
    const user = await prisma.user.findFirst({
      where: { id: id },
      select: {
        id: true,
        role: true,
      },
    });
    if (user?.id) {
      if (user.role.slug == "superAdmin") {
        throw new ApiError(HttpStatusCode.NotFound, "Cannot Delete SuperAdmin");
      }
      await prisma.user.update({
        where: { id: id },
        data: {
          deletedAt: new Date(),
        },
      });

      const totalUsers = await prisma.user.count({
        where: {
          role: { slug: { not: "superAdmin" } },
          deletedAt: { equals: null },
        },
      });

      const response = NextResponse.json({
        success: true,
        message: "User Deleted Successfully",
        statusCode: HttpStatusCode.Created,
        count: totalUsers,
      });

      return response;
    }
    throw new ApiError(HttpStatusCode.NotFound, "User not found");
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
  }
}

export async function GET(req: NextRequest, { params }: any) {
  try {
    const id = Number(params.id);
    const user = await prisma.user.findFirst({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
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

    throw new ApiError(HttpStatusCode.NotFound, "User Not Found.");
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
  }
}
