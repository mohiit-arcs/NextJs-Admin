import { verifyToken } from "@/services/backend/jwt.service";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(
      HttpStatusCode.Unauthorized,
      "Authorization token is missing or invalid"
    );
  }
  const token = authHeader.replace("Bearer ", "");
  const userData = await verifyToken(token);
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
      userId: userData?.id,
      deletedAt: { equals: null },
    };

    const orderBy = {
      [sortBy]: sortOrder,
    };

    if (search) {
      whereCondition = {
        AND: [
          {
            userId: 26,
            deletedAt: {
              equals: null,
            },
          },
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
                location: {
                  street: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
              {
                location: {
                  city: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
              {
                phoneNumber: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                location: {
                  state: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
              {
                location: {
                  country: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
              {
                location: {
                  zipCode: {
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

    const users = await prisma.restaurant.findMany({
      where: whereCondition,
      skip: skip,
      take: take,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        location: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    const totalRestaurants = await prisma.restaurant.count({
      where: {
        userId: userData?.id,
        deletedAt: { equals: null },
      },
    });

    if (users.length != 0) {
      return NextResponse.json({
        success: true,
        result: users,
        count: totalRestaurants,
        statusCode: HttpStatusCode.Ok,
      });
    }

    return NextResponse.json({
      success: true,
      result: [],
      count: totalRestaurants,
      statusCode: HttpStatusCode.Ok,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
  }
}
