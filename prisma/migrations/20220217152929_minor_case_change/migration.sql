/*
  Warnings:

  - You are about to drop the column `smartcarUserId` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the `SmartcarUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SmartcarUser" DROP CONSTRAINT "SmartcarUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_smartcarUserId_userId_fkey";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "smartcarUserId",
ADD COLUMN     "smartCarUserId" TEXT;

-- DropTable
DROP TABLE "SmartcarUser";

-- CreateTable
CREATE TABLE "SmartCarUser" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "accessExpiration" TIMESTAMP(3) NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "refreshExpiration" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmartCarUser_pkey" PRIMARY KEY ("id","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "SmartCarUser_userId_key" ON "SmartCarUser"("userId");

-- AddForeignKey
ALTER TABLE "SmartCarUser" ADD CONSTRAINT "SmartCarUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_smartCarUserId_userId_fkey" FOREIGN KEY ("smartCarUserId", "userId") REFERENCES "SmartCarUser"("id", "userId") ON DELETE SET NULL ON UPDATE CASCADE;
