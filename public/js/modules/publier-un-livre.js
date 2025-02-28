document.getElementById('publishForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;
    const cover = document.getElementById('cover').files[0];
    const documentFile = document.getElementById('document').files[0];

    if (title && description && author && isbn && cover && documentFile) {
        alert('Livre publié avec succès!');
        // Vous pouvez ajouter ici le code pour traiter les données du formulaire
    } else {
        alert('Veuillez remplir tous les champs requis.');
    }
});