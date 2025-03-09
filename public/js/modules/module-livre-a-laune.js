document.addEventListener('DOMContentLoaded', () => {
    const boutonsDelete = document.querySelectorAll('.supprimer-btn');
    
    async function deleteLivreServeur(event) {
        // Bouton 
        const bouton = event.currentTarget;
        event.preventDefault();

        // Préparer les données
        const id_livre = parseInt(bouton.dataset.id);

        console.log({ id_livre });
        
        try {
            // Envoyer la requête au serveur
            const response = await fetch(`/api/livre/${id_livre}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            // Redirection à la page d'accueil si tout a bien fonctionné
            if (response.ok) {
                console.log('Book deleted');
                bouton.closest('.livre-a-laune').remove();
            } else {
                const errorData = await response.json();
                console.error(`Failed to delete book: ${errorData.error}`);
                alert(`Erreur: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Une erreur est survenue lors de la suppression du livre.');
        }
    }

    for (let bouton of boutonsDelete) {
        bouton.addEventListener('click', deleteLivreServeur);
    }
});