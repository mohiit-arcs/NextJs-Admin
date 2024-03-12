import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { acl } from "@/services/backend/acl.service";
import { deleteUserById, getUserById } from "@/services/backend/user.service";
import { NextRequest } from "next/server";

export const DELETE = acl(
  "users",
  "full",
  async (req: NextRequest, { params }: any) => {
    try {
      const id = Number(params.id);
      return successResponse({
        data: await deleteUserById(id),
      });
    } catch (error: any) {
      return errorResponse(error);
    }
  }
);

export const GET = acl(
  "users",
  "full",
  async (req: NextRequest, { params }: any) => {
    try {
      const id = Number(params.id);
      return successResponse({
        data: await getUserById(id),
      });
    } catch (error: any) {
      return errorResponse(error);
    }
  }
);
