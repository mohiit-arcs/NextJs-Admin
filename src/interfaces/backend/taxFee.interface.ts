import { TaxTypeSlug } from "@prisma/client";

export interface CreateTaxFee {
  tax_name: string;
  tax_type: TaxTypeSlug;
  value: number;
}
