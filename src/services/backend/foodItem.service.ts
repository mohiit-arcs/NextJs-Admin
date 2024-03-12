import { badRequest, notFound } from "@/core/errors/http.error";
import { CreateFoodItem } from "@/interfaces/backend/foodItem.interface";
import { messages } from "@/messages/backend/index.message";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const checkFoodItemExists = async (foodItemName: string, userId: number) => {
  const existingFoodItem = await prisma.foodItem.findFirst({
    where: {
      userId: userId,
      name: foodItemName,
    },
  });

  if (existingFoodItem?.id) {
    return true;
  }
  return false;
};

export const createFoodItem = async (
  foodItem: CreateFoodItem,
  restaurantId: number,
  categoryId: number,
  userId: number
) => {
  const foodItemExists = await checkFoodItemExists(foodItem.name, userId);
  if (foodItemExists) {
    throw badRequest(messages.error.foodItemAlreadyExists);
  }

  await prisma.foodItem.create({
    data: {
      name: foodItem.name,
      userId: userId,
      menu: {
        create: {
          restaurantId: restaurantId,
          menuCategoryId: categoryId,
        },
      },
    },
  });

  return true;
};

export const updateFoodItem = async (
  id: number,
  updateFoodItem: CreateFoodItem,
  userId: number
) => {
  const existingFoodItem = await prisma.foodItem.findFirst({
    where: { id: id, userId: userId },
  });
  if (!existingFoodItem?.id) {
    throw badRequest(messages.error.foodItemNotFound);
  }

  const foodItemWithExistingName = await prisma.user.findFirst({
    where: { name: updateFoodItem.name, id: { not: id } },
    select: { id: true },
  });

  if (foodItemWithExistingName != null) {
    throw badRequest(messages.error.foodItemAlreadyExists);
  }

  await prisma.foodItem.update({
    where: {
      id: id,
    },
    data: {
      name: updateFoodItem.name,
      updatedAt: new Date(),
    },
  });

  return true;
};

export const foodItemList = async (
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

  const foodItemsCount = await prisma.foodItem.count({
    where: {
      userId: userId,
      deletedAt: null,
    },
  });

  return { foodItems: processedData, count: foodItemsCount };
};

export const getFoodItemById = async (id: number, userId: number) => {
  const foodItem = await prisma.foodItem.findFirst({
    where: { id: id, userId: userId },
    select: {
      id: true,
      name: true,
      menu: {
        select: {
          restaurant: true,
          menuCategory: true,
        },
      },
    },
  });

  if (foodItem?.id) {
    return {
      data: {
        success: true,
        details: foodItem,
      },
    };
  }

  throw notFound(messages.error.foodItemNotFound);
};

export const addToMenu = async (
  id: number,
  restaurantId: number,
  categoryId: number,
  userId: number
) => {
  const existingFoodItem = await prisma.foodItem.findFirst({
    where: { id: id, userId: userId },
    select: {
      id: true,
      menu: {
        where: {
          restaurantId: restaurantId,
          menuCategoryId: categoryId,
        },
      },
    },
  });

  if (existingFoodItem?.id) {
    if (existingFoodItem?.menu.length != 0) {
      throw badRequest("Food Item Already Added");
    }

    await prisma.foodItem.update({
      where: { id: id, userId: userId },
      data: {
        menu: {
          create: {
            restaurantId: restaurantId,
            menuCategoryId: categoryId,
          },
        },
      },
    });

    return {
      data: {
        success: true,
        message: messages.response.foodItemAddToMenu,
      },
    };
  }

  throw badRequest(messages.error.foodItemNotFound);
};

export const removeFromMenu = async (
  id: number,
  restaurantId: number,
  categoryId: number,
  userId: number
) => {
  const existingFoodItem = await prisma.foodItem.findFirst({
    where: { id: id, userId: userId },
    select: {
      id: true,
    },
  });

  if (existingFoodItem?.id) {
    await prisma.foodItem.update({
      where: { id: id, userId: userId },
      data: {
        menu: {
          deleteMany: {
            restaurantId: restaurantId,
            menuCategoryId: categoryId,
          },
        },
      },
    });

    return {
      data: {
        success: true,
        message: messages.response.foodItemRemoveFromMenu,
      },
    };
  }

  throw badRequest(messages.error.foodItemNotFound);
};
