/*
  Warnings:

  - Added the required column `private` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sender" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "private" BOOLEAN NOT NULL,
    "tax" INTEGER DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Transaction" ("amount", "createdAt", "id", "receiver", "sender", "tax") SELECT "amount", "createdAt", "id", "receiver", "sender", "tax" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
