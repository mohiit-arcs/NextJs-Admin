import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { acl } from "@/services/backend/acl.service";
import { getMenuCategories } from "@/services/backend/user.service";
import { NextRequest } from "next/server";

export const GET = acl("restaurants", "full", async (request: NextRequest) => {
  try {
    return successResponse({
      data: await getMenuCategories(),
    });
  } catch (error: any) {
    console.log(error);
    return errorResponse(error);
  }
});
