-- AlterTable
ALTER TABLE "tax_fees" ADD COLUMN     "adminId" INTEGER;

-- AddForeignKey
ALTER TABLE "tax_fees" ADD CONSTRAINT "tax_fees_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
