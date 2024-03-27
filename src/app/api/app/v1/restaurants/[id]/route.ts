import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (request: ApiRequest, { params }: any) => {
  try {
    const id = Number(params.id);
    const menu = await prisma.restaurant.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      select: {
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

    return successResponse({
      data: menuArray,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
};
