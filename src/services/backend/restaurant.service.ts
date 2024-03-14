import { badRequest, notFound } from "@/core/errors/http.error";
import { CreateRestaurant } from "@/interfaces/backend/resturant.interface";
import { messages } from "@/messages/backend/index.message";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export const validateEmail = (email: string) => {
  if (!email.trim()) {
    throw badRequest("Please enter email");
  }
  if (
    !email.match(
      "^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+.[a-zA-Z]+"
    )
  ) {
    throw badRequest(messages.error.invalidEmail);
  }
};

const checkEmailExists = async (email: string, userId: number) => {
  validateEmail(email);
  const existingRestaurant = await prisma.restaurant.findFirst({
    where: { email: email, userId: userId },
  });

  if (existingRestaurant?.id) {
    throw true;
  }

  return false;
};

export const createRestaurant = async (
  restaurant: CreateRestaurant,
  userId: number
) => {
  const restaurantExists = await checkEmailExists(restaurant.email, userId);
  if (restaurantExists) {
    throw badRequest(messages.error.emailAlreadyExists);
  }

  if (
    restaurant.imageData.imageMimetype !== "image/jpeg" &&
    restaurant.imageData.imageMimetype !== "image/png"
  ) {
    throw badRequest("Only .jpg and .png images allowed");
  }

  const fullImageBuffer = Buffer.from(restaurant.imageData.fullImage, "base64");
  const thumbnailImageBuffer = Buffer.from(
    restaurant.imageData.thumbnailImage,
    "base64"
  );

  let fileExtension;
  if (restaurant.imageData.imageMimetype == "image/jpeg") {
    fileExtension = "jpg";
  } else if (restaurant.imageData.imageMimetype == "image/png") {
    fileExtension = "png";
  }

  const fullImagePath = path.join(
    process.cwd(),
    "public",
    "assets",
    "images",
    "restaurants",
    `${restaurant.imageData.imageName}.${fileExtension}`
  );
  const thumbnailImagePath = path.join(
    process.cwd(),
    "public",
    "assets",
    "images",
    "restaurants",
    "thumbnail",
    `${restaurant.imageData.imageName}.${fileExtension}`
  );

  await fs.writeFile(fullImagePath, fullImageBuffer);
  await fs.writeFile(thumbnailImagePath, thumbnailImageBuffer);

  await prisma.restaurant.create({
    data: {
      name: restaurant.name,
      email: restaurant.email,
      phoneNumber: restaurant.phoneNumber,
      userId: userId,
      image: `${restaurant.imageData.imageName}.${fileExtension}`,
      street: restaurant.street,
      city: restaurant.city,
      zipcode: restaurant.zipcode,
      state: restaurant.state,
      country: restaurant.country,
    },
  });

  return true;
};

export const updateRestaurant = async (
  id: number,
  updateRestaurant: CreateRestaurant,
  userId: number
) => {
  const existingRestaurant = await prisma.restaurant.findFirst({
    where: { id: id, userId: userId },
  });

  if (!existingRestaurant?.id) {
    throw notFound(messages.error.restaurantNotFound);
  }

  const restaurantWithExistingEmail = await prisma.restaurant.findFirst({
    where: { email: updateRestaurant.email, id: { not: id } },
    select: { id: true },
  });

  if (restaurantWithExistingEmail != null) {
    throw badRequest("Restaurant already exists with this email");
  }

  let fileExtension;
  if (updateRestaurant.imageData.imageName !== undefined) {
    if (
      updateRestaurant.imageData.imageMimetype !== "image/jpeg" &&
      updateRestaurant.imageData.imageMimetype !== "image/png"
    ) {
      throw badRequest("Only .jpg and .png images allowed");
    }

    const fullImageBuffer = Buffer.from(
      updateRestaurant.imageData.fullImage,
      "base64"
    );
    const thumbnailImageBuffer = Buffer.from(
      updateRestaurant.imageData.thumbnailImage,
      "base64"
    );

    if (updateRestaurant.imageData.imageMimetype == "image/jpeg") {
      fileExtension = "jpg";
    } else if (updateRestaurant.imageData.imageMimetype == "image/png") {
      fileExtension = "png";
    }

    const fullImagePath = path.join(
      process.cwd(),
      "public",
      "assets",
      "images",
      "restaurants",
      `${updateRestaurant.imageData.imageName}.${fileExtension}`
    );
    const thumbnailImagePath = path.join(
      process.cwd(),
      "public",
      "assets",
      "images",
      "restaurants",
      "thumbnail",
      `${updateRestaurant.imageData.imageName}.${fileExtension}`
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

  await prisma.restaurant.update({
    where: {
      id: id,
    },
    data: {
      name: updateRestaurant.name,
      email: updateRestaurant.email,
      phoneNumber: updateRestaurant.phoneNumber,
      image:
        updateRestaurant.imageData.imageName !== undefined
          ? `${updateRestaurant.imageData.imageName}.${fileExtension}`
          : existingRestaurant.image,
      city: updateRestaurant.city,
      street: updateRestaurant.street,
      state: updateRestaurant.state,
      zipcode: updateRestaurant.zipcode,
      country: updateRestaurant.country,
      updatedAt: new Date(),
    },
  });

  return true;
};

export const restaurantList = async (
  search: string,
  sortBy: string,
  sortOrder: string,
  skip: number,
  take: number,
  userId: number
) => {
  let whereCondition: any = {
    userId: userId,
    deletedAt: { equals: null },
  };

  const orderBy = {
    [sortBy]: sortOrder,
  };

  if (search) {
    whereCondition = {
      AND: [
        {
          userId: userId,
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
              street: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              city: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              phoneNumber: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              state: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              country: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              zipcode: {
                contains: search,
                mode: "insensitive",
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
  });

  const totalRestaurants = await prisma.restaurant.count({
    where: {
      userId: userId,
      deletedAt: { equals: null },
    },
  });

  return { rows: restaurants, count: totalRestaurants };
};

export const getRestaurantById = async (id: number, userId: number) => {
  const restaurant = await prisma.restaurant.findFirst({
    where: { id: id, userId: userId },
  });

  if (restaurant?.id) {
    return {
      data: {
        success: true,
        details: restaurant,
      },
    };
  }

  throw notFound(messages.error.restaurantNotFound);
};

export const deleteRestaurnatById = async (id: number, userId: number) => {
  const restaurant = await prisma.restaurant.findFirst({
    where: { id: id, userId: userId },
    select: {
      id: true,
    },
  });
  if (restaurant?.id) {
    await prisma.restaurant.update({
      where: { id: id },
      data: {
        deletedAt: new Date(),
      },
    });

    const totalRestaurants = await prisma.restaurant.count({
      where: {
        deletedAt: { equals: null },
      },
    });

    return {
      data: {
        success: true,
        message: messages.response.deleteRestaurant,
        count: totalRestaurants,
      },
    };
  }
  throw notFound(messages.error.restaurantNotFound);
};
