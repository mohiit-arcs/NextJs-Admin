/*
  Warnings:

  - You are about to drop the column `amount` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `taxAmount` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Cart` table. All the data in the column will be lost.
  - Added the required column `order_amount` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_tax_amount` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_total_amount` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "amount",
DROP COLUMN "taxAmount",
DROP COLUMN "totalAmount",
ADD COLUMN     "order_amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "order_tax_amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "order_total_amount" DOUBLE PRECISION NOT NULL;
