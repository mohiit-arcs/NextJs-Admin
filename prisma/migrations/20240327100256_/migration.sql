/*
  Warnings:

  - Made the column `restaurantId` on table `menus` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "menus" DROP CONSTRAINT "menus_restaurantId_fkey";

-- AlterTable
ALTER TABLE "menus" ALTER COLUMN "restaurantId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
