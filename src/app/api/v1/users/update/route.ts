import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(request: NextRequest) {
  try {
    const { id, name, email, role } = await request.json();
    const existingUser = await prisma.user.findFirst({
      where: { id: id },
    });

    if (!existingUser?.id) {
      throw new ApiError(HttpStatusCode.BadRequest, "User not found");
    }

    const userWithExistingEmail = await prisma.user.findFirst({
      where: { email: email, id: { not: id } },
      select: { id: true },
    });

    if (userWithExistingEmail != null) {
      throw new ApiError(
        HttpStatusCode.BadRequest,
        "User already exists with this email"
      );
    }

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        email: email,
        roleId: role.id,
        updatedAt: new Date(),
      },
    });

    const response = NextResponse.json({
      success: true,
      message: "User Updated Successfully",
      statusCode: HttpStatusCode.Ok,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
  }
}
