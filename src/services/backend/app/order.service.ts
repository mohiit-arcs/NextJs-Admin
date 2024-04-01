import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createOrder = async (
  amount: number,
  restaurantId: number,
  userId: number
) => {
  await prisma.order.create({
    data: {
      amount: amount,
      restaurantId: restaurantId,
      userId: userId,
    },
  });
  return true;
};
