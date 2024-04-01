import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { acl } from "@/services/backend/acl.service";
import {
  deleteTaxFeeById,
  getTaxFeeById,
} from "@/services/backend/taxFee.service";

export const GET = acl(
  "tax-fees",
  "full",
  async (request: ApiRequest, { params }: any) => {
    try {
      const id = Number(params.id);
      return successResponse({
        data: await getTaxFeeById(id),
      });
    } catch (error: any) {
      return errorResponse(error);
    }
  }
);

export const DELETE = acl(
  "tax-fees",
  "full",
  async (request: ApiRequest, { params }: any) => {
    try {
      const id = Number(params.id);
      return successResponse({
        data: await deleteTaxFeeById(id),
      });
    } catch (error: any) {
      return errorResponse(error);
    }
  }
);
