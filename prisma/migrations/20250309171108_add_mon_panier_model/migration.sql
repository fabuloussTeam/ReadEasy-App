-- CreateTable
CREATE TABLE "monPanier" (
    "id_panier" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_utilisateur" INTEGER NOT NULL,
    "id_livre" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "monPanier_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur" ("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "monPanier_id_livre_fkey" FOREIGN KEY ("id_livre") REFERENCES "livre" ("id_livre") ON DELETE RESTRICT ON UPDATE CASCADE
);
