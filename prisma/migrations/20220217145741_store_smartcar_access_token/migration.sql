/*
  Warnings:

  - You are about to drop the `Car` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_userId_fkey";

-- DropTable
DROP TABLE "Car";

-- CreateTable
CREATE TABLE "SmartcarUser" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "accessExpiration" TIMESTAMP(3) NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "refreshExpiration" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmartcarUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "smartCarUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SmartcarUser_userId_key" ON "SmartcarUser"("userId");

-- AddForeignKey
ALTER TABLE "SmartcarUser" ADD CONSTRAINT "SmartcarUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_smartCarUserId_fkey" FOREIGN KEY ("smartCarUserId") REFERENCES "SmartcarUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
