
//=======================================================================
const boutonsDelete = document.getElementsByClassName('supprimer-btn');

async function deleteEchangeServeur(event) {
    // Bouton 
    const bouton = event.currentTarget;
    bouton.preventDefault();
    alert('deleteEchangeServeur');
/*
    // Préparer les données
    const data = {
        echangeId: parseInt(bouton.dataset.id)
    }

    // Envoyer la requête au serveur
    const response = await fetch('/api/echange', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    // Redirection à la page d'accueil si tout a bien fonctionner
    if(response.ok) {
        bouton.parentNode.parentNode.remove();
    }
        */
}

/**for(let bouton of boutonsDelete) {
    bouton.addEventListener('click', deleteEchangeServeur)
} */
