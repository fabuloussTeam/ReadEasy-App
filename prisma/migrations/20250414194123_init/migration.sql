-- CreateTable
CREATE TABLE "livre" (
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

-- CreateTable
CREATE TABLE "utilisateur" (
    "id_utilisateur" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT,
    "courriel" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "acces" INTEGER NOT NULL DEFAULT 0,
    "telephone" TEXT DEFAULT '000-000-0000',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "monPanier" (
    "id_panier" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_utilisateur" INTEGER NOT NULL,
    "id_livre" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "monPanier_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur" ("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "monPanier_id_livre_fkey" FOREIGN KEY ("id_livre") REFERENCES "livre" ("id_livre") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "statistique" (
    "id_statistique" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "page" TEXT NOT NULL,
    "vues" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateur_courriel_key" ON "utilisateur"("courriel");

-- CreateIndex
CREATE UNIQUE INDEX "statistique_page_key" ON "statistique"("page");
