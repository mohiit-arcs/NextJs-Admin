import bcrypt from "bcrypt";
import { badRequest, notFound, unauthorized } from "@/core/errors/http.error";
import { messages } from "@/messages/backend/index.message";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "./jwt.service";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const validateEmail = (email: string) => {
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

export const validatePassword = (password: string) => {
  if (!password.trim()) {
    throw badRequest(messages.error.invalidPassword);
  }
};

const validate = (email: string, password: string) => {
  validateEmail(email);
  validatePassword(password);
};

export const comparePassword = async (
  enteredPassword: string,
  dbPassword: string
) => {
  return await bcrypt.compare(enteredPassword, dbPassword);
};

export const login = async (email: string, password: string) => {
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

  if (!user?.id) {
    throw notFound(messages.error.userNotFound);
  }

  const validPassword = await comparePassword(password, user.password);
  if (!validPassword) {
    throw unauthorized(messages.error.invalidCreds);
  }

  const profile = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.slug,
  };

  if (profile.role == "customer") {
    throw unauthorized(messages.error.notAdmin);
  }

  const token = await generateToken(profile);

  const response = {
    success: true,
    profile,
    token: token,
  };

  return response;
};
