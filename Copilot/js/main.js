document.addEventListener('DOMContentLoaded', () => {
    fetch('mock-api/posts.json')
        .then(response => response.json())
        .then(posts => {
            const postFeed = document.getElementById('post-feed');
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('col-md-6', 'post');
                postElement.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">
                                <img src="${post.profilePicture}" alt="Profile Picture" class="rounded-circle" width="30">
                                <a href="profile.html?user=${post.userId}">${post.userName}</a>
                            </h5>
                            <p class="card-text">${post.content}</p>
                            <img src="${post.image}" alt="Post Image">
                        </div>
                    </div>
                `;
                postFeed.appendChild(postElement);
            });
        });
});