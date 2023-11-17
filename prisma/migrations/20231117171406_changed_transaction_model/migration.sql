/*
  Warnings:

  - You are about to drop the column `from` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Transactions` table. All the data in the column will be lost.
  - Added the required column `receiver` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sender" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Transactions" ("amount", "createdAt", "id") SELECT "amount", "createdAt", "id" FROM "Transactions";
DROP TABLE "Transactions";
ALTER TABLE "new_Transactions" RENAME TO "Transactions";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
