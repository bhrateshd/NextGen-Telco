// NextGen Telco - Main JavaScript

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Handle form submissions
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.btn-primary');
    addToCartButtons.forEach(button => {
        if (button.textContent === 'Add to Cart' || button.textContent === 'Choose Plan') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const itemName = this.closest('.plan-card, .device-item').querySelector('h3').textContent;
                const price = this.closest('.plan-card, .device-item').querySelector('.price').textContent;
                showNotification(`${itemName} added to cart!`);
            });
        }
    });

    // Sidebar menu navigation
    const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            menuItems.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Filter functionality for devices
    const brandFilter = document.getElementById('brand-filter');
    const priceFilter = document.getElementById('price-filter');
    const typeFilter = document.getElementById('type-filter');

    if (brandFilter || priceFilter || typeFilter) {
        [brandFilter, priceFilter, typeFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', filterDevices);
            }
        });
    }

    // Cart quantity updates
    const quantityInputs = document.querySelectorAll('.item-quantity input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', updateCartTotal);
    });

    // Remove from cart buttons
    const removeButtons = document.querySelectorAll('.btn-remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.cart-item').remove();
            updateCartTotal();
            showNotification('Item removed from cart');
        });
    });
});

// Login handler
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Client-side validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Simulate login (in real app, this would call API)
    localStorage.setItem('user', JSON.stringify({ email: email }));
    showNotification('Login successful!');
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// Register handler
function handleRegister(e) {
    e.preventDefault();
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (password.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return;
    }

    // Simulate registration
    localStorage.setItem('user', JSON.stringify({ 
        email: email, 
        firstName: firstName, 
        lastName: lastName,
        phone: phone 
    }));
    
    showNotification('Account created successfully!');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// Checkout handler
function handleCheckout(e) {
    e.preventDefault();
    
    const billFirst = document.getElementById('bill-first').value;
    const billLast = document.getElementById('bill-last').value;
    const billEmail = document.getElementById('bill-email').value;
    const billPhone = document.getElementById('bill-phone').value;
    const billAddress = document.getElementById('bill-address').value;
    const billCity = document.getElementById('bill-city').value;
    const billState = document.getElementById('bill-state').value;
    const billZip = document.getElementById('bill-zip').value;

    if (!billFirst || !billLast || !billEmail || !billPhone || !billAddress || !billCity || !billState || !billZip) {
        showNotification('Please fill in all billing information', 'error');
        return;
    }

    // Simulate payment processing
    showNotification('Processing payment...');
    
    setTimeout(() => {
        showNotification('Order placed successfully!');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 2000);
}

// Contact form handler
function handleContactForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;

    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    showNotification('Message sent successfully! We\'ll get back to you soon.');
    e.target.reset();
}

// Filter devices
function filterDevices() {
    const brandFilter = document.getElementById('brand-filter')?.value || '';
    const priceFilter = document.getElementById('price-filter')?.value || '';
    const typeFilter = document.getElementById('type-filter')?.value || '';

    const deviceItems = document.querySelectorAll('.device-item');
    
    let visibleCount = 0;
    deviceItems.forEach(item => {
        let visible = true;

        if (brandFilter) {
            const brand = item.querySelector('.brand').textContent.toLowerCase();
            visible = visible && brand.includes(brandFilter.toLowerCase());
        }

        if (visible) {
            item.style.display = 'block';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    if (visibleCount === 0) {
        showNotification('No devices match your filters', 'info');
    }
}

// Update cart total
function updateCartTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;

    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('.item-info p').textContent.replace('$', ''));
        const quantity = parseInt(item.querySelector('.item-quantity input').value);
        const itemTotal = price * quantity;
        item.querySelector('.item-total').textContent = '$' + itemTotal.toFixed(2);
        subtotal += itemTotal;
    });

    // Update summary
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const summaryRows = document.querySelectorAll('.summary-row');
    if (summaryRows.length > 0) {
        summaryRows[0].querySelector('span:last-child').textContent = '$' + subtotal.toFixed(2);
        summaryRows[2].querySelector('span:last-child').textContent = '$' + tax.toFixed(2);
        document.getElementById('grand-total').textContent = '$' + total.toFixed(2);
    }
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'error' ? '#dc3545' : type === 'info' ? '#0066cc' : '#28a745'};
        color: white;
        border-radius: 4px;
        z-index: 10000;
        animation: slideIn 0.3s ease-in;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .hamburger {
        display: none;
        flex-direction: column;
        cursor: pointer;
    }

    .hamburger span {
        width: 25px;
        height: 3px;
        background: var(--text-color);
        margin: 5px 0;
        transition: 0.3s;
    }

    @media (max-width: 768px) {
        .hamburger {
            display: flex;
        }

        .nav-menu {
            display: none !important;
        }

        .nav-menu.active {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-bottom: 1px solid var(--border-color);
        }
    }
`;
document.head.appendChild(style);

// Check if user is logged in
function checkUserLogin() {
    const user = localStorage.getItem('user');
    if (!user && window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'login.html';
    }
}

// Initialize
checkUserLogin();
