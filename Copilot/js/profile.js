document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('user');

    fetch('mock-api/users.json')
        .then(response => response.json())
        .then(users => {
            const user = users.find(u => u.id == userId);
            const profileInfo = document.getElementById('profile-info');
            profileInfo.innerHTML = `
                <div class="col-md-4 profile-picture">
                    <img src="${user.profilePicture}" alt="Profile Picture" width="150">
                </div>
                <div class="col-md-8">
                    <h2>${user.name}</h2>
                    <p>${user.bio}</p>
                </div>
            `;
        });
});