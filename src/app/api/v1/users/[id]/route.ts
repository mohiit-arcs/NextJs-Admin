import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { deleteUserById, getUserById } from "@/services/backend/user.service";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const id = Number(params.id);
    return successResponse({
      data: await deleteUserById(id),
    });
  } catch (error: any) {
    return errorResponse(error);
  }
}

export async function GET(req: NextRequest, { params }: any) {
  try {
    const id = Number(params.id);
    console.log(await getUserById(id));
    return successResponse({
      data: await getUserById(id),
    });
  } catch (error: any) {
    return errorResponse(error);
  }
}
