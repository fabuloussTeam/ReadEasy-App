/*
  Warnings:

  - A unique constraint covering the columns `[courriel]` on the table `utilisateur` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "utilisateur_courriel_key" ON "utilisateur"("courriel");
