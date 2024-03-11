import { badRequest } from "@/core/errors/http.error";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { verifyToken } from "@/services/backend/jwt.service";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        HttpStatusCode.Unauthorized,
        "Authorization token is missing or invalid"
      );
    }
    const token = authHeader.replace("Bearer ", "");
    const userData = await verifyToken(token);

    const { name, restaurantId, categoryId } = await request.json();

    if (isNaN(parseInt(restaurantId)) || isNaN(parseInt(categoryId))) {
      throw badRequest("You entered something wrong. Please try again");
    }

    const existingFoodItem = await prisma.foodItem.findFirst({
      where: {
        userId: userData?.id,
        name: name,
      },
    });

    if (existingFoodItem?.id) {
      throw badRequest("Food Item already present with this name");
    }
    if (name.trim() === "") {
      throw badRequest("Food Item name cannot be empty");
    }

    await prisma.foodItem.create({
      data: {
        name: name,
        userId: userData?.id,
        menu: {
          create: {
            restaurantId: parseInt(restaurantId),
            menuCategoryId: parseInt(categoryId),
          },
        },
      },
    });

    return NextResponse.json({
      data: {
        success: true,
        message: "Food Item created Successfully",
        statusCode: HttpStatusCode.Created,
      },
    });
  } catch (error: any) {
    console.log(error);
    return errorResponse(error);
  }
}

export async function GET(request: NextRequest) {
  try {
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
      throw badRequest("You entered something wrong. Please try again");
    }

    let whereCondition: any = {
      userId: userData?.id,
      deletedAt: { equals: null },
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const orderBy = {
      [sortBy]: sortOrder,
    };

    if (search) {
      whereCondition = {
        AND: [
          {
            userId: userData?.id,
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
            ],
          },
        ],
      };
    }

    const foodItems = await prisma.foodItem.findMany({
      skip,
      take,
      orderBy,
      where: whereCondition,
      select: {
        id: true,
        name: true,
        menu: {
          select: {
            menuCategory: true,
            restaurant: true,
          },
        },
        _count: true,
      },
    });

    const processedData = foodItems.map((foodItem) => {
      const restaurants: any = {};
      const categories: any = {};

      foodItem.menu.forEach((menuItem) => {
        restaurants[menuItem.restaurant.id] = {
          id: menuItem.restaurant.id,
          name: menuItem.restaurant.name,
          email: menuItem.restaurant.email,
          phoneNumber: menuItem.restaurant.phoneNumber,
        };

        categories[menuItem.menuCategory.id] = {
          id: menuItem.menuCategory.id,
          name: menuItem.menuCategory.name,
          slug: menuItem.menuCategory.slug,
        };
      });

      return {
        id: foodItem.id,
        name: foodItem.name,
        restaurants: Object.values(restaurants),
        categories: Object.values(categories),
      };
    });

    if (processedData.length != 0) {
      return NextResponse.json({
        success: true,
        result: processedData,
        count: processedData.length,
        statusCode: HttpStatusCode.Ok,
      });
    }

    return NextResponse.json({
      success: true,
      result: [],
      count: processedData.length,
      statusCode: HttpStatusCode.Ok,
    });
  } catch (error: any) {
    console.log(error);
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        HttpStatusCode.Unauthorized,
        "Authorization token is missing or invalid"
      );
    }
    const token = authHeader.replace("Bearer ", "");
    const userData = await verifyToken(token);
    const { id, name } = await request.json();
    const existingFoodItem = await prisma.foodItem.findFirst({
      where: { id: id, userId: userData?.id },
    });

    if (!existingFoodItem?.id) {
      throw badRequest("Food Item not found");
    }
    if (name.trim() === "") {
      throw badRequest("Food Item name cannot be empty");
    }

    const foodItemWithExistingName = await prisma.user.findFirst({
      where: { name: name, id: { not: id } },
      select: { id: true },
    });

    if (foodItemWithExistingName != null) {
      throw badRequest("Food Item already exists with this name");
    }

    await prisma.foodItem.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        updatedAt: new Date(),
      },
    });

    const response = NextResponse.json({
      success: true,
      message: "Food Item Updated Successfully",
      statusCode: HttpStatusCode.Ok,
    });

    return response;
  } catch (error: any) {
    return errorResponse(error);
  }
}
