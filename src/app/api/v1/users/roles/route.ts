import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { acl } from "@/services/backend/acl.service";
import { getUserRoles } from "@/services/backend/user.service";
import { NextRequest } from "next/server";

export const GET = acl("users", "full", async (request: NextRequest) => {
  try {
    return successResponse({
      data: await getUserRoles(),
    });
  } catch (error: any) {
    return errorResponse(error);
  }
});
