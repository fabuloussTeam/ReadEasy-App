// Aller chercher les configurations de l'application
import "dotenv/config";

// Importer les fichiers et librairies
import express, { json, urlencoded } from "express";
import expressHandlebars from "express-handlebars";
import Handlebars from "handlebars";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import session from "express-session";
import memorystore from "memorystore";
import passport from "passport";
import { PrismaClient } from "@prisma/client";
import cspOption from "./csp-options.js";
import {
  addlivre,
  getlivres,
  updatelivre,
  deletelivre,
  getlivre,
  getlivresUser,
} from "./model/readeasy.js";
import { getRandomBooks } from "./public/js/home.js";
import {
  toutLesUtilisateurs,
  utilisateurParId,
  mettreAJourUtilisateur,
  creerUtilisateur,
} from "./model/utilisateur.js";
import "./authentification.js";
import { log } from "console";
import {
  addCommande,
  getAllCommandeUser,
  getCommandes,
  deleteCommandeBook,
  getLivresEtTotalPrixDansPanier,
} from "./model/monPanier.js";

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Création du serveur
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
  },
});

const upload = multer({ storage: storage });

// verifier que la session est active et a ete utiliser
const MemoryStore = memorystore(session);

const hbs = expressHandlebars.create({
  helpers: {
    concat: (str1, str2) => {
      return str1 + str2;
    },
    json: (context) => {
      return JSON.stringify(context);
    },
  },
});

// Register a custom helper to truncate description to the first 20 words
Handlebars.registerHelper("truncateDescription", function (description) {
  const words = description.split(" ");
  if (words.length > 20) {
    return words.slice(0, 20).join(" ") + "...";
  }
  return description;
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

// Ajout de middlewares
app.use(helmet(cspOption));
app.use(compression());
app.use(cors());
app.use(json());
// Configure session management
app.use(
  session({
    cookie: { maxAge: 3600000 }, // la dure du cookie est de 1 heure
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 3600000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
  })
);

app.use(urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// API endpoint for user login
app.post("/api/connexion", async (request, response, next) => {
  if (request.body.courriel && request.body.motdepasse) {
    passport.authenticate("local", (erreur, utilisateur, info) => {
      if (erreur) {
        console.log(`Erreur d'authentification: ${erreur}`);

        next(erreur);
      } else if (!utilisateur) {
        console.log(`Erreur d'authentification: ${info}`);
        response.status(401).json(info);
      } else {
        request.logIn(utilisateur, (erreur) => {
          if (erreur) {
            next(erreur);
          }

          return response.status(200).end();
        });
        // console.log(`request session  utilisateur : ${JSON.stringify(request.user)}`);
      }
    })(request, response, next);
  } else {
    response.status(400).end();
  }
});

// APi deconnexion d'un utilisateur
app.post("/api/deconnexion", (request, response, next) => {
  request.logOut((erreur) => {
    if (erreur) {
      next(erreur);
    }
    response.redirect("/");
  });
});

// API pour affiche la page d'acceuil
app.get("/", async (request, response) => {
  try {
    const meslivresalaune = await getlivres();
    const randomBooks = getRandomBooks(meslivresalaune, 4);

    let itOption = false;
    if (
      request.user &&
      request.session.passport.user == request.user.id_utilisateur
    ) {
      // console.log(`request user: ${JSON.stringify(request.user)}`);
      itOption = true;
    }

    response.render("home", {
      titre: "Arlequin et Roman | ReadEasy",
      styles: ["/css/home.css"],
      scripts: ["/js/home.js", "js/modules/module-livre-a-laune.js"],
      livres: randomBooks,
      user: request.user,
      itOption,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    response.status(500).send("Internal Server Error");
  }
});

// la pages apropos
app.get("/readeasyapropos", async (request, response) => {
  response.render("pages/apropos", {
    titre: "ReadEasy | Page a propos",
    styles: ["/css/pages/apropos.css"],
    scripts: ["/js/pages/apropos.js"],
    user: request.user,
  });
});

// Afficher tous les livres
app.get("/nos-livres", async (request, response) => {
  const vosLivres = await getlivres();

  response.render("pages/livres", {
    titre: "ReadEasy | Nos livres",
    styles: ["/css/pages/livres.css"],
    scripts: ["/js/pages/livres.js"],
    livres: vosLivres,
    user: request.user,
  });
});

// Afficher un livre
app.get("/livre/:id_livre", async (request, response) => {
  const id_livre = parseInt(request.params.id_livre);
  const livre = await getlivre(id_livre);

  // console.log(livre.est_gratuit);

  response.render("pages/livre", {
    titre: `ReadEasy | ${livre.titre}`,
    styles: ["/css/pages/livre.css", "/css/style.css"],
    scripts: ["/js/pages/livre.js"],
    livre,
    user: request.user,
  });
});

//Creer une publication
app.get("/publier-un-livre", async (request, response) => {
  response.render("partials/modules/publier-un-livre", {
    titre: "ReadEasy | Publier un livre",
    styles: ["/css/modules/publier-un-livre.css"],
    scripts: ["/js/modules/publier-un-livre.js"],
    user: request.user,
  });
});

// Mise a jour d'un livre
app.get("/modifier-un-livre/:id_livre", async (request, response) => {
  // si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!request.user) {
    return response.redirect("/connexion");
  }

  const id_livre = parseInt(request.params.id_livre);
  const livre = await getlivre(id_livre);
  response.render("partials/modules/publier-un-livre", {
    titre: "ReadEasy | Modifier un livre",
    styles: ["/css/modules/publier-un-livre.css", "/css/style.css"],
    scripts: ["/js/modules/modifier-un-livre.js"],
    livre,
    user: request.user, //Utilistateur connecter
  });
});

//page de connexion
app.get("/connexion", async (request, response) => {
  response.render("partials/modules/connexion", {
    titre: "ReadEasy | Bienvenu, connexion utilisateur",
    styles: ["/css/pages/connexion.css"],
    scripts: ["/js/pages/connexion.js"],
  });
});

//page de creation de compte
app.get("/creer-un-compte", async (request, response) => {
  response.render("partials/modules/creer-un-compte", {
    titre: "ReadEasy | Creer un compte utilisateur",
    styles: ["/css/pages/creer-un-compte.css"],
    scripts: ["/js/pages/creer-un-compte.js"],
  });
});

//page de modification de compte
app.get("/monProfile", async (request, response) => {
  // si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!request.user) {
    return response.redirect("/connexion");
  }



  const id_utilisateur = parseInt(request.user.id_utilisateur);
  const utilisateur = await utilisateurParId(id_utilisateur);

    console.log(`utilisateur: ${JSON.stringify(utilisateur)}`);

  //livre de l'utilisateur
    const meslivres = await getlivresUser(id_utilisateur);
    console.log(`meslivres: ${JSON.stringify(meslivres)}`);

  response.render("partials/modules/profil-utilisateur", {
    titre: "ReadEasy | Page profil utilisateur",
    styles: ["/css/pages/profil-utilisateur.css"],
    scripts: ["/js/pages/profil-utilisateur.js"],
    utilisateur,
    user: request.user, //Utilistateur connecter
  });
});

// Route vers le panier d'achats
app.get("/panierAchats", async (request, response) => {
  // si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!request.user) {
    return response.redirect("/connexion");
  }
  const id_utilisateur = request.user.id_utilisateur;
  if (!id_utilisateur) {
    return response.status(401).json({ error: "Utilisateur non connecté" });
  }

  const mesCommadesetprix = await getLivresEtTotalPrixDansPanier(
    id_utilisateur
  );

  response.render("partials/modules/panier-achats", {
    titre: "ReadEasy | Module panier d'achat ",
    styles: ["/css/modules/module-panier-achats.css"],
    scripts: ["/js/modules/module-panier-achats.js"],
    user: request.user, //Utilistateur connecter
    mesCommades: mesCommadesetprix.livresEtDetails,
    total: mesCommadesetprix.totalPrix,
  });
});

//Route pour details ajouts d'un livre
app.get("/details-ajout-livre/:id_livre", async (request, response) => {
  // si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!request.user) {
    return response.redirect("/connexion");
  }

  const id_livre = parseInt(request.params.id_livre);
  const livre = await getlivre(id_livre);
  // console.log(`livre: ${JSON.stringify(livre)}`);

  response.render("partials/modules/details-ajout-livre", {
    titre: "ReadEasy | Details ajout d'un livre",
    styles: ["/css/modules/details-ajout-livre.css", "/css/style.css"],
    scripts: ["/js/modules/details-ajout-livre.js"],
    user: request.user, //Utilistateur connecter
    livre,
  });
});

//======================================================================

// Route pour ajouter un livre
app.post(
  "/api/livre",
  upload.fields([{ name: "url_image" }, { name: "document" }]),
  async (request, response) => {
    try {
      let { isbn, titre, description, prix, est_gratuit, auteur } =
        request.body;

      if (!request.files["url_image"] || !request.files["document"]) {
        return response
          .status(400)
          .json({ error: "Les fichiers url_image et document sont requis." });
      }

      const url_image = request.files["url_image"][0].filename;
      const document = request.files["document"][0].filename;

      est_gratuit = Boolean(parseInt(est_gratuit)); // Ensure est_gratuit is a boolean
      prix = parseFloat(prix);

      const id_utilisateur = request.user.id_utilisateur;

      const livre = await addlivre(
        isbn,
        titre,
        description,
        prix,
        est_gratuit,
        auteur,
        url_image,
        document,
        id_utilisateur
      );
      return response
        .status(200)
        .json({ livre, message: "Livre ajouté avec succès" });
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
);

// Route pour modifier un livre
app.patch(
  "/api/livre/:id_livre",
  upload.fields([{ name: "url_image" }, { name: "document" }]),
  async (request, response) => {
    try {
      // si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      if (!request.user) {
        return response.redirect("/");
      }

      const id_livre = parseInt(request.params.id_livre);
      let { isbn, titre, description, prix, est_gratuit, auteur } =
        request.body;
      if (!request.files["url_image"] || !request.files["document"]) {
        return response
          .status(400)
          .json({ error: "Les fichiers url_image et document sont requis." });
      }

      const url_image = request.files["url_image"][0].filename;
      const document = request.files["document"][0].filename;
      est_gratuit = Boolean(parseInt(est_gratuit)); // Ensure est_gratuit is a boolean
      prix = parseFloat(prix);

      const id_utilisateur = request.user.id_utilisateur;

      await updatelivre(
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
      );
      return response
        .status(200)
        .json({ message: "Livre mis à jour avec succès" });
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
);

// Route pour obtenir la liste des livres
app.get("/api/livres", async (request, response) => {
  try {
    const livres = await getlivres();
    return response.status(200).json(livres);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

// Route pour obtenir un livre par son ID
app.get("/api/livre/:id_livre", async (request, response) => {
  try {
    const id_livre = parseInt(request.params.id_livre);
    const livre = await getlivre(id_livre);
    if (!livre) {
      return response.status(404).json({ error: "Livre non trouvé" });
    }
    return response.status(200).json(livre);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

// Route pour mettre à jour un livre
app.patch("/api/livre/:id_livre", async (request, response) => {
  try {
    // si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!request.user) {
      return response.redirect("/connexion");
    }

    const id_livre = parseInt(request.params.id_livre);

    const {
      isbn,
      titre,
      description,
      prix,
      est_gratuit,
      auteur,
      url_image,
      document,
    } = request.body;

    const livre = await updatelivre(
      id_livre,
      isbn,
      titre,
      description,
      prix,
      Boolean(est_gratuit), // Ensure est_gratuit is a boolean
      auteur,
      url_image,
      document
    );

    return response
      .status(200)
      .json({ livre, message: "livre mise à jour avec succès" });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

//route pour supprimer un livre
app.delete("/api/livre/:id_livre", async (request, response) => {
  try {
    // si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!request.user) {
      return response.redirect("/connexion");
    }

    const id_livre = parseInt(request.params.id_livre);
    const livre = await getlivre(id_livre);

    if (livre) {
      // Delete the files associated with the book
      const url_image_path = path.join(__dirname, "uploads", livre.url_image);
      const document_path = path.join(__dirname, "uploads", livre.document);
      console.log(`url_image_path: ${url_image_path}`);
      console.log(`document_path: ${document_path}`);

      // Check if the files exist and delete them
      if (fs.existsSync(url_image_path)) {
        fs.unlinkSync(url_image_path);
      }
      if (fs.existsSync(document_path)) {
        fs.unlinkSync(document_path);
      }

      // Delete the book from the database
      await deletelivre(id_livre);
      return response
        .status(200)
        .json({ livre, message: "Livre supprimé avec succès" });
    } else {
      return response.status(404).json({ error: "Livre non trouvé" });
    }
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

/**
 * ========================================================================================================
 * Recuperer tous les utilisateurs
 *
 */

// Route pour obtenir la liste des utilisateurs
app.get("/api/toutlesutilisateurs", async (request, response) => {
  try {
    // si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!request.user) {
      return response.redirect("/connexion");
    }
    const utilisateurs = await toutLesUtilisateurs();
    return response.status(200).json(utilisateurs);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

// Route pour obtenir un utilisateur par son ID
app.get("/api/utilisateur/:id_utilisateur", async (request, response) => {
  try {
    // si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!request.user) {
      return response.redirect("/connexion");
    }
    const id_utilisateur = parseInt(request.params.id_utilisateur);
    const utilisateur = await utilisateurParId(id_utilisateur);
    return response.status(200).json(utilisateur);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

// Route pour mettre à jour un utilisateur
app.patch("/api/utilisateur/:id_utilisateur", async (request, response) => {
  try {
    // si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!request.user) {
      return response.redirect("/connexion");
    }
    const id_utilisateur = parseInt(request.params.id_utilisateur);
    const { nom, prenom, courriel, acces, mot_de_passe } = request.body;
    const utilisateur = await mettreAJourUtilisateur(
      id_utilisateur,
      nom,
      prenom,
      courriel,
      acces,
      mot_de_passe
    );
    return response
      .status(200)
      .json({ utilisateur, message: "Utilisateur mis à jour avec succès" });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

// Route pour creer un utilisateur
app.post("/api/utilisateur", async (request, response) => {
  try {
   
    const { nom, prenom, courriel, acces, mot_de_passe } = request.body;
    const utilisateur = await creerUtilisateur(
      nom,
      prenom,
      courriel,
      acces,
      mot_de_passe
    );
    return response
      .status(200)
      .json({ utilisateur, message: "Utilisateur créé avec succès" });
  } catch (error) {
    console.error(error);
    // Check if the error is a unique constraint violation
    if (error.code === "P2002") {
      return response
        .status(409)
        .json({ error: "L'adresse e-mail est déjà utilisée." });
    }
    return response.status(400).json({ error: error.message });
  }
});

/** ============================================================
 *  Mon panier d'achats
 *  ============================================================
 */

// Route pour ajouter un livre au panier
app.post("/api/panier", async (request, response) => {
  try {
    // si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!request.user) {
      return response.redirect("/connexion");
    }
    const { id_utilisateur, id_livre, quantite } = request.body;
    const commande = await addCommande(id_utilisateur, id_livre, quantite);
    return response
      .status(200)
      .json({ commande, message: "Commande ajoutée avec succès" });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

// Route pour obtenir la liste des commandes
app.get("/api/panier", async (request, response) => {
  try {
    // si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!request.user) {
      return response.redirect("/connexion");
    }
    const commandes = await getCommandes();
    return response.status(200).json(commandes);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

// Route pour obternir les commandes d'un utilisateur
app.get("/api/panier/:id_utilisateur", async (request, response) => {
  try {
    // si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!request.user) {
      return response.redirect("/connexion");
    }
    const id_utilisateur = parseInt(request.params.id_utilisateur);
    const commandes = await getAllCommandeUser(id_utilisateur);
    return response.status(200).json(commandes);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

// Route pour supprimer une commande
app.delete("/api/panier/:id_panier", async (request, response) => {
  try {
    // si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!request.user) {
      return response.redirect("/connexion");
    }

    const id_panier = parseInt(request.params.id_panier);
    const commande = await deleteCommandeBook(id_panier);
    return response
      .status(200)
      .json({ commande, message: "Livre supprimé du panier avec succès" });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

// Renvoyer une erreur 404 pour les routes non définies
app.use(function (request, response) {
  // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
  response.status(404).send(request.originalurl_image + " not found.");
});

// Démarrage du serveur
app.listen(process.env.PORT);
console.info(`Serveur démarré:`);
console.info(`http://localhost:${process.env.PORT}`);
