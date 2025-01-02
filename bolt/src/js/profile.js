import { api } from './api.js';

export class Profile {
  constructor(container, userId) {
    this.container = container;
    this.userId = userId;
    this.loadProfile();
  }

  async loadProfile() {
    try {
      const user = await api.getUser(this.userId);
      const posts = (await api.getPosts()).filter(post => post.userId === this.userId);

      this.container.innerHTML = `
        <div class="profile-header text-center mb-4">
          <img src="${user.profilePic}" alt="${user.name}" class="profile-picture-large mb-3">
          <h2>${user.name}</h2>
          <p class="text-muted">@${user.username}</p>
        </div>
        
        <h3 class="mb-4">Posts</h3>
        <div class="posts-container">
          ${posts.map(post => `
            <div class="post-card card mb-4">
              <div class="card-body">
                ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image card-img mb-3">` : ''}
                <p class="card-text">${post.content}</p>
                <small class="text-muted">${new Date(post.timestamp).toLocaleString()}</small>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } catch (error) {
      console.error('Failed to load profile:', error);
      this.container.innerHTML = '<div class="alert alert-danger">Failed to load profile</div>';
    }
  }
}