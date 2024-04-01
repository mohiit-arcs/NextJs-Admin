-- DropForeignKey
ALTER TABLE "menus" DROP CONSTRAINT "menus_restaurantId_fkey";

-- AlterTable
ALTER TABLE "menus" ALTER COLUMN "restaurantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
