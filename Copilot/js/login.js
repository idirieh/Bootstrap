document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Mock API login request
    fetch('mock-api/users.json')
        .then(response => response.json())
        .then(users => {
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                sessionStorage.setItem('user', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                alert('Invalid login credentials');
            }
        });
});