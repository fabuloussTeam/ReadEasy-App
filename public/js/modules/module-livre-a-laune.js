/**
 * Supprimer un livre de la liste à la une
 */

document.addEventListener('DOMContentLoaded', () => {
    const boutonsDelete = document.querySelectorAll('.supprimer-btn');
    
    async function deleteLivreServeur(event) {
        // Bouton 
        const bouton = event.currentTarget;
        event.preventDefault();
       // alert('deleteLivreServeur');

        // Préparer les données
        const data = {
            echangeId: parseInt(bouton.dataset.id)
        }

        console.log(data);
        
        try {
            // Envoyer la requête au serveur
            const response = await fetch(`/api/livre/${data.livreId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            // Redirection à la page d'accueil si tout a bien fonctionner
            if (response.ok) {
                console.log('Livre supprimer');
                bouton.closest('.livre-a-laune').remove();
            } else {
                console.error('Failed to delete book');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    for (let bouton of boutonsDelete) {
        bouton.addEventListener('click', deleteLivreServeur);
    }
});