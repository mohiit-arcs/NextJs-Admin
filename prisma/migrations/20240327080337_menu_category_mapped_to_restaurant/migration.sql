/*
  Warnings:

  - You are about to drop the column `slug` on the `menu_categories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[restaurantId]` on the table `menu_categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `restaurantId` to the `menu_categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "menu_categories_slug_idx";

-- DropIndex
DROP INDEX "menu_categories_slug_key";

-- AlterTable
ALTER TABLE "menu_categories" DROP COLUMN "slug",
ADD COLUMN     "restaurantId" INTEGER DEFAULT NULL;

-- DropEnum
DROP TYPE "MenuCategorySlug";

-- CreateIndex
CREATE UNIQUE INDEX "menu_categories_restaurantId_key" ON "menu_categories"("restaurantId");

-- CreateIndex
CREATE INDEX "menu_categories_restaurantId_idx" ON "menu_categories"("restaurantId");

-- AddForeignKey
ALTER TABLE "menu_categories" ADD CONSTRAINT "menu_categories_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
