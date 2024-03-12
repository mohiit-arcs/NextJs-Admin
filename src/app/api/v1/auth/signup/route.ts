import { NextRequest } from "next/server";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { messages } from "@/messages/backend/index.message";
import { create } from "@/services/backend/user.service";
import { CreateUser } from "@/interfaces/backend/user.interface";
import { successResponse } from "@/core/http-responses/success.http-response";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();
    const user: CreateUser = {
      name,
      email,
      password,
      roleSlug: role.slug,
    };
    return successResponse({
      data: {
        success: await create(user),
      },
      message: messages.response.signupUser,
    });
  } catch (error: any) {
    return errorResponse(error);
  }
}
