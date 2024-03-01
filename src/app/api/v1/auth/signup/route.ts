import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    const existingUser = await prisma.user.findFirst({
      where: { email, deletedAt: { equals: null } },
      select: {
        id: true,
      },
    });

    if (existingUser?.id) {
      throw new ApiError(HttpStatusCode.BadRequest, "User already exists");
    }

    const userRole = await prisma.role.upsert({
      where: { slug: role.slug },
      create: {
        name: role.name,
        slug: role.slug,
      },
      update: {},
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        roleId: userRole.id,
      },
    });

    const response = NextResponse.json({
      success: true,
      message: "User Added Successfully",
      statusCode: HttpStatusCode.Created,
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
