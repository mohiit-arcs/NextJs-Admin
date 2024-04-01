import { badRequest, notFound, unauthorized } from "@/core/errors/http.error";
import { messages } from "@/messages/backend/index.message";
import { PrismaClient, RoleSlug } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateToken } from "../jwt.service";
import { HttpStatusCode } from "axios";

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

export const signup = async (
  name: string,
  email: string,
  password: string,
  role: RoleSlug
) => {
  const existingUser = await prisma.user.findFirst({
    where: { email: email },
  });

  if (existingUser?.id) {
    throw badRequest(messages.error.emailAlreadyExists);
  }

  const userRole = await prisma.role.findFirst({
    where: { slug: role },
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
      roleId: userRole?.id!,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  const profile = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };

  const token = await generateToken(profile);

  return {
    success: true,
    message: "Registered Successfully",
    profile,
    token: token,
    statusCode: HttpStatusCode.Created,
  };
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
      role: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
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
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = await generateToken(profile);

  const response = {
    success: true,
    profile,
    token: token,
  };

  return response;
};
