-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "accountsId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "debitedAccountId" TEXT NOT NULL,
    "creditedAccountId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_accountsId_key" ON "users"("accountsId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_accountsId_fkey" FOREIGN KEY ("accountsId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_debitedAccountId_fkey" FOREIGN KEY ("debitedAccountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_creditedAccountId_fkey" FOREIGN KEY ("creditedAccountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
