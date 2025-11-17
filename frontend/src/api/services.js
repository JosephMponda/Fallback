import apiClient from './client';

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  }
};

// Services API
export const servicesAPI = {
  getAll: async (activeOnly = true) => {
    const response = await apiClient.get('/services', {
      params: { active: activeOnly }
    });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/services/${id}`);
    return response.data;
  }
};

// Gallery API
export const galleryAPI = {
  getAll: async (filters = {}) => {
    const response = await apiClient.get('/gallery', { params: filters });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/gallery/${id}`);
    return response.data;
  }
};

// Orders API
export const ordersAPI = {
  create: async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },
  
  getAll: async () => {
    const response = await apiClient.get('/orders');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },
  
  createPaymentIntent: async (orderId) => {
    const response = await apiClient.post('/orders/payment-intent', { orderId });
    return response.data;
  }
};

// Quotes API
export const quotesAPI = {
  create: async (quoteData) => {
    const response = await apiClient.post('/quotes', quoteData);
    return response.data;
  },
  
  getAll: async () => {
    const response = await apiClient.get('/quotes');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/quotes/${id}`);
    return response.data;
  }
};

// Contact API
export const contactAPI = {
  sendMessage: async (contactData) => {
    const response = await apiClient.post('/contact', contactData);
    return response.data;
  }
};
