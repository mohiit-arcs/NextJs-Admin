import { badRequest } from "@/core/errors/http.error";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { messages } from "@/messages/backend/index.message";
import { acl } from "@/services/backend/acl.service";
import { updateUser, userList } from "@/services/backend/user.service";
import { NextRequest } from "next/server";

export const GET = acl("users", "full", async (request: NextRequest) => {
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
    return successResponse({
      data: await userList(search, sortBy, sortOrder, skip, take),
    });
  } catch (error: any) {
    return errorResponse(error);
  }
});

export const PATCH = acl("users", "full", async (request: NextRequest) => {
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
});
