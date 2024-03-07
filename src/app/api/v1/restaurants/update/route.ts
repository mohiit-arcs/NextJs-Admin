import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function PATCH(request: NextRequest) {
  try {
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
      where: { id: id },
    });

    if (!existingRestaurant?.id) {
      throw new ApiError(HttpStatusCode.BadRequest, "Restaurant not found");
    }

    const restaurantWithExistingEmail = await prisma.restaurant.findFirst({
      where: { email: email, id: { not: id } },
      select: { id: true },
    });

    if (restaurantWithExistingEmail != null) {
      throw new ApiError(
        HttpStatusCode.BadRequest,
        "Restaurant already exists with this email"
      );
    }

    let fileExtension;
    if (imageData.imageName !== undefined) {
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
    return NextResponse.json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
  }
}
