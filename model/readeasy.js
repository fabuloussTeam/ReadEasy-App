// importer ler client prisma
import { PrismaClient } from "@prisma/client";

//Creer une instance de prisma
const prisma = new PrismaClient();

/**
 * Pour ajouter un livre
 * @param {*} isbn
 * @param {*} description
 */
export const addlivre = async (isbn, titre, description, prix, est_gratuit, auteur, url_image, document, id_utilisateur) => {
    const livre = await prisma.livre.create({
        data: {
            isbn,
            titre,
            description,
            prix,
            est_gratuit,
            auteur,
            url_image,
            document,
            id_utilisateur,
            createdAt: new Date() 
        },
    });
    return livre;
};

/**
 * Obtenir la liste de toutes les taches
 * @returns la liste des taches
 */
export const getlivres = async () => {
    const livres = await prisma.livre.findMany({
        orderBy: {
            createdAt: 'desc' // Assuming 'createdAt' is the field storing the creation date
        }
});
    return livres;
};

/**
 * Obtenir un livre
 */
export const getlivre = async (id_livre) => {
    
    const livre = await prisma.livre.findUnique({
        where: {
            id_livre,
        },
    });
    return livre;
}

/**
 * Obtenir les livres d'un utilisateur
 */
export const getlivresUser = async (id_utilisateur) => {
    const livres = await prisma.livre.findMany({
        where: {
            id_utilisateur,
        },
    });
    return livres;
}





/**
 * Route pour mettre à jour un livre
 * @param {*} id 
 * @returns 
 */
export const updatelivre = async (
    id_livre,
    isbn,
    titre,
    description,
    prix,
    est_gratuit,
    auteur,
    url_image,
    document,
    id_utilisateur
 ) => {
    const updatedlivre = await prisma.livre.update({
        where: {
            id_livre
        },
        data: {
            isbn,
            titre,
            description,
            prix,
            est_gratuit,
            auteur,
            url_image,
            document,
            id_utilisateur
        },
    });
    return updatedlivre;
};

// Route pour supprimer un livre
export const deletelivre = async (id_livre) => {
    const livre = await prisma.livre.delete({
        where: {
            id_livre,
        },
    });
    return livre;
};
