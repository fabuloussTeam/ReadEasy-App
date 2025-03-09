/**
 * Get all users
 */

// Importer le client Prisma
import { PrismaClient } from "@prisma/client";
import { hash } from 'bcryptjs';

// Créer une instance de Prisma
const prisma = new PrismaClient();

/**
 * Récupérer tous les utilisateurs avec leurs livres
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
                mot_de_passe: false, // Exclude mot_de_passe field
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

/**
 * Récupérer un utilisateur par son ID avec ses livres
 * @param {number} id_utilisateur 
 */
export async function utilisateurParId(id_utilisateur) {
    try {
        const user = await prisma.utilisateur.findUnique({
            where: {
                id_utilisateur
            },
            select: {
                id_utilisateur: true,
                nom: true,
                prenom: true,
                courriel: true,
                acces: true,
                mot_de_passe: false, // Exclude mot_de_passe field
                livres: true,
            }
        });
        return user;
    } catch (error) {
        console.error("Error retrieving user:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

/**
 * Récupérer un utilisateur par son courriel
 * @param {string} courriel 
 */
export async function utilisateurParCourriel(courriel) {
    try {
        const user = await prisma.utilisateur.findUnique({
            where: {
                courriel: courriel
            }
        });
        return user;
    } catch (error) {
        console.error("Error retrieving user by email:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

/** 
 * Mettre a jour un utilisateur
 * @param {number} id_utilisateur
 * 
 *   */
export async function mettreAJourUtilisateur(id_utilisateur, nom, prenom, courriel, acces, mot_de_passe) {
    try {
        // Hash the password before updating
        const hashedPassword = await hash(mot_de_passe, 10);

        const user = await prisma.utilisateur.update({
            where: {
                id_utilisateur
            },
            data: {
                nom,
                prenom,
                courriel,
                acces,
                mot_de_passe: hashedPassword,
            }
        });
        return user;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

/**
 * Supprimer un utilisateur
 * @param {number} id_utilisateur 
 */
export async function supprimerUtilisateur(id_utilisateur) {
    try {
        const user = await prisma.utilisateur.delete({
            where: {
                id_utilisateur
            }
        });
        return user;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

/**
 * Créer un utilisateur
 * @param {string} nom
 * @param {string} prenom
 * @param {string} courriel
 * @param {string} acces
 * @param {string} mot_de_passe
 * 
 */
export async function creerUtilisateur(nom, prenom, courriel, acces, mot_de_passe) {
    try {
        // Hash the password before saving
        const hashedPassword = await hash(mot_de_passe, 10);

        const user = await prisma.utilisateur.create({
            data: {
                nom,
                prenom,
                courriel,
                acces,
                mot_de_passe: hashedPassword,
                createdAt: new Date() 
            }
        });
        return user;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
