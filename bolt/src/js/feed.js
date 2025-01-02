import { api } from './api.js';
import { Comments } from './comments.js';

export class Feed {
  constructor(container) {
    this.container = container;
    this.setupNewPostForm();
    this.loadPosts();
    
    window.addEventListener('auth-changed', () => {
      this.setupNewPostForm();
      this.loadPosts();
    });
  }

  setupNewPostForm() {
    const user = api.getCurrentUser();
    const formHTML = user ? `
      <div class="card mb-4">
        <div class="card-body">
          <form id="newPostForm">
            <div class="mb-3">
              <textarea class="form-control" id="postContent" rows="3" placeholder="What's on your mind?"></textarea>
            </div>
            <div class="mb-3">
              <input type="url" class="form-control" id="postImage" placeholder="Image URL">
            </div>
            <button type="submit" class="btn btn-primary">Post</button>
          </form>
        </div>
      </div>
    ` : '';

    const feedHeader = document.getElementById('feedHeader');
    if (feedHeader) {
      feedHeader.innerHTML = formHTML;
    } else {
      this.container.insertAdjacentHTML('beforebegin', `<div id="feedHeader">${formHTML}</div>`);
    }

    const form = document.getElementById('newPostForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handleNewPost(e));
    }
  }

  async handleNewPost(e) {
    e.preventDefault();
    const content = document.getElementById('postContent').value;
    const image = document.getElementById('postImage').value;

    try {
      await api.createPost(content, image);
      document.getElementById('postContent').value = '';
      document.getElementById('postImage').value = '';
      this.loadPosts();
    } catch (error) {
      alert('Failed to create post: ' + error.message);
    }
  }

  async loadPosts() {
    try {
      const posts = await api.getPosts();
      let html = '';

      for (const post of posts) {
        const user = await api.getUser(post.userId);
        html += `
          <div class="post-card card mb-4">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <img src="${user.profilePic}" alt="${user.name}" class="profile-picture me-2">
                <a href="/profile/${user.id}" class="text-decoration-none text-dark">
                  <h6 class="mb-0">${user.name}</h6>
                </a>
              </div>
              ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image card-img mb-3">` : ''}
              <p class="card-text">${post.content}</p>
              <small class="text-muted">${new Date(post.timestamp).toLocaleString()}</small>
              <div class="comments-container-${post.id}"></div>
            </div>
          </div>
        `;
      }

      this.container.innerHTML = html;

      // Initialize comments for each post
      for (const post of posts) {
        new Comments(post.id, this.container.querySelector(`.comments-container-${post.id}`));
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
      this.container.innerHTML = '<div class="alert alert-danger">Failed to load posts</div>';
    }
  }
}