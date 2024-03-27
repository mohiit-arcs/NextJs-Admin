-- CreateTable
CREATE TABLE "TaxFee" (
    "id" SERIAL NOT NULL,
    "tax_name" VARCHAR(255) NOT NULL,
    "tax_type" VARCHAR(255) NOT NULL,
    "value" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TaxFee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaxFee" ADD CONSTRAINT "TaxFee_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
