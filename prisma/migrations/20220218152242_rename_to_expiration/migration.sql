/*
  Warnings:

  - You are about to drop the column `accessExpiration` on the `SmartCarUser` table. All the data in the column will be lost.
  - Added the required column `expiration` to the `SmartCarUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SmartCarUser" DROP COLUMN "accessExpiration",
ADD COLUMN     "expiration" TIMESTAMP(3) NOT NULL;
