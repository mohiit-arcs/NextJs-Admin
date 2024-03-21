import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { auth } from "@/services/backend/acl.service";
import { getUserById } from "@/services/backend/user.service";

export const GET = auth(async (request: ApiRequest) => {
  try {
    const { user } = request;
    return successResponse({
      data: {
        profile: await getUserById(Number(user?.id)),
      },
    });
  } catch (error: any) {
    return errorResponse(error);
  }
});
