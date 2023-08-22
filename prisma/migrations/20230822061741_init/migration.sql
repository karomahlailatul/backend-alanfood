/*
  Warnings:

  - You are about to alter the column `totalPay` on the `Checkout` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `changePay` on the `Checkout` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `price` on the `Food` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Checkout" ALTER COLUMN "totalPay" SET DATA TYPE INTEGER,
ALTER COLUMN "changePay" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Food" ALTER COLUMN "price" SET DATA TYPE INTEGER;
