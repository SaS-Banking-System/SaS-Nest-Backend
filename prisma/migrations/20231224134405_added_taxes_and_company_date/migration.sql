/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "User_uuid_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Accounts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "balance" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "CompanyData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "taxAmount" REAL NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sender" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "tax" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Transaction" ("amount", "createdAt", "id", "receiver", "sender") SELECT "amount", "createdAt", "id", "receiver", "sender" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_uuid_key" ON "Accounts"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyData_uuid_key" ON "CompanyData"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyData_name_key" ON "CompanyData"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyData_code_key" ON "CompanyData"("code");
