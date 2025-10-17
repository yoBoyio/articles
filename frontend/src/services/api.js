import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });


    this.client.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        console.error('API request failed:', error);
        if (error.response) {
          const message = error.response.data?.message || `http error, status: ${error.response.status}`;
          throw new Error(message);
        } else if (error.request) {
          throw new Error('Network error: No response from server');
        } else {
          throw new Error(error.message || 'An unexpected error occurred');
        }
      }
    );
  }

  async request(endpoint, options = {}) {
    try {
      const response = await this.client.request({
        url: endpoint,
        ...options,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(userData) {
    return this.request('/register', {
      method: 'POST',
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.confirmPassword,
      },
    });
  }

  async login(credentials) {
    return this.request('/login', {
      method: 'POST',
      data: {
        email: credentials.email,
        password: credentials.password,
      },
    });
  }

  async logout(token) {
    return this.request('/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getUserProfile(token) {
    return this.request('/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getArticles() {
    return this.request('/articles', {
      method: 'GET',
    });
  }

  async getArticle(id, token) {
    return this.request(`/articles/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async createArticle(articleData, token) {
    return this.request('/articles', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      data: articleData,
    });
  }

  async updateArticle(id, articleData, token) {
    return this.request(`/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      data: articleData,
    });
  }

  async deleteArticle(id, token) {
    return this.request(`/articles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

export default new ApiService();