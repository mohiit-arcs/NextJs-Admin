import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { verifyToken } from "@/services/backend/jwt.service";
import {
  deleteRestaurnatById,
  getRestaurantById,
} from "@/services/backend/restaurant.service";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        HttpStatusCode.Unauthorized,
        "Authorization token is missing or invalid"
      );
    }
    const token = authHeader.replace("Bearer ", "");
    const userData = await verifyToken(token);
    const id = Number(params.id);
    return successResponse({
      data: await deleteRestaurnatById(id, userData?.id!),
    });
  } catch (error: any) {
    return errorResponse(error);
  }
}

export async function GET(request: NextRequest, { params }: any) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        HttpStatusCode.Unauthorized,
        "Authorization token is missing or invalid"
      );
    }
    const token = authHeader.replace("Bearer ", "");
    const userData = await verifyToken(token);
    const id = Number(params.id);
    return successResponse({
      data: await getRestaurantById(id, userData?.id!),
    });
  } catch (error: any) {
    return errorResponse(error);
  }
}
