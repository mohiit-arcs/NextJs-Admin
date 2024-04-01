import { NextResponse } from "next/server";
import { signup } from "@/services/backend/app/user.service";
import { ApiRequest } from "@/interfaces/backend/request.interface";

export async function POST(request: ApiRequest) {
  try {
    const { name, email, password, role } = await request.json();

    const response = NextResponse.json(
      await signup(name, email, password, role)
    );

    return response;
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
  }
}
