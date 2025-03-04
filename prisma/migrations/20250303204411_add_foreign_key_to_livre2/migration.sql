/*
  Warnings:

  - Added the required column `id_utilisateur` to the `livre` table without a default value. This is not possible if the table is not empty.

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
    "url_image" TEXT,
    "document" TEXT,
    "id_utilisateur" INTEGER NOT NULL,
    CONSTRAINT "livre_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur" ("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_livre" ("auteur", "description", "document", "est_gratuit", "id_livre", "isbn", "prix", "titre", "url_image") SELECT "auteur", "description", "document", "est_gratuit", "id_livre", "isbn", "prix", "titre", "url_image" FROM "livre";
DROP TABLE "livre";
ALTER TABLE "new_livre" RENAME TO "livre";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
