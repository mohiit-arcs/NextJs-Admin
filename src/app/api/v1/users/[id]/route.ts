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
    });
    if (user?.id) {
      if (user.roleId == 1) {
        throw new ApiError(HttpStatusCode.NotFound, "Cannot Delete SuperAdmin");
      }
      await prisma.user.update({
        where: { id: id },
        data: {
          deletedAt: new Date(),
        },
      });

      const response = NextResponse.json({
        success: true,
        message: "User Deleted Successfully",
        statusCode: HttpStatusCode.Created,
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
