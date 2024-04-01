/*
  Warnings:

  - You are about to drop the column `restaurantId` on the `menu_categories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "menu_categories" DROP CONSTRAINT "menu_categories_restaurantId_fkey";

-- DropIndex
DROP INDEX "menu_categories_restaurantId_idx";

-- DropIndex
DROP INDEX "menu_categories_restaurantId_key";

-- AlterTable
ALTER TABLE "menu_categories" DROP COLUMN "restaurantId";

-- CreateTable
CREATE TABLE "_MenuCategoryToRestaurant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MenuCategoryToRestaurant_AB_unique" ON "_MenuCategoryToRestaurant"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuCategoryToRestaurant_B_index" ON "_MenuCategoryToRestaurant"("B");

-- AddForeignKey
ALTER TABLE "_MenuCategoryToRestaurant" ADD CONSTRAINT "_MenuCategoryToRestaurant_A_fkey" FOREIGN KEY ("A") REFERENCES "menu_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuCategoryToRestaurant" ADD CONSTRAINT "_MenuCategoryToRestaurant_B_fkey" FOREIGN KEY ("B") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
