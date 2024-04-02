/*
  Warnings:

  - A unique constraint covering the columns `[status]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "OrderStatusSlug" AS ENUM ('pending', 'delivered');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "status" "OrderStatusSlug" NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE UNIQUE INDEX "orders_status_key" ON "orders"("status");
