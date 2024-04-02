import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createOrder = async (
  amount: number,
  taxAmount: number,
  itemCount: number,
  restaurantId: number,
  userId: number
) => {
  await prisma.order.create({
    data: {
      amount: amount,
      taxAmount: taxAmount,
      items: itemCount,
      restaurantId: restaurantId,
      userId: userId,
    },
  });
  return true;
};
