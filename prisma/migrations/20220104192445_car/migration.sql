-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "expiration" TIMESTAMP(3),
    "refreshExpiration" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);
