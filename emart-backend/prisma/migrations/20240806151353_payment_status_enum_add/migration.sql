/*
  Warnings:

  - The `payment_status` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Pay_Status" AS ENUM ('Paid', 'Pending');

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "payment_status",
ADD COLUMN     "payment_status" "Pay_Status" NOT NULL DEFAULT 'Pending';
