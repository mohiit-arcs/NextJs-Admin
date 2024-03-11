import { badRequest, notFound } from "@/core/errors/http.error";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { messages } from "@/messages/backend/index.message";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
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
        throw badRequest(messages.error.notAllowed);
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
    throw notFound(messages.error.userNotFound);
  } catch (error: any) {
    return errorResponse(error);
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

    throw notFound(messages.error.userNotFound);
  } catch (error: any) {
    return errorResponse(error);
  }
}
