import { badRequest, notFound } from "@/core/errors/http.error";
import { messages } from "@/messages/backend/index.message";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const checkMenuCategoryExists = async (
  name: string,
  userId: number,
  restaurantId: number
) => {
  const existingMenuCategory = await prisma.menuCategory.findFirst({
    where: {
      name: name,
      userId: userId,
      restaurantId: restaurantId,
    },
  });

  if (existingMenuCategory?.id) {
    return true;
  }
  return false;
};

export const createMenuCategory = async (
  createMenuCategory: CreateMenuCategory,
  restaurantId: number,
  userId: number
) => {
  const menuCategoryExists = await checkMenuCategoryExists(
    createMenuCategory.name,
    userId,
    restaurantId
  );
  if (menuCategoryExists) {
    throw badRequest(messages.error.menuCategoryAlreadyExists);
  }

  await prisma.menuCategory.create({
    data: {
      name: createMenuCategory.name,
      userId: userId,
      restaurantId: restaurantId,
    },
  });

  return true;
};

export const updateMenuCategory = async (
  updateMenuCategory: CreateMenuCategory,
  id: number
) => {
  const existingMenuCategory = await prisma.menuCategory.findFirst({
    where: {
      name: updateMenuCategory.name,
      id: id,
    },
  });

  if (!existingMenuCategory?.id) {
    badRequest(messages.error.menuCategoryNotFound);
  }

  await prisma.menuCategory.update({
    where: {
      id: id,
    },
    data: {
      name: updateMenuCategory.name,
    },
  });

  return true;
};

export const getMenuCategoryById = async (id: number, userId: number) => {
  const menuCategory = await prisma.menuCategory.findFirst({
    where: {
      id: id,
      userId: userId,
    },
  });

  if (menuCategory?.id) {
    return {
      data: {
        success: true,
        details: menuCategory,
      },
    };
  }

  throw notFound(messages.error.menuCategoryNotFound);
};

export const listMenuCategory = async (
  search: string,
  sortBy: string,
  sortOrder: string,
  skip: number,
  take: number,
  userId: number,
  restaurantId?: number
) => {
  let whereCondition: any;
  if (!Number.isNaN(restaurantId)) {
    whereCondition = {
      userId: userId,
      restaurantId: restaurantId,
      deletedAt: { equals: null },
    };
  } else {
    whereCondition = {
      userId: userId,
      deletedAt: { equals: null },
    };
  }
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

  const menuCategories = await prisma.menuCategory.findMany({
    skip,
    take,
    orderBy,
    where: whereCondition,
    select: {
      id: true,
      name: true,
      restaurant: true,
      _count: true,
    },
  });

  return { rows: menuCategories, count: menuCategories.length };
};
