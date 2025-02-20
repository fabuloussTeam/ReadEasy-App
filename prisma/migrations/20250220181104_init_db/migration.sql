-- CreateTable
CREATE TABLE "livre" (
    "id_livre" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isbn" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prix" DECIMAL NOT NULL,
    "est_gratuit" BOOLEAN NOT NULL DEFAULT false,
    "auteur" TEXT
);

-- CreateTable
CREATE TABLE "utilisateur" (
    "id_utilisateur" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT,
    "courriel" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "acces" INTEGER NOT NULL DEFAULT 1
);
