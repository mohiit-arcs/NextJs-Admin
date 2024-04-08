/*
  Warnings:

  - You are about to drop the column `order_item_count` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "order_item_count";
