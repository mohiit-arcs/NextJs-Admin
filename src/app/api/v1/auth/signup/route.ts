import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { badRequest } from "@/core/errors/http.error";
import { messages } from "@/messages/backend/index.message";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();
    const existingUser = await prisma.user.findFirst({
      where: { email: email },
    });

    if (existingUser?.id) {
      throw badRequest(messages.error.emailAlreadyExists);
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
    return errorResponse(error);
  }
}
