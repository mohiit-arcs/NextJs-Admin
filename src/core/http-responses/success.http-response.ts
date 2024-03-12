import { SuccessResponse as Response } from "@/interfaces/backend/response.interface";
import { NextResponse } from "next/server";

export function successResponse(response: Response) {
  const { data = "", message = "", ...rest } = response;
  const thisResponse = {
    data: data && data.data ? data.data : data,
    message,
    ...rest,
  };
  return NextResponse.json(thisResponse);
}
