import { badRequest, notFound } from "@/core/errors/http.error";
import { messages } from "@/messages/backend/index.message";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCart = async (
  amount: number,
  taxAmount: number,
  totalAmount: number,
  restaurantId: number,
  foodItems: any[],
  userId: number
) => {
  const existingCart = await prisma.cart.findFirst({
    where: {
      userId: userId,
      deletedAt: null,
    },
  });

  if (existingCart?.id) {
    return badRequest(messages.error.cartAlreadyExists);
  }

  await prisma.cart.create({
    data: {
      amount: amount,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
      userId: userId,
      restaurantId: restaurantId,
      cartItems: {
        create: foodItems.map((foodItem) => {
          return {
            foodItemId: foodItem.id,
            quantity: foodItem.quantity,
            price: foodItem.price,
          };
        }),
      },
    },
    select: {
      id: true,
      cartItems: true,
    },
  });

  return true;
};

export const getCartDetails = async (userId: number) => {
  const cartData = await prisma.cart.findFirst({
    where: {
      userId: userId,
      deletedAt: null,
    },
    select: {
      id: true,
      amount: true,
      taxAmount: true,
      totalAmount: true,
      cartItems: {
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          foodItemId: true,
          quantity: true,
          price: true,
        },
      },
      restaurantId: true,
      userId: true,
    },
  });
  return cartData;
};

export const updateCartItem = async (
  amount: number,
  taxAmount: number,
  totalAmount: number,
  cartItemId: number,
  quantity: number,
  userId: number
) => {
  const cart = await prisma.cart.findFirst({
    where: {
      userId: userId,
    },
  });
  await prisma.cart.update({
    where: {
      id: cart?.id,
    },
    data: {
      amount: amount,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
      cartItems: {
        update: {
          where: {
            id: cartItemId,
            deletedAt: null,
          },
          data: {
            quantity: quantity,
          },
        },
      },
    },
  });
  return true;
};

export const addItemToCart = async (
  amount: number,
  taxAmount: number,
  totalAmount: number,
  cartId: number,
  foodItem: any,
  userId: number
) => {
  await prisma.cart.update({
    where: {
      id: cartId,
      userId: userId,
    },
    data: {
      amount: amount,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
      cartItems: {
        create: {
          foodItemId: foodItem.id,
          quantity: foodItem.quantity,
          price: foodItem.price,
        },
      },
    },
  });
  return true;
};

export const removeItemFromCart = async (
  amount: number,
  taxAmount: number,
  totalAmount: number,
  cartId: number,
  cartItemId: number,
  userId: number
) => {
  await prisma.cart.update({
    where: {
      id: cartId,
      userId: userId,
    },
    data: {
      amount: amount,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
      cartItems: {
        update: {
          where: {
            id: cartItemId,
          },
          data: {
            quantity: 0,
            deletedAt: new Date(),
          },
        },
      },
    },
  });
  return true;
};

export const clearCart = async (cartId: number, userId: number) => {
  const existingCart = await prisma.cart.findFirst({
    where: {
      id: cartId,
      userId: userId,
    },
  });

  if (!existingCart?.id) {
    return notFound(messages.error.cartNotFoud);
  }

  await prisma.cart.update({
    where: {
      id: cartId,
      userId: userId,
    },
    data: {
      cartItems: {
        updateMany: [
          {
            where: {
              cartId: cartId,
            },
            data: {
              deletedAt: new Date(),
            },
          },
        ],
      },
      deletedAt: new Date(),
    },
  });
  return true;
};
