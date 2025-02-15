// Aller chercher les configurations de l'application
import 'dotenv/config';

// Importer les fichiers et librairies
import express, { json, urlencoded } from 'express';
import expressHandlebars from 'express-handlebars';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cspOption from './csp-options.js'

// Création du serveur
const app = express();
app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');
app.set("views", "./views");

// Ajout de middlewares
app.use(helmet(cspOption));
app.use(compression());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(express.static('public'));

// Ajouter les routes ici ...
app.get('/', (request, response) => {
    response.render('home', {
        title: 'Page d\'accueil',
    });
});


/** Creation de mes route pour modules */

// Route vers le module bar de Navigation
app.get('/moduleheader', async (request, response) => {
    response.render("modules/module-header", {
        titre: "ReadEasy | Modules bar de navigation",
      });
});


// Route vers le module footer
app.get('/modulefooter', async (request, response) => {
    response.render("modules/module-footer", {
        titre: "ReadEasy | Modules pied de page",
      });
});

// Route vers le module footer
app.get('/modulecaroussel', async (request, response) => {
    response.render("modules/module-caroussel", {
        titre: "ReadEasy | Modules caroussel image",
        styles: ["/css/modules/module-caroussel.css"],
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

// Route vers la pages apropos
app.get('/readeasyapropos', async (request, response) => {
    response.render("pages/apropos", {
        titre: "ReadEasy | Page a propos",
        styles: ["/css/pages/apropos.css"],
        scripts: ["/js/pages/apropos.js"],
      });
});


// Renvoyer une erreur 404 pour les routes non définies
app.use(function (request, response) {
    // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
    response.status(404).send(request.originalUrl + ' not found.');
});

// Démarrage du serveur
app.listen(process.env.PORT);
console.info(`Serveurs démarré:`);
console.info(`http://localhost:${ process.env.PORT }`);
