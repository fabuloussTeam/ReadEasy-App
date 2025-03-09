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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_utilisateur" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "livre_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur" ("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_livre" ("auteur", "description", "document", "est_gratuit", "id_livre", "id_utilisateur", "isbn", "prix", "titre", "url_image") SELECT "auteur", "description", "document", "est_gratuit", "id_livre", "id_utilisateur", "isbn", "prix", "titre", "url_image" FROM "livre";
DROP TABLE "livre";
ALTER TABLE "new_livre" RENAME TO "livre";
CREATE TABLE "new_utilisateur" (
    "id_utilisateur" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT,
    "courriel" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "acces" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_utilisateur" ("acces", "courriel", "id_utilisateur", "mot_de_passe", "nom", "prenom") SELECT "acces", "courriel", "id_utilisateur", "mot_de_passe", "nom", "prenom" FROM "utilisateur";
DROP TABLE "utilisateur";
ALTER TABLE "new_utilisateur" RENAME TO "utilisateur";
CREATE UNIQUE INDEX "utilisateur_courriel_key" ON "utilisateur"("courriel");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
