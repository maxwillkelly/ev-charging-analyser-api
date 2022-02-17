/*
  Warnings:

  - Changed the type of `refreshExpiration` on the `SmartCarUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SmartCarUser" DROP COLUMN "refreshExpiration",
ADD COLUMN     "refreshExpiration" TIMESTAMP(3) NOT NULL;
