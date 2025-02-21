/*
  Warnings:

  - You are about to drop the column `url` on the `livre` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_livre" (
    "id_livre" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isbn" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prix" DECIMAL NOT NULL,
    "est_gratuit" BOOLEAN NOT NULL DEFAULT false,
    "auteur" TEXT,
    "url_image" TEXT
);
INSERT INTO "new_livre" ("auteur", "description", "est_gratuit", "id_livre", "isbn", "prix", "titre") SELECT "auteur", "description", "est_gratuit", "id_livre", "isbn", "prix", "titre" FROM "livre";
DROP TABLE "livre";
ALTER TABLE "new_livre" RENAME TO "livre";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
