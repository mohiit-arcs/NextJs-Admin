/*
  Warnings:

  - You are about to drop the column `amount` on the `orders` table. All the data in the column will be lost.
  - Added the required column `order_amount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_item_count` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_tax_amount` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "amount",
ADD COLUMN     "order_amount" INTEGER NOT NULL,
ADD COLUMN     "order_item_count" INTEGER NOT NULL,
ADD COLUMN     "order_tax_amount" INTEGER NOT NULL;
