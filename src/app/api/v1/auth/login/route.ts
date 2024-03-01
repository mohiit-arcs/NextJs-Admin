import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { ApiError } from "next/dist/server/api-utils";
import { HttpStatusCode } from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const validateEmail = (email: string) => {
  if (!email.trim()) {
    throw new ApiError(HttpStatusCode.BadRequest, "Please enter email");
  }
  if (
    !email.match(
      "^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+.[a-zA-Z]+"
    )
  ) {
    throw new ApiError(HttpStatusCode.BadRequest, "Please enter correct email");
  }
};

const validatePassword = (password: string) => {
  if (!password.trim()) {
    throw new ApiError(HttpStatusCode.BadRequest, "Please enter your password");
  }
};

const validate = (email: string, password: string) => {
  validateEmail(email);
  validatePassword(password);
};

const comparePassword = async (enteredPassword: string, dbPassword: string) => {
  return await bcrypt.compare(enteredPassword, dbPassword);
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    validate(email, password);

    const user = await prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      throw new ApiError(HttpStatusCode.NotFound, "User not found");
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      throw new ApiError(HttpStatusCode.Unauthorized, "Wrong Password!");
    }

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
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
