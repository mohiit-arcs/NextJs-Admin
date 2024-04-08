import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllRestaurants = async () => {
  const restaurants = await prisma.restaurant.findMany({
    where: {
      deletedAt: null,
    },
  });

  return restaurants;
};

export const getRestaurantMenuById = async (id: number) => {
  const menu = await prisma.restaurant.findUnique({
    where: {
      id: id,
      deletedAt: null,
    },
    select: {
      name: true,
      taxFee: {
        select: {
          tax_name: true,
          tax_type: true,
          value: true,
        },
      },
      menu: {
        select: {
          menuCategory: true,
          foodItem: true,
        },
      },
    },
  });

  const categorizedMenu: any = {};
  menu?.menu.forEach((menuItem) => {
    const category = menuItem.menuCategory.name;
    if (!categorizedMenu[category]) {
      categorizedMenu[category] = [];
    }
    categorizedMenu[category].push(menuItem.foodItem);
  });

  const menuArray = Object.keys(categorizedMenu).map((category) => ({
    category,
    items: categorizedMenu[category],
  }));

  return {
    name: menu?.name,
    menu: menuArray,
    taxFee: menu?.taxFee,
  };
};
