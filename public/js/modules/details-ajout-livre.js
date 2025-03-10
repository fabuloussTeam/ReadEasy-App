document.addEventListener('DOMContentLoaded', function() {
    const quantityInput = document.querySelector('.quantity');
    const minusBtn = document.querySelector('.minus');
    const plusBtn = document.querySelector('.plus');
    const idLivreInput = document.getElementById('livreid');
    const idUtilisateurInput = document.getElementById('id_utilisateur'); 

           

    minusBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    plusBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });

    document.querySelector('.add-to-basket-button').addEventListener('click', async function() {
        const quantity = parseInt(quantityInput.value);
        const id_livre = parseInt(idLivreInput.value);
        const id_utilisateur = parseInt(idUtilisateurInput.value);

        console.log('id_livre:', id_livre);
        console.log('quantity:', quantity);
        console.log('id_utilisateur:', id_utilisateur);
        try {
            const response = await fetch('/api/panier', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_utilisateur: id_utilisateur,
                    id_livre: id_livre,
                    quantite: quantity
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add item to basket');
            } else {
               location.href = '/panierAchats';
            }
            
        } catch (error) {
            console.error('Error:', error);
        }

        alert(`Thank you for your purchase of ${quantity} item(s)!`);
    });
});