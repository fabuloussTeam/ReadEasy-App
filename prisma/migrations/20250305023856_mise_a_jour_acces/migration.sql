-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_utilisateur" (
    "id_utilisateur" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT,
    "courriel" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "acces" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_utilisateur" ("acces", "courriel", "id_utilisateur", "mot_de_passe", "nom", "prenom") SELECT "acces", "courriel", "id_utilisateur", "mot_de_passe", "nom", "prenom" FROM "utilisateur";
DROP TABLE "utilisateur";
ALTER TABLE "new_utilisateur" RENAME TO "utilisateur";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
