import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (request: ApiRequest) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        deletedAt: null,
      },
    });

    return successResponse({
      data: restaurants,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
};
