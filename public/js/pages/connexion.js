document.getElementById('connexionForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Retrieve form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Display form data in the console
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Remember me:', remember);
});