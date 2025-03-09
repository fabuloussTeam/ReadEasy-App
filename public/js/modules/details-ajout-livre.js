document.addEventListener('DOMContentLoaded', function() {
    const quantityInput = document.querySelector('.quantity');
    const minusBtn = document.querySelector('.minus');
    const plusBtn = document.querySelector('.plus');

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

    document.querySelector('.add-to-basket-button').addEventListener('click', function() {
        const quantity = parseInt(quantityInput.value);
        alert(`Thank you for your purchase of ${quantity} item(s)!`);
    });
});