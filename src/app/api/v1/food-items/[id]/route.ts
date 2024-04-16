import { notFound } from "@/core/errors/http.error";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { acl } from "@/services/backend/acl.service";
import { getFoodItemById } from "@/services/backend/foodItem.service";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const DELETE = acl(
  "restaurants",
  "full",
  async (request: ApiRequest, { params }: any) => {
    try {
      const id = parseInt(params.id);
      const foodItem = await prisma.foodItem.findFirst({
        where: { id: id, userId: request.user?.id },
        select: {
          id: true,
        },
      });
      if (foodItem?.id) {
        await prisma.foodItem.update({
          where: { id: id },
          data: {
            deletedAt: new Date(),
          },
        });

        const totalFoodItems = await prisma.foodItem.count({
          where: {
            deletedAt: { equals: null },
          },
        });

        return successResponse({
          data: {
            success: true,
            count: totalFoodItems,
            message: "Food Item Deleted Successfully",
          },
        });
      }
      throw notFound("Food Item not found");
    } catch (error: any) {
      return errorResponse(error);
    }
  }
);

export const GET = acl(
  "restaurants",
  "full",
  async (request: ApiRequest, { params }: any) => {
    try {
      const id = Number(params.id);
      return successResponse({
        data: await getFoodItemById(id, request.user?.id!),
      });
    } catch (error: any) {
      return errorResponse(error);
    }
  }
);
