import { badRequest, notFound } from "@/core/errors/http.error";
import { CreateTaxFee } from "@/interfaces/backend/taxFee.interface";
import { messages } from "@/messages/backend/index.message";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const checkTaxFeeExists = async (restaurantId: number) => {
  const existingTaxFee = await prisma.taxFee.findFirst({
    where: {
      restaurantId: restaurantId,
    },
  });

  if (existingTaxFee?.id) {
    return true;
  }

  return false;
};

export const createTaxFee = async (
  createTaxFee: CreateTaxFee,
  restaurantId: number
) => {
  const taxFeeExists = await checkTaxFeeExists(restaurantId);
  if (taxFeeExists) {
    throw badRequest(messages.error.taxFeeAlreadyExists);
  }

  await prisma.taxFee.create({
    data: {
      tax_name: createTaxFee.tax_name,
      tax_type: createTaxFee.tax_type,
      value: createTaxFee.value,
      restaurantId: restaurantId,
    },
  });

  return true;
};

export const updateTaxFee = async (id: number, updateTaxFee: CreateTaxFee) => {
  const existingTaxFee = await prisma.taxFee.findFirst({
    where: {
      id: id,
    },
  });

  if (!existingTaxFee?.id) {
    throw badRequest(messages.error.taxFeeNotFound);
  }

  await prisma.taxFee.update({
    where: {
      id: id,
    },
    data: {
      tax_name: updateTaxFee.tax_name,
      tax_type: updateTaxFee.tax_type,
      value: updateTaxFee.value,
    },
  });

  return true;
};

export const getTaxFeeById = async (id: number) => {
  const taxFee = await prisma.foodItem.findFirst({
    where: { id: id },
    select: {
      id: true,
      name: true,
      price: true,
      menu: {
        select: {
          restaurant: true,
          menuCategory: true,
        },
      },
    },
  });

  if (taxFee?.id) {
    return {
      data: {
        success: true,
        details: taxFee,
      },
    };
  }

  throw notFound(messages.error.taxFeeNotFound);
};

export const taxFeeList = async (
  search: string,
  sortBy: string,
  sortOrder: string,
  skip: number,
  take: number
) => {
  let whereCondition: any = {
    deletedAt: { equals: null },
  };
  const orderBy = {
    [sortBy]: sortOrder,
  };

  if (search) {
    whereCondition = {
      AND: [
        {
          deletedAt: {
            equals: null,
          },
        },
        {
          OR: [
            {
              tax_name: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
      ],
    };
  }

  const taxFeeItems = await prisma.foodItem.findMany({
    skip,
    take,
    orderBy,
    where: whereCondition,
    select: {
      id: true,
      name: true,
      price: true,
      menu: {
        select: {
          menuCategory: true,
          restaurant: true,
        },
      },
      _count: true,
    },
  });

  const taxFeeItemsCount = await prisma.foodItem.count({
    where: {
      deletedAt: null,
    },
  });

  return { rows: taxFeeItems, count: taxFeeItemsCount };
};
