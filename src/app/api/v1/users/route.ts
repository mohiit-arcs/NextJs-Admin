import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
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
    throw new ApiError(
      HttpStatusCode.BadRequest,
      "Invalid page or limit parameters"
    );
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
    return NextResponse.json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
  }
}