// NextGen Telco - API Client

const API_BASE_URL = 'http://localhost:8080/api';

// Utility function to make API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
}

// Plans API
async function getPlans() {
    return apiCall('/plans');
}

async function getPlanById(id) {
    return apiCall(`/plans/${id}`);
}

// Devices API
async function getDevices() {
    return apiCall('/devices');
}

async function getDeviceById(id) {
    return apiCall(`/devices/${id}`);
}

async function searchDevices(query) {
    return apiCall(`/devices/search?q=${query}`);
}

// Orders API
async function getOrders() {
    return apiCall('/orders');
}

async function createOrder(orderData) {
    return apiCall('/orders', 'POST', orderData);
}

async function getOrderById(id) {
    return apiCall(`/orders/${id}`);
}

// Users API
async function registerUser(userData) {
    return apiCall('/users/register', 'POST', userData);
}

async function loginUser(credentials) {
    return apiCall('/users/login', 'POST', credentials);
}

async function getUserProfile() {
    return apiCall('/users/profile', 'GET');
}

async function updateUserProfile(userData) {
    return apiCall('/users/profile', 'POST', userData);
}

// Cart API
async function addToCart(item) {
    return apiCall('/cart/add', 'POST', item);
}

async function removeFromCart(itemId) {
    return apiCall(`/cart/remove/${itemId}`, 'DELETE');
}

async function getCart() {
    return apiCall('/cart');
}

async function clearCart() {
    return apiCall('/cart/clear', 'DELETE');
}

// Payment API
async function processPayment(paymentData) {
    return apiCall('/payments', 'POST', paymentData);
}

// Local storage utilities for client-side cart
const Cart = {
    getCart: function() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },
    
    addItem: function(item) {
        const cart = this.getCart();
        const existingItem = cart.find(i => i.id === item.id && i.type === item.type);
        
        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            cart.push({...item, quantity: item.quantity || 1});
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        this.notifyUpdate();
    },
    
    removeItem: function(itemId) {
        const cart = this.getCart();
        const filtered = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(filtered));
        this.notifyUpdate();
    },
    
    updateQuantity: function(itemId, quantity) {
        const cart = this.getCart();
        const item = cart.find(i => i.id === itemId);
        if (item) {
            item.quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            this.notifyUpdate();
        }
    },
    
    clear: function() {
        localStorage.removeItem('cart');
        this.notifyUpdate();
    },
    
    getTotal: function() {
        return this.getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    getCount: function() {
        return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
    },
    
    notifyUpdate: function() {
        // Dispatch custom event for cart updates
        window.dispatchEvent(new Event('cartUpdated'));
    }
};

// Export utilities
export { apiCall, Cart, getPlans, getPlanById, getDevices, getDeviceById, createOrder, registerUser, loginUser, processPayment };
