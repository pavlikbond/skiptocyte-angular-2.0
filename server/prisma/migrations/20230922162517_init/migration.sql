-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firebaseId" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "stripeId" TEXT,
    "stripeLink" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "firebaseId", "id", "name", "stripeId", "stripeLink", "updatedAt") SELECT "createdAt", "email", "firebaseId", "id", "name", "stripeId", "stripeLink", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_firebaseId_key" ON "User"("firebaseId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
