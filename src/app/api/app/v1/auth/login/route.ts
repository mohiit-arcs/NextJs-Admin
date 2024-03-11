import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "@/services/backend/jwt.service";
import { badRequest, notFound, unauthorized } from "@/core/errors/http.error";
import { messages } from "@/messages/backend/index.message";

const prisma = new PrismaClient();

const validateEmail = (email: string) => {
  if (!email.trim()) {
    throw badRequest("Please enter email");
  }
  if (
    !email.match(
      "^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+.[a-zA-Z]+"
    )
  ) {
    throw badRequest(messages.error.invalidEmail);
  }
};

const validatePassword = (password: string) => {
  if (!password.trim()) {
    throw badRequest(messages.error.invalidPassword);
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

    if (!user || user.role.slug != "customer") {
      throw notFound(messages.error.userNotFound);
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      throw unauthorized(messages.error.invalidCreds);
    }

    const profile = {
      id: user.id,
      email: user.email,
      role: user.role.slug,
    };

    const token = await generateToken(profile);

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      profile,
      token: token,
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
