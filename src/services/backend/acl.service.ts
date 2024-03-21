import { unauthorized } from "@/core/errors/http.error";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { messages } from "@/messages/backend/index.message";
import { PrismaClient, RoleSlug } from "@prisma/client";
import { verifyToken } from "./jwt.service";
import { NextResponse } from "next/server";
import { errorResponse } from "@/core/http-responses/error.http-response";

const prisma = new PrismaClient();

export const acl = (
  module: string,
  permissionSlug: string,
  handler: (req: ApiRequest, { params }: any) => Promise<NextResponse<unknown>>
) => {
  return async (request: ApiRequest, { params }: any) => {
    try {
      request = await authorize(request);

      const userId = request?.user?.id;

      if (!userId) {
        throw unauthorized(messages.httpStatusCode.unauthorized);
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          roleId: true,
          role: true,
        },
      });

      if (user?.role?.slug === RoleSlug.superAdmin) {
        return await handler(request, { params });
      }

      const permission = await prisma.permission.findFirst({
        where: {
          slug: permissionSlug,
          module: {
            slug: module,
          },
        },
        select: {
          id: true,
          rolePermissions: {
            where: {
              roleId: user?.roleId,
            },
            select: {
              id: true,
            },
          },
        },
      });

      if (!permission?.id || !permission.rolePermissions?.length) {
        throw unauthorized(messages.httpStatusCode.unauthorized);
      }

      return await handler(request, { params });
    } catch (error: any) {
      return errorResponse(error);
    }
  };
};

export const auth = (
  handler: (req: ApiRequest) => Promise<NextResponse<unknown>>
) => {
  return async (req: ApiRequest) => {
    try {
      await authorize(req);
      return await handler(req);
    } catch (error: any) {
      return errorResponse(error);
    }
  };
};

export const authorize = async (request: ApiRequest) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw unauthorized(messages.httpStatusCode.unauthorized);
  }

  const token = authHeader.replace("Bearer ", "");
  const userData = await verifyToken(token);

  if (!userData?.id) {
    throw unauthorized(messages.httpStatusCode.unauthorized);
  }

  request.user = userData;

  return request;
};
