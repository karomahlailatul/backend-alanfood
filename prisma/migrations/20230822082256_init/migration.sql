/*
  Warnings:

  - You are about to drop the `Bills` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bills" DROP CONSTRAINT "Bills_checkoutId_fkey";

-- DropForeignKey
ALTER TABLE "Bills" DROP CONSTRAINT "Bills_foodId_fkey";

-- DropTable
DROP TABLE "Bills";

-- CreateTable
CREATE TABLE "Bill" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL,
    "foodId" INTEGER NOT NULL,
    "checkoutId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "Checkout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
