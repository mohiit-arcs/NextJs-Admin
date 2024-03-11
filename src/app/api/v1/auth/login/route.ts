import { NextRequest } from "next/server";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { login } from "@/services/backend/auth.service";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const response = await login(email, password);
    return response;
  } catch (error: any) {
    return errorResponse(error);
  }
}
