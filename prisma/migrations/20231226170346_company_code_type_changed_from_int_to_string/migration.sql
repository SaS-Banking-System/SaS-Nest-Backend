-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "taxAmount" REAL NOT NULL
);
INSERT INTO "new_Company" ("code", "id", "name", "taxAmount", "uuid") SELECT "code", "id", "name", "taxAmount", "uuid" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE UNIQUE INDEX "Company_uuid_key" ON "Company"("uuid");
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");
CREATE UNIQUE INDEX "Company_code_key" ON "Company"("code");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
