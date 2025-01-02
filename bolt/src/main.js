import { Auth } from './js/auth.js';
import { Feed } from './js/feed.js';
import { Profile } from './js/profile.js';

// Initialize Bootstrap
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

// Initialize the app
const mainContent = document.getElementById('mainContent');
const auth = new Auth();

// Simple router
function handleRoute() {
  const path = window.location.pathname;
  const profileMatch = path.match(/^\/profile\/(\d+)$/);

  if (profileMatch) {
    new Profile(mainContent, parseInt(profileMatch[1]));
  } else {
    new Feed(mainContent);
  }
}

// Handle navigation
window.addEventListener('popstate', handleRoute);
handleRoute();

// Handle profile links
document.addEventListener('click', (e) => {
  if (e.target.matches('a[href^="/profile/"]')) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    window.history.pushState({}, '', href);
    handleRoute();
  }
});