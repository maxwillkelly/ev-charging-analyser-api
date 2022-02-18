/*
  Warnings:

  - The primary key for the `SmartcarUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `smartCarUserId` on the `Vehicle` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_smartCarUserId_fkey";

-- AlterTable
ALTER TABLE "SmartcarUser" DROP CONSTRAINT "SmartcarUser_pkey",
ADD CONSTRAINT "SmartcarUser_pkey" PRIMARY KEY ("id", "userId");

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "smartCarUserId",
ADD COLUMN     "smartcarUserId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_smartcarUserId_userId_fkey" FOREIGN KEY ("smartcarUserId", "userId") REFERENCES "SmartcarUser"("id", "userId") ON DELETE SET NULL ON UPDATE CASCADE;
