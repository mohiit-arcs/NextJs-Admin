import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createOrder = async (
  amount: number,
  taxAmount: number,
  totalAmount: number,
  restaurantId: number,
  foodItems: any[],
  userId: number
) => {
  await prisma.order.create({
    data: {
      amount: amount,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
      restaurantId: restaurantId,
      userId: userId,
      orderItems: {
        create: foodItems.map((foodItem) => {
          return {
            foodItemId: foodItem.foodItemId,
            quantity: foodItem.quantity,
            priceAtPurchase: foodItem.price,
          };
        }),
      },
    },
  });
  return true;
};
