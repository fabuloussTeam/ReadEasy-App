// Aller chercher les configurations de l'application
import 'dotenv/config';

// Importer les fichiers et librairies
import express, { json, urlencoded } from 'express';
import expressHandlebars from 'express-handlebars';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cspOption from './csp-options.js'
import { addlivre, getlivres, updatelivre, deletelivre } from './model/readeasy.js';
import { getRandomBooks } from './public/js/home.js';

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


app.get('/', async (request, response) => {
    try {
        const meslivresalaune = await getlivres();
        const randomBooks = getRandomBooks(meslivresalaune, 4);
        console.log(`Random books: ${randomBooks.map(book => book.titre).join(', ')}`);
        
        response.render('home', {
            titre: "Arlequin et Roman | ReadEasy",
            styles: ["/css/home.css"],
            scripts: ["/js/home.js"],
            livres: randomBooks,
        });
    } catch (error) {
        console.error('Error fetching books:', error);
        response.status(500).send('Internal Server Error');
    }
});





// Route vers la pages apropos
app.get('/readeasyapropos', async (request, response) => {
    response.render("pages/apropos", {
        titre: "ReadEasy | Page a propos",
        styles: ["/css/pages/apropos.css"],
        scripts: ["/js/pages/apropos.js"],
      });
});

app.get('/nos-livres', async (request, response) => {
    response.render("pages/livres", {
        titre: "ReadEasy | Nos livres",
        styles: ["/css/pages/livres.css"],
        scripts: ["/js/pages/livres.js"],
      });
});




// ======================================================================

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
            url_image
        } = request.body;

        const livre = await updatelivre(
            id_livre,
            isbn,
            titre,
            description,
            prix,
            Boolean(est_gratuit), // Ensure est_gratuit is a boolean
            auteur,
            url_image
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


// ======================================================================



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

// Route vers le module footer
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



// Renvoyer une erreur 404 pour les routes non définies
app.use(function (request, response) {
    // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
    response.status(404).send(request.originalurl_image + ' not found.');
});

// Démarrage du serveur
app.listen(process.env.PORT);
console.info(`Serveurs démarré:`);
console.info(`http://localhost:${ process.env.PORT }`);
