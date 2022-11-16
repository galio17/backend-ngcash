/*
  Warnings:

  - You are about to drop the column `accountsId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `balance` on the `accounts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `accountId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_accountsId_fkey";

-- DropIndex
DROP INDEX "users_accountsId_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "balance",
ADD COLUMN     "balance" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "accountsId",
ADD COLUMN     "accountId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_accountId_key" ON "users"("accountId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
