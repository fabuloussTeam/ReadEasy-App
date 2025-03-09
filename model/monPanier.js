// importer ler client prisma
import { PrismaClient } from "@prisma/client";

//Creer une instance de prisma
const prisma = new PrismaClient();

/** ajouter une commande au panier */
export const addCommande = async (id_utilisateur, id_livre, quantite) => {
    const commande = await prisma.monPanier.create({
        data: {
            id_utilisateur,
            id_livre,
            quantite,
            createdAt: new Date()
        },
    });
    return commande;
};

/** Recuperer toutes les compris */
export const getCommandes = async () => {
    const commandes = await prisma.monPanier.findMany({
        orderBy: {
            createdAt: 'desc' // Assuming 'createdAt' is the field storing the creation date
        }
    });
    return commandes;
};

/** Recuperer une commande */
export const getAllCommandeUser = async (id_utilisateur) => {
    const commande = await prisma.monPanier.findMany({
        where: {
            id_utilisateur,
        },
    });
    return commande;
}

/** Supprimer une commande */
export const deleteCommandeBook = async (id_panier, id_utilisateur) => {
    const commande = await prisma.monPanier.delete({
        where: {
            id_panier,
            id_utilisateur
        },
    });
    return commande;
}




