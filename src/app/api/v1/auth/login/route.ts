import { NextRequest } from "next/server";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { login } from "@/services/backend/auth.service";
import { successResponse } from "@/core/http-responses/success.http-response";
import { messages } from "@/messages/backend/index.message";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    return successResponse({
      data: await login(email, password),
      message: messages.response.login,
    });
  } catch (error: any) {
    return errorResponse(error);
  }
}
