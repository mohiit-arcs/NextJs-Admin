import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getOrdersListByRestaurantId = async (
  search: string,
  sortBy: string,
  sortOrder: string,
  skip: number,
  take: number,
  restaurantId: number
) => {
  let whereCondition: any = {
    restaurantId: restaurantId,
    deletedAt: { equals: null },
  };

  const orderBy = {
    [sortBy]: sortOrder,
  };

  if (search) {
    whereCondition = {
      AND: [
        {
          restaurantId: restaurantId,
          deletedAt: {
            equals: null,
          },
        },
        {
          OR: [
            {
              restaurantId: restaurantId,
              deletedAt: { equals: null },
            },
            {
              restaurant: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              user: {
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

  const orders = await prisma.order.findMany({
    where: whereCondition,
    select: {
      id: true,
      status: true,
      amount: true,
      taxAmount: true,
      items: true,
      user: {
        select: { name: true },
      },
      restaurant: {
        select: { name: true },
      },
    },
    skip,
    take,
    orderBy,
  });

  const totalOrders = await prisma.order.count({
    where: {
      restaurantId: restaurantId,
      deletedAt: { equals: null },
    },
  });

  return { rows: orders, count: totalOrders };
};
