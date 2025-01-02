import { api } from './api.js';

export class Comments {
  constructor(postId, container) {
    this.postId = postId;
    this.container = container;
    this.render();
  }

  async render() {
    const posts = await api.getPosts();
    const post = posts.find(p => p.id === this.postId);
    if (!post) return;

    let commentsHTML = '<div class="comments mt-3">';
    
    for (const comment of post.comments) {
      const user = await api.getUser(comment.userId);
      commentsHTML += `
        <div class="comment d-flex gap-2 mb-2">
          <img src="${user.profilePic}" alt="${user.name}" class="comment-avatar">
          <div class="comment-content">
            <div class="fw-bold">${user.name}</div>
            <div>${comment.content}</div>
            <small class="text-muted">${new Date(comment.timestamp).toLocaleString()}</small>
          </div>
        </div>
      `;
    }

    const user = api.getCurrentUser();
    if (user) {
      commentsHTML += `
        <form class="comment-form mt-3">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Write a comment..." required>
            <button type="submit" class="btn btn-primary">Post</button>
          </div>
        </form>
      `;
    }

    commentsHTML += '</div>';
    this.container.innerHTML = commentsHTML;

    if (user) {
      this.container.querySelector('form')?.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const content = input.value.trim();

    if (!content) return;

    try {
      await api.addComment(this.postId, content);
      input.value = '';
      this.render();
    } catch (error) {
      alert('Failed to add comment: ' + error.message);
    }
  }
}