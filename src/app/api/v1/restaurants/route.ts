import { verifyToken } from "@/services/backend/jwt.service";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { badRequest, notFound } from "@/core/errors/http.error";
import { messages } from "@/messages/backend/index.message";
import { errorResponse } from "@/core/http-responses/error.http-response";

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
    if (userData?.role != "restaurantAdmin") {
      throw badRequest(messages.error.notAllowed);
    }
    const {
      name,
      email,
      imageData,
      phoneNumber,
      street,
      city,
      zipCode,
      state,
      country,
    } = await request.json();

    let userID = Number(userData?.id);

    const existingRestaurant = await prisma.restaurant.findFirst({
      where: { email: email, userId: userID },
    });

    if (existingRestaurant?.id) {
      throw badRequest("Restaurant already exists with this email");
    }

    const location = await prisma.location.create({
      data: {
        street: street,
        city: city,
        zipCode: zipCode,
        state: state,
        country: country,
      },
    });

    if (
      imageData.imageMimetype !== "image/jpeg" &&
      imageData.imageMimetype !== "image/png"
    ) {
      throw badRequest("Only .jpg and .png images allowed");
    }

    const fullImageBuffer = Buffer.from(imageData.fullImage, "base64");
    const thumbnailImageBuffer = Buffer.from(
      imageData.thumbnailImage,
      "base64"
    );

    let fileExtension;
    if (imageData.imageMimetype == "image/jpeg") {
      fileExtension = "jpg";
    } else if (imageData.imageMimetype == "image/png") {
      fileExtension = "png";
    }

    const fullImagePath = path.join(
      process.cwd(),
      "public",
      "assets",
      "images",
      "restaurants",
      `${imageData.imageName}.${fileExtension}`
    );
    const thumbnailImagePath = path.join(
      process.cwd(),
      "public",
      "assets",
      "images",
      "restaurants",
      "thumbnail",
      `${imageData.imageName}.${fileExtension}`
    );

    await fs.writeFile(fullImagePath, fullImageBuffer);
    await fs.writeFile(thumbnailImagePath, thumbnailImageBuffer);

    await prisma.restaurant.create({
      data: {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        userId: userID,
        locationId: location.id,
        image: `${imageData.imageName}.${fileExtension}`,
      },
    });

    const response = NextResponse.json({
      success: true,
      message: "Restaurant Added Successfully",
      statusCode: HttpStatusCode.Created,
    });

    return response;
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

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
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

    const restaurants = await prisma.restaurant.findMany({
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

    if (restaurants.length != 0) {
      return NextResponse.json({
        success: true,
        result: restaurants,
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
    const {
      id,
      name,
      email,
      imageData,
      phoneNumber,
      street,
      city,
      zipCode,
      state,
      country,
    } = await request.json();
    const existingRestaurant = await prisma.restaurant.findFirst({
      where: { id: id, userId: userData?.id },
    });

    if (!existingRestaurant?.id) {
      throw notFound("Restaurant not found");
    }

    const restaurantWithExistingEmail = await prisma.restaurant.findFirst({
      where: { email: email, id: { not: id } },
      select: { id: true },
    });

    if (restaurantWithExistingEmail != null) {
      throw badRequest("Restaurant already exists with this email");
    }

    let fileExtension;
    if (imageData.imageName !== undefined) {
      if (
        imageData.imageMimetype !== "image/jpeg" &&
        imageData.imageMimetype !== "image/png"
      ) {
        throw badRequest("Only .jpg and .png images allowed");
      }

      const fullImageBuffer = Buffer.from(imageData.fullImage, "base64");
      const thumbnailImageBuffer = Buffer.from(
        imageData.thumbnailImage,
        "base64"
      );

      if (imageData.imageMimetype == "image/jpeg") {
        fileExtension = "jpg";
      } else if (imageData.imageMimetype == "image/png") {
        fileExtension = "png";
      }

      const fullImagePath = path.join(
        process.cwd(),
        "public",
        "assets",
        "images",
        "restaurants",
        `${imageData.imageName}.${fileExtension}`
      );
      const thumbnailImagePath = path.join(
        process.cwd(),
        "public",
        "assets",
        "images",
        "restaurants",
        "thumbnail",
        `${imageData.imageName}.${fileExtension}`
      );

      const fullImagePathToDelete = path.join(
        process.cwd(),
        "public",
        "assets",
        "images",
        "restaurants",
        existingRestaurant.image
      );
      const thumbnailImagePathToDelete = path.join(
        process.cwd(),
        "public",
        "assets",
        "images",
        "restaurants",
        "thumbnail",
        existingRestaurant.image
      );

      await fs.unlink(fullImagePathToDelete);
      await fs.unlink(thumbnailImagePathToDelete);

      await fs.writeFile(fullImagePath, fullImageBuffer);
      await fs.writeFile(thumbnailImagePath, thumbnailImageBuffer);
    }

    await prisma.location.update({
      where: {
        id: existingRestaurant.locationId,
      },
      data: {
        city: city,
        street: street,
        state: state,
        zipCode: zipCode,
        country: country,
        updatedAt: new Date(),
      },
    });

    await prisma.restaurant.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        image:
          imageData.imageName !== undefined
            ? `${imageData.imageName}.${fileExtension}`
            : existingRestaurant.image,
        updatedAt: new Date(),
      },
    });

    const response = NextResponse.json({
      success: true,
      message: "Restaurant Updated Successfully",
      statusCode: HttpStatusCode.Ok,
    });

    return response;
  } catch (error: any) {
    return errorResponse(error);
  }
}
