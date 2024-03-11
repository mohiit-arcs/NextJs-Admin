import { badRequest, notFound } from "@/core/errors/http.error";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { messages } from "@/messages/backend/index.message";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const search = searchParams.get("search")?.trim() || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  if (isNaN(parseInt(page)) || isNaN(parseInt(limit))) {
    throw badRequest("You entered something wrong. Please try again");
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  try {
    let whereCondition: any = {
      role: { slug: { not: "superAdmin" } },
      deletedAt: { equals: null },
    };

    const orderBy = {
      [sortBy]: sortOrder,
    };

    if (search) {
      whereCondition = {
        AND: [
          whereCondition,
          {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                role: {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            ],
          },
        ],
      };
    }

    const users = await prisma.user.findMany({
      where: whereCondition,
      skip: skip,
      take: take,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        roleId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        password: false,
      },
    });

    const totalUsers = await prisma.user.count({
      where: {
        role: { slug: { not: "superAdmin" } },
        deletedAt: { equals: null },
      },
    });

    if (users.length != 0) {
      return NextResponse.json({
        success: true,
        result: users,
        count: totalUsers,
        statusCode: HttpStatusCode.Ok,
      });
    }

    return NextResponse.json({
      success: true,
      result: [],
      count: totalUsers,
      statusCode: HttpStatusCode.Ok,
    });
  } catch (error: any) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, name, email, role } = await request.json();
    const existingUser = await prisma.user.findFirst({
      where: { id: id },
    });

    if (!existingUser?.id) {
      throw notFound(messages.error.userNotFound);
    }

    const userWithExistingEmail = await prisma.user.findFirst({
      where: { email: email, id: { not: id } },
      select: { id: true },
    });

    if (userWithExistingEmail != null) {
      throw badRequest(messages.error.emailAlreadyExists);
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
    return errorResponse(error);
  }
}
