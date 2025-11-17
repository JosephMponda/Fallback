# API Usage Examples

Complete examples for integrating the backend API with your frontend.

## Setup

### Install Axios (Frontend)

```bash
npm install axios
```

### Create API Client

```javascript
// src/api/client.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## Authentication

### Register User

```javascript
// src/api/auth.js
import apiClient from './client';

export const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', {
      email: userData.email,
      password: userData.password,
      name: userData.name,
    });
    
    // Save token
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

### Login

```javascript
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

### Get Profile

```javascript
export const getProfile = async () => {
  try {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

### Logout

```javascript
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};
```

## Services

### Get All Services

```javascript
// src/api/services.js
import apiClient from './client';

export const getServices = async (activeOnly = true) => {
  try {
    const response = await apiClient.get('/services', {
      params: { active: activeOnly },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

### Get Service by ID

```javascript
export const getServiceById = async (serviceId) => {
  try {
    const response = await apiClient.get(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

### Create Service (Admin)

```javascript
export const createService = async (serviceData) => {
  try {
    const response = await apiClient.post('/services', serviceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

## Gallery

### Get Gallery Items

```javascript
// src/api/gallery.js
import apiClient from './client';

export const getGalleryItems = async (filters = {}) => {
  try {
    const response = await apiClient.get('/gallery', {
      params: filters, // { featured: true, category: 'nature' }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

## Orders

### Create Order

```javascript
// src/api/orders.js
import apiClient from './client';

export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/orders', {
      serviceId: orderData.serviceId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      address: orderData.address,
      quantity: orderData.quantity,
      specialRequests: orderData.specialRequests,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

### Get User Orders

```javascript
export const getMyOrders = async () => {
  try {
    const response = await apiClient.get('/orders');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

### Create Payment Intent

```javascript
export const createPaymentIntent = async (orderId) => {
  try {
    const response = await apiClient.post('/orders/payment-intent', {
      orderId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

## Quotes

### Submit Quote Request

```javascript
// src/api/quotes.js
import apiClient from './client';

export const submitQuote = async (quoteData) => {
  try {
    const response = await apiClient.post('/quotes', {
      customerName: quoteData.customerName,
      customerEmail: quoteData.customerEmail,
      customerPhone: quoteData.customerPhone,
      serviceType: quoteData.serviceType,
      description: quoteData.description,
      budget: quoteData.budget,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

### Get User Quotes

```javascript
export const getMyQuotes = async () => {
  try {
    const response = await apiClient.get('/quotes');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

## Contact

### Send Contact Message

```javascript
// src/api/contact.js
import apiClient from './client';

export const sendContactMessage = async (contactData) => {
  try {
    const response = await apiClient.post('/contact', {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      subject: contactData.subject,
      message: contactData.message,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

## React Component Examples

### Login Form

```jsx
// src/pages/Login.jsx
import React, { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}

export default Login;
```

### Order Form

```jsx
// src/pages/Order.jsx
import React, { useState, useEffect } from 'react';
import { getServices } from '../api/services';
import { createOrder } from '../api/orders';

function Order() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    quantity: 1,
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await getServices();
      setServices(response.data.services);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createOrder(formData);
      setSuccess(true);
      // Reset form
      setFormData({
        serviceId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        address: '',
        quantity: 1,
        specialRequests: '',
      });
    } catch (error) {
      alert(error.message || 'Error creating order');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div>
        <h2>Order Submitted Successfully!</h2>
        <p>We've sent a confirmation email. We'll contact you soon.</p>
        <button onClick={() => setSuccess(false)}>Place Another Order</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Place an Order</h2>
      
      <select
        value={formData.serviceId}
        onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
        required
      >
        <option value="">Select a service</option>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name} - ${service.price}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Your Name"
        value={formData.customerName}
        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={formData.customerEmail}
        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
        required
      />

      <input
        type="tel"
        placeholder="Phone (optional)"
        value={formData.customerPhone}
        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
      />

      <input
        type="number"
        min="1"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
        required
      />

      <textarea
        placeholder="Delivery Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />

      <textarea
        placeholder="Special Requests (optional)"
        value={formData.specialRequests}
        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Place Order'}
      </button>
    </form>
  );
}

export default Order;
```

### Contact Form

```jsx
// src/pages/Contact.jsx
import React, { useState } from 'react';
import { sendContactMessage } from '../api/contact';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendContactMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      alert(error.message || 'Error sending message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Contact Us</h2>
      {success && <p className="success">Message sent! We'll get back to you soon.</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Phone (optional)"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Subject (optional)"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        />
        <textarea
          placeholder="Message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows="5"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}

export default Contact;
```

## Stripe Payment Integration

### Install Stripe

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### Payment Component

```jsx
// src/components/PaymentForm.jsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent } from '../api/orders';

const stripePromise = loadStripe('pk_test_your_publishable_key');

function CheckoutForm({ orderId, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create payment intent
    createPaymentIntent(orderId)
      .then((response) => {
        setClientSecret(response.data.clientSecret);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setSucceeded(true);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Pay ${amount.toFixed(2)}</h3>
      <CardElement />
      {error && <div className="error">{error}</div>}
      <button disabled={!stripe || processing || succeeded}>
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
      {succeeded && <p className="success">Payment succeeded!</p>}
    </form>
  );
}

function Payment({ orderId, amount }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm orderId={orderId} amount={amount} />
    </Elements>
  );
}

export default Payment;
```

## Environment Variables (Frontend)

Create `.env` file in frontend:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_publishable_key
```

## Error Handling

```javascript
// src/utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};
```

## Complete API Service

```javascript
// src/api/index.js
import apiClient from './client';

const api = {
  // Auth
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/profile'),
  
  // Services
  getServices: (params) => apiClient.get('/services', { params }),
  getService: (id) => apiClient.get(`/services/${id}`),
  
  // Gallery
  getGallery: (params) => apiClient.get('/gallery', { params }),
  
  // Orders
  createOrder: (data) => apiClient.post('/orders', data),
  getOrders: () => apiClient.get('/orders'),
  getOrder: (id) => apiClient.get(`/orders/${id}`),
  createPaymentIntent: (orderId) => apiClient.post('/orders/payment-intent', { orderId }),
  
  // Quotes
  submitQuote: (data) => apiClient.post('/quotes', data),
  getQuotes: () => apiClient.get('/quotes'),
  
  // Contact
  sendMessage: (data) => apiClient.post('/contact', data),
};

export default api;
```

## Usage in Components

```javascript
import api from '../api';

// In your component
const handleLogin = async () => {
  try {
    const response = await api.login({ email, password });
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```
