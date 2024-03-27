/*
  Warnings:

  - You are about to drop the `TaxFee` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TaxTypeSlug" AS ENUM ('flat', 'percent');

-- DropForeignKey
ALTER TABLE "TaxFee" DROP CONSTRAINT "TaxFee_restaurantId_fkey";

-- DropTable
DROP TABLE "TaxFee";

-- CreateTable
CREATE TABLE "tax_fee" (
    "id" SERIAL NOT NULL,
    "tax_name" VARCHAR(255) NOT NULL,
    "tax_type" "TaxTypeSlug" NOT NULL,
    "value" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tax_fee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tax_fee_tax_type_key" ON "tax_fee"("tax_type");

-- CreateIndex
CREATE INDEX "tax_fee_id_idx" ON "tax_fee"("id");

-- CreateIndex
CREATE INDEX "tax_fee_restaurantId_idx" ON "tax_fee"("restaurantId");

-- AddForeignKey
ALTER TABLE "tax_fee" ADD CONSTRAINT "tax_fee_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
