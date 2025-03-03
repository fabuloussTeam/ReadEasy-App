// importer ler client prisma
import { PrismaClient } from "@prisma/client";

//Creer une instance de prisma
const prisma = new PrismaClient();

/**
 * Pour ajouter un livre
 * @param {*} isbn
 * @param {*} description
 */
export const addlivre = async (isbn, titre, description, prix, est_gratuit, auteur, url_image, document) => {
    const livre = await prisma.livre.create({
        data: {
            isbn,
            titre,
            description,
            prix,
            est_gratuit,
            auteur,
            url_image,
            document
        },
    });
    return livre;
};

/**
 * Obtenir la liste de toutes les taches
 * @returns la liste des taches
 */
export const getlivres = async () => {
    const livres = await prisma.livre.findMany();
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
    document
 ) => {

    const livre = await prisma.livre.findUnique({
        where: {
            id_livre,
        },
    });

    const updatedlivre = await prisma.livre.update({
        where: {
            id_livre,
        },

        data: {
            isbn,
            titre,
            description,
            prix,
            est_gratuit,
            auteur,
            url_image,
            document
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
