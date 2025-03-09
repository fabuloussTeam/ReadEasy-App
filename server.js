// Aller chercher les configurations de l'application
import 'dotenv/config';

// Importer les fichiers et librairies
import express, { json, urlencoded } from 'express';
import expressHandlebars from 'express-handlebars';
import Handlebars from 'handlebars';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import session from 'express-session';
import memorystore from "memorystore";
import passport from "passport";
import { PrismaClient } from '@prisma/client';
import cspOption from './csp-options.js';
import { addlivre, getlivres, updatelivre, deletelivre, getlivre } from './model/readeasy.js';
import { getRandomBooks } from './public/js/home.js';
import { toutLesUtilisateurs,
         utilisateurParId,
         mettreAJourUtilisateur,
         creerUtilisateur } from './model/utilisateur.js';
import "./authentification.js";

// Création du serveur
const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
    }
});


const upload = multer({ storage: storage });

//const upload = multer({ dest: 'uploads/' });
// Initialisation de la base de données de session
const MemoryStore = memorystore(session);

const hbs = expressHandlebars.create({
    helpers: {
        concat: (str1, str2) => {
            return str1 + str2;
        }
    }
});

// Register a custom helper to truncate description to the first 20 words
Handlebars.registerHelper('truncateDescription', function(description) {
    const words = description.split(' ');
    if (words.length > 20) {
        return words.slice(0, 20).join(' ') + '...';
    }
    return description;
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set("views", "./views");

// Ajout de middlewares
app.use(helmet(cspOption));
app.use(compression());
app.use(cors());
app.use(json());
// Configure session management
app.use(
    session({
      cookie: { maxAge: 3600000 },
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
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));


// API endpoint for user login
app.post('/api/connexion', async (request, response, next) => {
    if (
        request.body.courriel &&
        request.body.motdepasse
      ) {
        passport.authenticate("local", (erreur, utilisateur, info) => {
          if (erreur) {
            next(erreur);
          } else if (!utilisateur) {
            response.status(401).json(info);
          } else {
            request.logIn(utilisateur, (erreur) => {
              if (erreur) {
                next(erreur);
              }
              response.status(200).end();
            });
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
app.get('/', async (request, response) => {

    try {
        const meslivresalaune = await getlivres();
        const randomBooks = getRandomBooks(meslivresalaune, 4);
       // console.log(`Random books: ${randomBooks.map(book => book.titre).join(', ')}`);
       let itOption = false;
       // verification des session
       console.log(`request reauest user: ${JSON.stringify(request.user)}`);
       console.log(`request session:  ${ JSON.stringify(request.session)}`);
       console.log(`request session user:  ${ JSON.stringify(request.session.passport)}`);

       if (request.user && (request.session.passport.user == request.user.id_utilisateur)) {
          // console.log(`request user: ${JSON.stringify(request.user)}`);
            itOption = true;
       }
      
        response.render('home', {
            titre: "Arlequin et Roman | ReadEasy",
            styles: ["/css/home.css"],
            scripts: ["/js/home.js", "js/modules/module-livre-a-laune.js"],
            livres: randomBooks,
            user: request.user,
            itOption
        });
    } catch (error) {
        console.error('Error fetching books:', error);
        response.status(500).send('Internal Server Error');
    }
});

// la pages apropos
app.get('/readeasyapropos', async (request, response) => {
    response.render("pages/apropos", {
        titre: "ReadEasy | Page a propos",
        styles: ["/css/pages/apropos.css"],
        scripts: ["/js/pages/apropos.js"],
        user: request.user
      });
});

// Afficher tous les livres
app.get('/nos-livres', async (request, response) => {
    const vosLivres = await getlivres();

    response.render("pages/livres", {
        titre: "ReadEasy | Nos livres",
        styles: ["/css/pages/livres.css"],
        scripts: ["/js/pages/livres.js"],
        livres: vosLivres,
        user: request.user
      });
});

// Afficher un livre
app.get('/livre/:id_livre', async (request, response) => {
    const id_livre = parseInt(request.params.id_livre);
    const livre = await getlivre(id_livre);
 

    console.log(livre.est_gratuit);
    

    response.render("pages/livre", {
        titre: `ReadEasy | ${livre.titre}`,
        styles: ["/css/pages/livre.css", "/css/style.css"],
        scripts: ["/js/pages/livre.js"],
        livre,
        user: request.user

      });
});

//Creer une publication
app.get('/publier-un-livre', async (request, response) => {
    response.render("partials/modules/publier-un-livre", {
        titre: "ReadEasy | Publier un livre",
        styles: ["/css/modules/publier-un-livre.css"],
        scripts: ["/js/modules/publier-un-livre.js"],
        user: request.user
    });
});

// Mise a jour d'un livre
app.get('/modifier-un-livre/:id_livre', async (request, response) => {
    const id_livre = parseInt(request.params.id_livre);
    const livre = await getlivre(id_livre);
    response.render("partials/modules/publier-un-livre", {
        titre: "ReadEasy | Modifier un livre",
        styles: ["/css/modules/publier-un-livre.css", "/css/style.css"],
        scripts: ["/js/modules/modifier-un-livre.js"],
        livre,
        user: request.user //Utilistateur connecter
    });
});

//page de connexion
app.get('/connexion', async (request, response) => {
    response.render("partials/modules/connexion", {
        titre: "ReadEasy | Bienvenu, connexion utilisateur",
        styles: ["/css/pages/connexion.css"],
        scripts: ["/js/pages/connexion.js"],
      });
});


//page de creation de compte
app.get('/creer-un-compte', async (request, response) => {
    response.render("partials/modules/creer-un-compte", {
        titre: "ReadEasy | Creer un compte utilisateur",
        styles: ["/css/pages/creer-un-compte.css"],
        scripts: ["/js/pages/creer-un-compte.js"],
      });
});

//======================================================================

// Route pour ajouter un livre
app.post("/api/livre", upload.fields([{ name: 'url_image' }, { name: 'document' }]), async (request, response) => {
    try {
        let { isbn, titre, description, prix, est_gratuit, auteur } = request.body;

        if (!request.files['url_image'] || !request.files['document']) {
            return response.status(400).json({ error: 'Les fichiers url_image et document sont requis.' });
        }

        const url_image = request.files['url_image'][0].filename;
        const document = request.files['document'][0].filename;

        est_gratuit = Boolean(parseInt(est_gratuit)); // Ensure est_gratuit is a boolean
        prix = parseFloat(prix);

        const livre = await addlivre(isbn, titre, description, prix, est_gratuit, auteur, url_image, document);
        return response.status(200).json({ livre, message: "Livre ajouté avec succès" });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

// Route pour modifier un livre
app.patch("/api/livre/:id_livre", upload.fields([{ name: 'url_image' }, { name: 'document' }]), async (request, response) => {
    try {
        const id_livre = parseInt(request.params.id_livre);
        let { isbn, titre, description, prix, est_gratuit, auteur } = request.body;
        if (!request.files['url_image'] || !request.files['document']) {
            return response.status(400).json({ error: 'Les fichiers url_image et document sont requis.' });
        }

        const url_image = request.files['url_image'][0].filename;
        const document = request.files['document'][0].filename;
        est_gratuit = Boolean(parseInt(est_gratuit)); // Ensure est_gratuit is a boolean
        prix = parseFloat(prix);
        await updatelivre(id_livre, isbn, titre, description, prix, est_gratuit, auteur, url_image, document);
        return response.status(200).json({ message: "Livre mis à jour avec succès" });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

// ======================================================================
/*
// Route pour ajouter un livre
app.post("/api/livre", async (request, response) => {
   
    try {
        const { 
            isbn,
            titre,
            description,
            prix,
            est_gratuit,
            auteur,
            url_image
          } = request.body;
         console.log("c'est mange:"+ isbn, titre, description, prix, est_gratuit, auteur, url_image);
          
        const livre = await addlivre(
            isbn, 
            titre, 
            description, 
            prix, 
            est_gratuit, 
            auteur,
            url_image
        );
        return response
            .status(200)
            .json({ livre, message: "Livre ajoutée avec succès" });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});
*/
// Route pour obtenir la liste des livres
app.get("/api/livres", async (request, response) => {
    try {
        const livres = await getlivres();
        return response.status(200).json(livres);

    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

// Route pour mettre à jour un livre
app.patch("/api/livre/:id_livre", async (request, response) => {
    try {
        const id_livre = parseInt(request.params.id_livre);   

        const {
            isbn,
            titre,
            description,
            prix,
            est_gratuit,
            auteur,
            url_image,
            document
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
        const id_livre = parseInt(request.params.id_livre);
        const livre = await deletelivre(id_livre);
        return response
            .status(200)
            .json({ livre, message: "livre supprimée avec succès" });
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
        const utilisateurs = await toutLesUtilisateurs();
        return response.status(200).json(utilisateurs);
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

// Route pour obtenir un utilisateur par son ID
app.get("/api/utilisateur/:id_utilisateur", async (request, response) => {
    try {
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
        const id_utilisateur = parseInt(request.params.id_utilisateur);
        const { nom, prenom, courriel, acces, mot_de_passe } = request.body;
        const utilisateur = await mettreAJourUtilisateur(id_utilisateur, nom, prenom, courriel, acces, mot_de_passe);
        return response.status(200).json({ utilisateur, message: "Utilisateur mis à jour avec succès" });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

// Route pour creer un utilisateur
app.post("/api/utilisateur", async (request, response) => {
    try {
        const { nom, prenom, courriel, acces, mot_de_passe } = request.body;
        const utilisateur = await creerUtilisateur(nom, prenom, courriel, acces, mot_de_passe);
        return response.status(200).json({ utilisateur, message: "Utilisateur créé avec succès" });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});








/*********** Creation des modules reuitilisables *********/

// Route vers le module bar de Navigation
app.get('/moduleheader', async (request, response) => {
    response.render("modules/module-header", {
        titre: "ReadEasy | Modules bar de navigation",
        styles: ["/css/modules/module-header.css"],
        scripts: ["/js/modules/module-header.js"],
      });
});

// Route vers le module footer
app.get('/modulefooter', async (request, response) => {
    response.render("modules/module-footer", {
        titre: "ReadEasy | Modules pied de page",
        styles: ["/css/modules/module-footer.css"],
        scripts: ["/js/modules/module-footer.js"],
      });
});


app.get('/modulecaroussel', async (request, response) => {

    var imgs = [
        { url_image: "https://user-images.githubusercontent.com/78242022/273443252-b034e050-3d70-48ef-9f0f-2d77ef9b2604.jpg", alt: "Image 01" },
        { url_image: "https://user-images.githubusercontent.com/78242022/273443252-b034e050-3d70-48ef-9f0f-2d77ef9b2604.jpg", alt: "Image 02" },
        { url_image: "https://user-images.githubusercontent.com/78242022/273443248-130249b5-87b7-423d-9281-48d810bcd30d.jpg", alt: "Image 03" }
    ]

    response.render("modules/module-caroussel", {
        titre: "ReadEasy | Modules caroussel image",
        styles: ["/css/modules/module-caroussel.css"],
        scripts: ["/js/modules/module-caroussel.js"],
        images: imgs
      });
});

// Route vers le module presentation livre style 01 
app.get('/modulepresentationstyleun', async (request, response) => {
    response.render("modules/module-presentation-livre-premiere", {
        titre: "ReadEasy | Modules presentation d'un livre style un",
        styles: ["/css/modules/module-presentation-livre-premiere.css"],
        scripts: ["/js/modules/module-presentation-livre-premiere.js"],
      });
});
// Route vers le module presentation livre style 02
app.get('/modulepresentationstyledeux', async (request, response) => {
    response.render("modules/module-presentation-livre-deuxieme", {
        titre: "ReadEasy | Modules presentation d'un livre style deux",
        styles: ["/css/modules/module-presentation-livre-deuxieme.css"],
        scripts: ["/js/modules/module-presentation-livre-deuxieme.js"],
      });
});

// Route vers module un livre a la une
app.get('/modulelivrealaune', async (request, response) => {
    response.render("modules/module-livre-a-laune", {
        titre: "ReadEasy | Modules presentation d'un livre a la une",
        styles: ["/css/modules/module-livre-a-laune.css"],
        scripts: ["/js/modules/module-livre-a-laune.js"],
      });
});

// Route vers module espace publicitaire
app.get('/moduleespacepublicitaire', async (request, response) => {
    response.render("modules/module-espace-publicitaire", {
        titre: "ReadEasy | Modules espace publicitaire",
        styles: ["/css/modules/module-espace-publicitaire.css"],
        scripts: ["/js/modules/module-espace-publicitaire.js"],
      });
});  

// Route vers module nos partenaires
app.get('/modulenospartenaires', async (request, response) => {
    response.render("modules/module-nos-partenaires", {
        titre: "ReadEasy | Modules nos partenaires",
        styles: ["/css/modules/module-nos-partenaires.css"],
        scripts: ["/js/modules/module-nos-partenaires.js"],
      });
});


// Route vers le module connexion utilisateur
app.get('/moduleconnexion', async (request, response) => {
    response.render("modules/module-connexion", {
        titre: "ReadEasy | Module connexion utilisateur",
        styles: ["/css/modules/module-connexion.css"],
        scripts: ["/js/modules/module-connexion.js"],
      });
});

// Route vers le module creation de compte utilisateur
app.get('/modulecreationdecompte', async (request, response) => {
    response.render("modules/module-creationdecompte", {
        titre: "ReadEasy | Module creation de compte ",
        styles: ["/css/modules/module-creationdecompte.css"],
        scripts: ["/js/modules/module-creationdecompte.js"],
    });
});


// Route vers le module creation de compte utilisateur
app.get('/panierachats', async (request, response) => {
    response.render("modules/module-panier-achats", {
        titre: "ReadEasy | Module panier d'achat ",
        styles: ["/css/modules/module-panier-achats.css"],
        scripts: ["/js/modules/module-panier-achats.js"],
    });
});



// Renvoyer une erreur 404 pour les routes non définies
app.use(function (request, response) {
    // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
    response.status(404).send(request.originalurl_image + ' not found.');
});

// Démarrage du serveur
app.listen(process.env.PORT);
console.info(`Serveur démarré:`);
console.info(`http://localhost:${ process.env.PORT }`);
