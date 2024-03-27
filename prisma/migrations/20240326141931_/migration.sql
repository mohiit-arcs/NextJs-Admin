-- DropForeignKey
ALTER TABLE "tax_fees" DROP CONSTRAINT "tax_fees_restaurantId_fkey";

-- AlterTable
ALTER TABLE "tax_fees" ALTER COLUMN "restaurantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tax_fees" ADD CONSTRAINT "tax_fees_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
