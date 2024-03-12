import { badRequest } from "@/core/errors/http.error";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { messages } from "@/messages/backend/index.message";
import { updateUser, userList } from "@/services/backend/user.service";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search")?.trim() || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    if (isNaN(parseInt(page)) || isNaN(parseInt(limit))) {
      throw badRequest(messages.error.badRequest);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    const response = await userList(search, sortBy, sortOrder, skip, take);

    return NextResponse.json({
      success: true,
      result: response.users,
      count: response.count,
      statusCode: HttpStatusCode.Ok,
    });
  } catch (error: any) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, name, email, role } = await request.json();

    const updatedUser = {
      name,
      email,
      roleSlug: role.slug,
    };

    return successResponse({
      data: {
        success: await updateUser(Number(id), updatedUser),
      },
      message: messages.response.requestUpdated,
    });
  } catch (error: any) {
    return errorResponse(error);
  }
}
