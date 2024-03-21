import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { messages } from "@/messages/backend/index.message";
import { auth } from "@/services/backend/acl.service";
import { changePassword } from "@/services/backend/user.service";

export const POST = auth(async (req: ApiRequest) => {
  try {
    const { currentPassword, newPassword } = await req.json();
    const { user } = req;

    return successResponse({
      data: {
        success: await changePassword(
          Number(user?.id),
          currentPassword,
          newPassword
        ),
      },
      message: messages.response.passwordUpdate,
    });
  } catch (error: any) {
    return errorResponse(error);
  }
});
