/*
  Warnings:

  - You are about to drop the column `locationId` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the `location` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `city` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipcode` to the `restaurants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "restaurants" DROP CONSTRAINT "restaurants_locationId_fkey";

-- AlterTable
ALTER TABLE "restaurants" DROP COLUMN "locationId",
ADD COLUMN     "city" VARCHAR(100) NOT NULL,
ADD COLUMN     "country" VARCHAR(100) NOT NULL,
ADD COLUMN     "state" VARCHAR(150) NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "zipcode" VARCHAR(10) NOT NULL;

-- DropTable
DROP TABLE "location";
