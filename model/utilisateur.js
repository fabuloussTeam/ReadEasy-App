/**
 * Get all users
 */

// Importer le client Prisma
import { PrismaClient } from "@prisma/client";

// Créer une instance de Prisma
const prisma = new PrismaClient();

/**
 * Récupérer tous les utilisateurs sans mot de passe
 */
export async function toutLesUtilisateurs() {
    try {
        const users = await prisma.utilisateur.findMany({
            select: {
                id_utilisateur: true,
                nom: true,
                prenom: true,
                courriel: true,
                acces: true,
                mot_de_passe: true,
                livres: true,
            }
        });
        return users;
    } catch (error) {
        console.error("Error retrieving users:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}



