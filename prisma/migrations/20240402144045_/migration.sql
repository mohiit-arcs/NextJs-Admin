/*
  Warnings:

  - Added the required column `priceAtPurchase` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "priceAtPurchase" DOUBLE PRECISION NOT NULL;
