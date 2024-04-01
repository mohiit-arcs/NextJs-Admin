/*
  Warnings:

  - Made the column `restaurantId` on table `menu_categories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "menu_categories" ALTER COLUMN "restaurantId" SET NOT NULL;
