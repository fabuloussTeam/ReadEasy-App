// importer ler client prisma
import { PrismaClient } from "@prisma/client";

//Creer une instance de prisma
const prisma = new PrismaClient();

/**
 * obtenir les statistiques de l'application
 * @returns les statistiques de l'application
 */
export const getStatistique = async () => {
    const livreCount = await prisma.livre.count();
    const utilisateurCount = await prisma.utilisateur.count();
    const livreGratuitCount = await prisma.livre.count({
        where: {
            est_gratuit: true,
        },
    });
    const livrePayantCount = await prisma.livre.count({
        where: {
            est_gratuit: false,
        },
    });
    return {
        livreCount,
        utilisateurCount,
        livreGratuitCount,
        livrePayantCount,
    };
};

//ajouter une vue de la page d'accueil
export const addVuesHome = async (page, vues) => {
    try {
        // Vérifier si la page existe déjà
        const existingStat = await prisma.statistique.findUnique({
            where: { page },
        });

        if (existingStat) {
            // Si la page existe, incrémenter le nombre de vues
            const updatedStat = await prisma.statistique.update({
                where: { page },
                data: { vues: existingStat.vues + vues },
               
            });
            return updatedStat;
        } else {
            // Si la page n'existe pas, créer une nouvelle entrée
            const newStat = await prisma.statistique.create({
                data: {
                    page,
                    vues,
                },
                
            });
            return newStat;
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout de la vue :", error);
        throw error;
    }
};

// Récupérer les statistiques de la page d'accueil
export const getVues = async () => {
    try {
        const stats = await prisma.statistique.findMany({
            select: {
                id_statistique: true,
                page: true,
                vues: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return stats;
    } catch (error) {
        console.error("Erreur lors de la récupération des vues :", error);
        throw error;
    }
};