function prepareDonnee() {
    const titre = document.getElementById('titre').value;
    const description = document.getElementById('description').value;
    const auteur = document.getElementById('auteur').value;
    const isbn = document.getElementById('isbn').value;
    const prix = document.getElementById('prix').value;
    const est_gratuit = document.getElementById('est_gratuit').checked;
    const url_image = document.getElementById('url_image').files[0];
    const documentFile = document.getElementById('document').files[0];


    return {
        isbn: isbn, 
        titre: titre,
        description: description,
        prix: prix,
        est_gratuit: est_gratuit == true ? 1 : 0,
        auteur: auteur,
        url_image: url_image,
        document: documentFile
    };
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('updateForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const id_livre = document.getElementById('id_livre').value;

        // Préparer les données
        const data = prepareDonnee();

        console.log("valeur saisir : " + data);
        console.log("valeur saisir : " + JSON.stringify(data));
        console.log("valeur saisir : " + data.titre);
        console.log("valeur saisir : " + data.description);
        console.log("valeur saisir : " + data.auteur);
        console.log("valeur saisir : " + data.isbn);
        console.log("valeur saisir : " + data.prix);
        console.log("valeur saisir : " + data.est_gratuit);
        console.log("valeur saisir : " + data.url_image);

        const formData = new FormData();
        formData.append('isbn', data.isbn);
        formData.append('titre', data.titre);
        formData.append('description', data.description);
        formData.append('prix', data.prix);
        formData.append('est_gratuit', data.est_gratuit);
        formData.append('auteur', data.auteur);
        formData.append('url_image', data.url_image);
        formData.append('document', data.document);

        try {
            const response = await fetch(`/api/livre/${id_livre}`, {
                method: 'PATCH',
                body: formData
            });

            // Envoyer la requête au serveur
            if (response.ok) {
                location.href = '/nos-livres';
            } else {
                const errorData = await response.json();
                alert(`Erreur: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Une erreur est survenue lors de la publication du livre.');
        }
    });
});