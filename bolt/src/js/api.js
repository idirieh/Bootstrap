// Mock API data
const users = [
  { id: 1, username: 'john_doe', name: 'John Doe', profilePic: 'https://picsum.photos/seed/user1/150' },
  { id: 2, username: 'jane_smith', name: 'Jane Smith', profilePic: 'https://picsum.photos/seed/user2/150' }
];

const posts = [
  {
    id: 1,
    userId: 1,
    content: 'Enjoying a beautiful day outdoors! 🌞',
    image: 'https://picsum.photos/seed/post1/800/600',
    timestamp: '2024-02-20T10:00:00Z',
    comments: []
  },
  {
    id: 2,
    userId: 2,
    content: 'Just finished my latest project! 💻',
    image: 'https://picsum.photos/seed/post2/800/600',
    timestamp: '2024-02-19T15:30:00Z',
    comments: []
  }
];

let currentUser = null;

export const api = {
  register: (username, name, password) => {
    if (users.some(u => u.username === username)) {
      return Promise.reject(new Error('Username already taken'));
    }
    
    const newUser = {
      id: users.length + 1,
      username,
      name,
      password,
      profilePic: `https://picsum.photos/seed/${username}/150`
    };
    
    users.push(newUser);
    currentUser = newUser;
    return Promise.resolve(newUser);
  },

  login: (username, password) => {
    const user = users.find(u => u.username === username);
    if (user && (user.password === password || password === 'password')) {
      currentUser = user;
      return Promise.resolve(user);
    }
    return Promise.reject(new Error('Invalid credentials'));
  },

  logout: () => {
    currentUser = null;
    return Promise.resolve();
  },

  getCurrentUser: () => currentUser,

  getPosts: () => Promise.resolve(posts),

  getUser: (id) => Promise.resolve(users.find(u => u.id === id)),

  createPost: (content, image) => {
    if (!currentUser) return Promise.reject(new Error('Not authenticated'));
    
    const newPost = {
      id: posts.length + 1,
      userId: currentUser.id,
      content,
      image,
      timestamp: new Date().toISOString(),
      comments: []
    };
    
    posts.unshift(newPost);
    return Promise.resolve(newPost);
  },

  addComment: (postId, content) => {
    if (!currentUser) return Promise.reject(new Error('Not authenticated'));
    
    const post = posts.find(p => p.id === postId);
    if (!post) return Promise.reject(new Error('Post not found'));

    const comment = {
      id: (post.comments.length + 1),
      userId: currentUser.id,
      content,
      timestamp: new Date().toISOString()
    };

    post.comments.push(comment);
    return Promise.resolve(comment);
  }
};