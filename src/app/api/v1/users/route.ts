import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: { slug: { not: "superAdmin" } },
        deletedAt: { equals: null },
      },
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

    if (users.length == 0) {
      return NextResponse.json({
        success: true,
        result: [],
        count: 0,
        statusCode: HttpStatusCode.Ok,
      });
    }

    if (users.length != 0) {
      return NextResponse.json({
        success: true,
        result: users,
        count: users.length,
        statusCode: HttpStatusCode.Ok,
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
  }
}
