document.addEventListener('DOMContentLoaded', () => {
    const boutonsDelete = document.querySelectorAll('.remove-item');
    
    async function deleteLivreServeur(event) {
         
        event.preventDefault();
// Bouton
        const bouton = event.currentTarget;
        // Préparer les données
        const id_panier = parseInt(bouton.dataset.id);

        console.log({ id_panier });
        
        try {
            // Envoyer la requête au serveur
            const response = await fetch(`/api/panier/${id_panier}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            // Redirection à la page d'accueil si tout a bien fonctionné
            if (response.ok) {
                console.log('Book deleted');
                bouton.closest('.cart-item').remove();
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