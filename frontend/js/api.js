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

// Example API functions
async function getPlans() {
    return apiCall('/plans');
}

async function getDevices() {
    return apiCall('/devices');
}

async function getOrders() {
    return apiCall('/orders');
}

export { apiCall, getPlans, getDevices, getOrders };
