-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_monPanier" (
    "id_panier" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_utilisateur" INTEGER NOT NULL,
    "id_livre" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "monPanier_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur" ("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "monPanier_id_livre_fkey" FOREIGN KEY ("id_livre") REFERENCES "livre" ("id_livre") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_monPanier" ("createdAt", "id_livre", "id_panier", "id_utilisateur") SELECT "createdAt", "id_livre", "id_panier", "id_utilisateur" FROM "monPanier";
DROP TABLE "monPanier";
ALTER TABLE "new_monPanier" RENAME TO "monPanier";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
