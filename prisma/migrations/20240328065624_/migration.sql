/*
  Warnings:

  - You are about to drop the column `adminId` on the `tax_fees` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tax_fees" DROP CONSTRAINT "tax_fees_adminId_fkey";

-- AlterTable
ALTER TABLE "tax_fees" DROP COLUMN "adminId";
