/*
  Warnings:

  - You are about to drop the `_MenuCategoryToRestaurant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MenuCategoryToRestaurant" DROP CONSTRAINT "_MenuCategoryToRestaurant_A_fkey";

-- DropForeignKey
ALTER TABLE "_MenuCategoryToRestaurant" DROP CONSTRAINT "_MenuCategoryToRestaurant_B_fkey";

-- AlterTable
ALTER TABLE "menu_categories" ADD COLUMN     "restaurantId" INTEGER;

-- DropTable
DROP TABLE "_MenuCategoryToRestaurant";

-- AddForeignKey
ALTER TABLE "menu_categories" ADD CONSTRAINT "menu_categories_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
