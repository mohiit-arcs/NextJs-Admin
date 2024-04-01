import { ApiRequest } from "@/interfaces/backend/request.interface";
import { messages } from "@/messages/backend/index.message";
import { login } from "@/services/backend/app/user.service";
import { NextResponse } from "next/server";

export async function POST(request: ApiRequest) {
  try {
    const { email, password } = await request.json();
    const loginResponse = await login(email, password);
    const response = NextResponse.json({
      message: messages.response.login,
      success: loginResponse.success,
      profile: loginResponse.profile,
      token: loginResponse.token,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
  }
}
