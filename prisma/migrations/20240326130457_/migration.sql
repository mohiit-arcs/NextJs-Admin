/*
  Warnings:

  - You are about to drop the `tax_fee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tax_fee" DROP CONSTRAINT "tax_fee_restaurantId_fkey";

-- DropTable
DROP TABLE "tax_fee";

-- CreateTable
CREATE TABLE "tax_fees" (
    "id" SERIAL NOT NULL,
    "tax_name" VARCHAR(255) NOT NULL,
    "tax_type" "TaxTypeSlug" NOT NULL,
    "value" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tax_fees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tax_fees_tax_type_key" ON "tax_fees"("tax_type");

-- CreateIndex
CREATE INDEX "tax_fees_id_idx" ON "tax_fees"("id");

-- CreateIndex
CREATE INDEX "tax_fees_restaurantId_idx" ON "tax_fees"("restaurantId");

-- AddForeignKey
ALTER TABLE "tax_fees" ADD CONSTRAINT "tax_fees_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
