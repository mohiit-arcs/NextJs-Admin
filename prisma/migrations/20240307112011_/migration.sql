/*
  Warnings:

  - You are about to drop the column `foodItemsId` on the `restaurants` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "MenuCategorySlug" ADD VALUE 'snacks';

-- DropForeignKey
ALTER TABLE "restaurants" DROP CONSTRAINT "restaurants_foodItemsId_fkey";

-- AlterTable
ALTER TABLE "food_items" ADD COLUMN     "adminId" INTEGER;

-- AlterTable
ALTER TABLE "restaurants" DROP COLUMN "foodItemsId";

-- AddForeignKey
ALTER TABLE "food_items" ADD CONSTRAINT "food_items_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
