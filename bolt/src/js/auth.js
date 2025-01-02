import { api } from './api.js';

export class Auth {
  constructor() {
    this.loginBtn = document.getElementById('loginBtn');
    this.registerBtn = document.getElementById('registerBtn');
    this.loginForm = document.getElementById('loginForm');
    this.registerForm = document.getElementById('registerForm');
    this.setupEventListeners();
    this.checkAuthState();
  }

  setupEventListeners() {
    this.loginBtn.addEventListener('click', () => {
      if (api.getCurrentUser()) {
        this.logout();
      } else {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('loginModal')).show();
      }
    });

    this.registerBtn.addEventListener('click', () => {
      bootstrap.Modal.getOrCreateInstance(document.getElementById('registerModal')).show();
    });

    this.loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.login();
    });

    this.registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.register();
    });
  }

  async login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      await api.login(username, password);
      bootstrap.Modal.getOrCreateInstance(document.getElementById('loginModal')).hide();
      this.updateAuthState();
      window.dispatchEvent(new CustomEvent('auth-changed'));
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  }

  async register() {
    const username = document.getElementById('regUsername').value;
    const name = document.getElementById('regName').value;
    const password = document.getElementById('regPassword').value;

    try {
      await api.register(username, name, password);
      bootstrap.Modal.getOrCreateInstance(document.getElementById('registerModal')).hide();
      this.updateAuthState();
      window.dispatchEvent(new CustomEvent('auth-changed'));
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  }

  async logout() {
    await api.logout();
    this.updateAuthState();
    window.dispatchEvent(new CustomEvent('auth-changed'));
  }

  updateAuthState() {
    const user = api.getCurrentUser();
    this.loginBtn.textContent = user ? 'Logout' : 'Login';
    this.registerBtn.style.display = user ? 'none' : 'block';
  }

  checkAuthState() {
    this.updateAuthState();
  }
}