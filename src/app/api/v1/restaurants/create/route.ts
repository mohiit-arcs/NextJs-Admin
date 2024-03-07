import { verifyToken } from "@/services/backend/jwt.service";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

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
      throw new ApiError(
        HttpStatusCode.BadRequest,
        "Restaurant already exists with this email"
      );
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
      throw new ApiError(
        HttpStatusCode.BadRequest,
        "Only .jpg and .png images allowed"
      );
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
    return NextResponse.json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
  }
}
