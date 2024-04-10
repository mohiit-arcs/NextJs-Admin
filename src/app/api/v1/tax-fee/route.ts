import { badRequest } from "@/core/errors/http.error";
import { errorResponse } from "@/core/http-responses/error.http-response";
import { successResponse } from "@/core/http-responses/success.http-response";
import { ApiRequest } from "@/interfaces/backend/request.interface";
import { messages } from "@/messages/backend/index.message";
import { acl } from "@/services/backend/acl.service";
import {
  createTaxFee,
  taxFeeList,
  updateTaxFee,
} from "@/services/backend/taxFee.service";

export const POST = acl("tax-fees", "full", async (req: ApiRequest) => {
  try {
    const { tax_name, tax_type, value, restaurantId } = await req.json();

    const createTaxFeeData = {
      tax_name: tax_name,
      tax_type: tax_type,
      value: parseInt(value),
    };
    return successResponse({
      data: {
        success: await createTaxFee(createTaxFeeData, parseInt(restaurantId)),
      },
      message: messages.response.taxFeeCreated,
    });
  } catch (error) {
    return errorResponse(error);
  }
});

export const PATCH = acl("tax-fees", "full", async (req: ApiRequest) => {
  try {
    const { tax_name, tax_type, value, id } = await req.json();
    const updateTaxFeeData = {
      tax_name: tax_name,
      tax_type: tax_type,
      value: parseInt(value),
    };

    return successResponse({
      data: { success: await updateTaxFee(parseInt(id), updateTaxFeeData) },
      message: messages.response.requestUpdated,
    });
  } catch (error) {
    return errorResponse(error);
  }
});

export const GET = acl("tax-fees", "full", async (request: ApiRequest) => {
  try {
    const { searchParams } = request.nextUrl;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search")?.trim() || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const restaurantId = searchParams.get("restaurantId")!;
    if (isNaN(parseInt(page)) || isNaN(parseInt(limit))) {
      throw badRequest(messages.error.badRequest);
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    return successResponse({
      data: await taxFeeList(
        search,
        sortBy,
        sortOrder,
        skip,
        take,
        parseInt(restaurantId)
      ),
    });
  } catch (error) {
    return errorResponse(error);
  }
});
