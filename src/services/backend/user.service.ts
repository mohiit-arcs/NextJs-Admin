import { badRequest, notFound } from "@/core/errors/http.error";
import { CreateUser } from "@/interfaces/backend/user.interface";
import { messages } from "@/messages/backend/index.message";
import { PrismaClient, RoleSlug } from "@prisma/client";
import bcrypt from "bcrypt";
import { comparePassword, validatePassword } from "./auth.service";

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

export const checkEmailExists = async (email: string) => {
  validateEmail(email);
  const existingUser = await prisma.user.findFirst({
    where: { email: email },
  });

  if (existingUser?.id) {
    return true;
  }

  return false;
};

export const create = async (user: CreateUser) => {
  const userExists = await checkEmailExists(user.email);
  if (userExists) {
    throw badRequest(messages.error.emailAlreadyExists);
  }

  const userRole = await prisma.role.upsert({
    where: { slug: user.roleSlug },
    create: {
      name: user.name,
      slug: user.roleSlug,
    },
    update: {},
  });

  const hashedPassword = await bcrypt.hash(user.password, 10);

  await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      password: hashedPassword,
      roleId: userRole.id,
    },
  });

  return true;
};

export const updateUser = async (
  id: number,
  updateUser: { name: string; email: string; roleSlug: RoleSlug }
) => {
  const existingUser = await prisma.user.findFirst({
    where: { id: id },
  });

  if (!existingUser?.id) {
    throw notFound(messages.error.userNotFound);
  }

  const userWithExistingEmail = await prisma.user.findFirst({
    where: { email: updateUser.email, id: { not: id } },
    select: { id: true },
  });

  if (userWithExistingEmail != null) {
    throw badRequest(messages.error.emailAlreadyExists);
  }

  const role = await prisma.role.findFirst({
    where: {
      slug: updateUser.roleSlug,
    },
  });

  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      name: updateUser.name,
      email: updateUser.email,
      roleId: role?.id,
      updatedAt: new Date(),
    },
  });

  return true;
};

export const userList = async (
  search: string,
  sortBy: string,
  sortOrder: string,
  skip: number,
  take: number
) => {
  let whereCondition: any = {
    role: { slug: { not: "superAdmin" } },
    deletedAt: { equals: null },
  };

  const orderBy: any =
    sortBy === "role"
      ? {
          role: {
            slug: sortOrder,
          },
        }
      : {
          [sortBy]: sortOrder,
        };

  if (search) {
    whereCondition = {
      AND: [
        whereCondition,
        {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              role: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
      ],
    };
  }

  const users = await prisma.user.findMany({
    where: whereCondition,
    skip: skip,
    take: take,
    orderBy,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      roleId: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      password: false,
    },
  });

  const totalUsers = await prisma.user.count({
    where: {
      role: { slug: { not: "superAdmin" } },
      deletedAt: { equals: null },
    },
  });

  return { rows: users, count: totalUsers };
};

export const deleteUserById = async (id: number) => {
  const user = await prisma.user.findFirst({
    where: { id: id },
    select: {
      id: true,
      role: true,
    },
  });
  if (user?.id) {
    if (user.role.slug == "superAdmin") {
      throw badRequest(messages.error.notAllowed);
    }
    await prisma.user.update({
      where: { id: id },
      data: {
        deletedAt: new Date(),
      },
    });

    const totalUsers = await prisma.user.count({
      where: {
        role: { slug: { not: "superAdmin" } },
        deletedAt: { equals: null },
      },
    });

    return {
      data: {
        success: true,
        message: messages.response.deleteUser,
        count: totalUsers,
      },
    };
  }
  throw notFound(messages.error.userNotFound);
};

export const getUserById = async (id: number) => {
  const user = await prisma.user.findFirst({
    where: { id: id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (user?.id) {
    return {
      details: user,
    };
  }

  throw notFound(messages.error.userNotFound);
};

export const getUserRoles = async () => {
  const roles = await prisma.role.findMany({
    where: {
      slug: { not: "superAdmin" },
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return { result: roles, count: roles.length };
};

export const getMenuCategories = async () => {
  const menuCategories = await prisma.menuCategory.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return { result: menuCategories, count: menuCategories.length };
};

export const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
) => {
  validatePassword(currentPassword);
  validatePassword(newPassword);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      password: true,
    },
  });
  if (!user?.id) {
    throw badRequest(messages.error.userNotFound);
  }

  const match = await comparePassword(currentPassword, user.password);

  if (!match) {
    throw badRequest(messages.error.invalidCurrentPassword);
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedNewPassword,
    },
  });

  return true;
};
