/**
 * Main Application Script
 * 
 * This script handles the UI interactions and application logic.
 * It uses the database module (db.js) for data operations.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait for pages to be initialized
    if (!window.Pages) {
        console.error('Pages system not initialized');
        return;
    }
    // DOM Elements - Static elements that exist in index.html
    const mainContent = document.getElementById('main-content');
    const cartCount = document.querySelector('.cart-count');
    const footerCartCount = document.querySelector('.footer-cart-count');
    const notification = document.getElementById('notification');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    // Navigation links - these are static and can be queried once
    const homeLinks = document.querySelectorAll('.home-link');
    const productsLinks = document.querySelectorAll('.products-link');
    // Navigation links
    const supportLinks = document.querySelectorAll('.support-link');
    const cartLinks = document.querySelectorAll('.cart-link');
    // We'll use event delegation instead of directly querying close buttons
    // const closeModalButtons = document.querySelectorAll('.close-modal');

    // Initialize the app
    init();

    // Helper function to get card limit based on price
    function getCardLimit(price) {
        if (price === 25) return 1000;
        if (price === 35) return 2000;
        if (price === 50) return 3500;
        if (price === 100) return 4500;
        return 1000; // default
    }

    // Render products to the grid
    async function renderProducts() {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) {
            console.error('Products grid not found');
            return;
        }
        
        // Show loading state
        productsGrid.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Loading cards...</div>';
        
        try {
            const products = await db.getProducts();
            productsGrid.innerHTML = '';
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                
                // Determine card type based on title
                let cardType = '';
                if (product.title.toLowerCase().includes('visa gold')) {
                    cardType = 'visa-gold-card';
                } else if (product.title.toLowerCase().includes('gold')) {
                    cardType = 'gold-card';
                } else if (product.title.toLowerCase().includes('black')) {
                    cardType = 'black-card';
                } else if (product.title.toLowerCase().includes('platinum')) {
                    cardType = 'platinum-card';
                } else if (product.title.toLowerCase().includes('diamond')) {
                    cardType = 'diamond-card';
                } else if (product.title.toLowerCase().includes('infinite')) {
                    cardType = 'infinite-card';
                } else if (product.title.toLowerCase().includes('world')) {
                    cardType = 'world-card';
                } else if (product.title.toLowerCase().includes('american express')) {
                    cardType = 'american-express-card';
                } else if (product.title.toLowerCase().includes('discover')) {
                    cardType = 'discover-card';
                }
                
                productCard.className = `product-card ${cardType}`;
                
                const cardLimit = getCardLimit(product.price);

                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.title}" />
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.title}</h3>
                        <p class="product-number">**** **** **** ****</p>
                        <p class="product-price">$${product.price.toFixed(2)}</p>
                        <p class="product-limit">Limit: $${cardLimit.toLocaleString()}</p>
                        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                `;
                productsGrid.appendChild(productCard);
            });
        } catch (error) {
            console.error('Error rendering products:', error);
            productsGrid.innerHTML = '<div class="error-state"><i class="fas fa-exclamation-triangle"></i> Failed to load cards. Please try again later.</div>';
        }
    }

    // Update cart count in navbar and footer
    function updateCartCount() {
        const count = db.getCartCount();
        cartCount.textContent = count;
        footerCartCount.textContent = count;
    }

    // Render cart items
    async function renderCart() {
        const cartItems = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');
        
        if (!cartItems || !cartSummary) {
            console.error('Cart elements not found');
            return;
        }
        
        const cart = db.getCart();
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart-message">
                    <p>Your cart is empty. Browse our <a href="#" class="products-link">premium cards</a> to get started.</p>
                </div>
            `;
            cartSummary.style.display = 'none';
            return;
        }

        cartItems.innerHTML = '';
        let subtotal = await db.getCartSubtotal();
        const products = await db.getProducts();

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            
            if (!product) {
                console.error('Product not found for cart item:', item);
                return; // Skip this item if product not found
            }
            
            // Determine card type based on title
            let cardType = '';
            if (product.title.toLowerCase().includes('visa gold')) {
                cardType = 'visa-gold-card';
            } else if (product.title.toLowerCase().includes('gold')) {
                cardType = 'gold-card';
            } else if (product.title.toLowerCase().includes('black')) {
                cardType = 'black-card';
            } else if (product.title.toLowerCase().includes('platinum')) {
                cardType = 'platinum-card';
            } else if (product.title.toLowerCase().includes('diamond')) {
                cardType = 'diamond-card';
            } else if (product.title.toLowerCase().includes('infinite')) {
                cardType = 'infinite-card';
            } else if (product.title.toLowerCase().includes('world')) {
                cardType = 'world-card';
            } else if (product.title.toLowerCase().includes('american express')) {
                cardType = 'american-express-card';
            } else if (product.title.toLowerCase().includes('discover')) {
                cardType = 'discover-card';
            }
            
            const cartItem = document.createElement('div');
            cartItem.className = `cart-item ${cardType}-cart-item`;

            const cardLimit = getCardLimit(product.price);

            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${product.image}" alt="${product.title}" />
                </div>
                <div class="cart-item-details">
                    <h3>${product.title}</h3>
                    <p class="cart-item-number">**** **** **** ****</p>
                    <p class="cart-item-limit">Limit: $${cardLimit.toLocaleString()}</p>
                    <p class="cart-item-quantity">Quantity: ${item.quantity}</p>
                </div>
                <div class="cart-item-price">$${(product.price * item.quantity).toFixed(2)}</div>
                <button class="remove-item" data-id="${product.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });

        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTotal = document.getElementById('cart-total');
        const paymentAmount = document.getElementById('payment-amount');
        
        const serviceFee = 1; // $1 service fee
        const totalAmount = subtotal + serviceFee;
        
        if (cartSubtotal) cartSubtotal.textContent = `${db.formatPrice(subtotal)}`;
        if (cartTotal) cartTotal.textContent = `${db.formatPrice(totalAmount)}`;
        if (paymentAmount) paymentAmount.textContent = `${db.formatPrice(totalAmount)}`;
        
        cartSummary.style.display = 'block';
    }

    // Add to cart
    function addToCart(productId) {
        db.addToCart(productId);
        updateCartCount();
        showNotification('Item added to cart', 'success');
    }
    
    // Clear cart function for debugging
    function clearCart() {
        db.clearCart();
        updateCartCount();
        showNotification('Cart cleared', 'success');
        if (document.getElementById('cart-items')) {
            renderCart();
        }
    }
    
    // Debug cart function
    function debugCart() {
        const cart = db.getCart();
        const count = db.getCartCount();
        console.log('=== CART DEBUG ===');
        console.log('Cart contents:', cart);
        console.log('Cart count:', count);
        console.log('Raw localStorage cart:', localStorage.getItem('cart'));
        console.log('==================');
        return { cart, count, raw: localStorage.getItem('cart') };
    }
    
    // Force clear cart and localStorage
    function forceResetCart() {
        localStorage.removeItem('cart');
        localStorage.setItem('cart', JSON.stringify([]));
        updateCartCount();
        showNotification('Cart force reset complete', 'success');
        if (document.getElementById('cart-items')) {
            renderCart();
        }
        console.log('Cart force reset - new cart:', localStorage.getItem('cart'));
    }
    
    // Complete localStorage reset function
    function resetAllData() {
        // Clear all localStorage data
        localStorage.clear();
        
        // Reinitialize database
        db.initializeData();
        
        // Update cart count
        updateCartCount();
        
        // Update auth state
        checkAuthState();
        
        showNotification('All data reset successfully', 'success');
        console.log('Complete data reset performed');
        
        // Re-render current page if needed
        if (document.getElementById('cart-items')) {
            renderCart();
        }
    }
    
    // Make debugging functions available globally
    window.clearCart = clearCart;
    window.debugCart = debugCart;
    window.forceResetCart = forceResetCart;
    window.resetAllData = resetAllData;
    
    // PocketBase debugging functions
    window.testPocketBase = async function() {
        console.log('🔍 Running PocketBase connection test...');
        const results = await db.testPocketBaseConnection();
        console.log('📊 Test Results:', results);
        return results;
    };
    
    window.testPaymentSubmission = async function() {
        console.log('🧪 Running test payment submission...');
        try {
            const result = await db.testPaymentSubmission();
            console.log('✅ Test payment submission successful:', result);
            return result;
        } catch (error) {
            console.error('❌ Test payment submission failed:', error);
            return { error: error.message };
        }
    };
    
    window.debugPocketBase = function() {
        console.log('🔍 PocketBase Debug Info:');
        console.log('URL:', db.pb.baseUrl);
        console.log('HTTPS Context:', db.isHttpsContext);
        console.log('Auth Token:', db.pb.authStore.token ? 'Present' : 'None');
        console.log('Auth Model:', db.pb.authStore.model);
        return {
            url: db.pb.baseUrl,
            httpsContext: db.isHttpsContext,
            hasAuthToken: !!db.pb.authStore.token,
            authModel: db.pb.authStore.model
        };
    };
    
    // Exchange rate debugging functions
    window.getCurrentExchangeRate = function() {
        const rate = db.getCurrentExchangeRate();
        console.log(`Current exchange rate: $1 = GHC ${rate}`);
        return rate;
    };
    
    window.fixExchangeRate = function() {
        const rate = db.fixExchangeRate();
        console.log(`Exchange rate fixed to: $1 = GHC ${rate}`);
        return rate;
    };
    
    window.updateExchangeRate = function(newRate) {
        if (!newRate || isNaN(newRate)) {
            console.error('Please provide a valid exchange rate number');
            return;
        }
        db.updateExchangeRate(newRate);
        console.log(`Exchange rate updated to: $1 = GHC ${newRate}`);
        return newRate;
    };

    // Remove from cart
    async function removeFromCart(productId) {
        db.removeFromCart(productId);
        updateCartCount();
        await renderCart();
        showNotification('Item removed from cart', 'success');
    }

    // Update payment amount in modal
    async function updatePaymentAmount() {
        const subtotal = await db.getCartSubtotal();
        const serviceFee = 1;
        const totalAmount = subtotal + serviceFee;
        
        const paymentAmount = document.getElementById('payment-amount');
        if (paymentAmount) {
            paymentAmount.textContent = `${db.formatPrice(totalAmount)}`;
        }
    }

    // Handle payment confirmation with mobile money form
    async function handlePaymentConfirmation() {
        const customerEmail = document.getElementById('customer-email');
        const paymentScreenshot = document.getElementById('payment-screenshot');

        // Validate required fields
        if (!customerEmail || !customerEmail.value.trim()) {
            showNotification('Please enter your email address', 'error');
            return;
        }

        if (!paymentScreenshot || !paymentScreenshot.files || paymentScreenshot.files.length === 0) {
            showNotification('Please upload a payment screenshot', 'error');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerEmail.value.trim())) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        try {
            // Show loading state
            const confirmBtn = document.getElementById('confirm-btn');
            const originalText = confirmBtn.textContent;
            confirmBtn.textContent = 'Processing...';
            confirmBtn.disabled = true;

            console.log('🚀 Starting mobile money payment submission process...');

            // Get cart data
            const cart = db.getCart();
            const products = await db.getProducts();
            const subtotal = await db.getCartSubtotal();
            const serviceFee = 1;
            const totalAmount = subtotal + serviceFee;

            console.log('📊 Payment details:', {
                customerEmail: customerEmail.value,
                totalAmount,
                cartItemCount: cart.length,
                hasScreenshot: !!paymentScreenshot.files[0]
            });

            // Prepare cart items for recording
            const cartItems = cart.map(item => {
                const product = products.find(p => p.id === item.id);
                return {
                    id: item.id,
                    title: product ? product.title : 'Unknown Product',
                    price: product ? product.price : 0,
                    quantity: item.quantity,
                    total: product ? product.price * item.quantity : 0
                };
            });

            // Prepare payment data
            const paymentData = {
                customerEmail: customerEmail.value.trim(),
                amount: totalAmount,
                currency: 'USD',
                cartItems: cartItems,
                paymentMethod: 'mobile_money',
                invoiceNumber: 'ML629C154.161.152.1278',
                paymentScreenshot: paymentScreenshot.files[0] // File object
            };

            // Record payment in PocketBase
            const paymentRecord = await db.recordPayment(paymentData);
            
            console.log('✅ Payment submission completed:', paymentRecord);

            // Skip email notification in frontend-only mode
            console.log('📧 Email notifications disabled in frontend-only mode');

            // Reset button state
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;

            // Show success message
            showNotification('Payment submitted successfully!', 'success');
            console.log('🎉 Payment recorded locally with ID:', paymentRecord.localId);

            // Hide payment modal and show success modal
            hideModal(document.getElementById('payment-modal'));
            setTimeout(() => {
                showModal(document.getElementById('success-modal'));
                // Clear cart after successful payment
                db.clearCart();
                updateCartCount();
            }, 500);

        } catch (error) {
            console.error('❌ Payment recording error:', error);

            // Reset button state
            const confirmBtn = document.getElementById('confirm-btn');
            confirmBtn.textContent = 'Confirm Payment';
            confirmBtn.disabled = false;

            // Show detailed error message
            let errorMessage = 'Payment submission failed. ';
            if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Please check your connection and try again.';
            }

            showNotification(errorMessage, 'error');
        }
    
        // Load and display recent orders
        async function loadRecentOrders(userEmail) {
            const recentOrdersContainer = document.getElementById('recent-orders');
            if (!recentOrdersContainer) return;
    
            try {
                const orders = await db.getRecentOrders(userEmail);
                
                if (orders.length === 0) {
                    recentOrdersContainer.innerHTML = `
                        <div class="no-orders">
                            <i class="fas fa-shopping-bag"></i>
                            <p>No recent orders</p>
                            <button class="browse-btn" id="dashboard-browse-btn">Browse Cards</button>
                        </div>
                    `;
                } else {
                    recentOrdersContainer.innerHTML = orders.map(order => `
                        <div class="order-item">
                            <div class="order-header">
                                <span class="order-id">Order #${order.id.substring(0, 8)}</span>
                                <span class="order-date">${order.date}</span>
                            </div>
                            <div class="order-details">
                                <div class="order-items">
                                    ${order.items.map(item => `
                                        <span class="item-name">${item.title} x${item.quantity}</span>
                                    `).join(', ')}
                                </div>
                                <div class="order-total">${order.total}</div>
                            </div>
                            <div class="order-status">
                                <span class="status status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                            </div>
                        </div>
                    `).join('');
                }
            } catch (error) {
                console.error('Error loading recent orders:', error);
                recentOrdersContainer.innerHTML = `
                    <div class="no-orders">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Failed to load orders</p>
                    </div>
                `;
            }
        }
    }

    // Show notification
    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Check auth state and update UI
    function checkAuthState() {
        const currentUser = db.getCurrentUser();

        if (currentUser) {
            // User is logged in
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';

            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) logoutBtn.style.display = 'block';

            const dashboardLinks = document.querySelectorAll('.dashboard-link');
            dashboardLinks.forEach(link => link.style.display = 'block');

            const usernameDisplay = document.getElementById('username-display');
            if (usernameDisplay) usernameDisplay.textContent = currentUser.name.split(' ')[0];

            const userEmail = document.getElementById('user-email');
            if (userEmail) userEmail.textContent = currentUser.email;
        } else {
            // User is logged out
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (registerBtn) registerBtn.style.display = 'inline-block';

            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) logoutBtn.style.display = 'none';

            const dashboardLinks = document.querySelectorAll('.dashboard-link');
            dashboardLinks.forEach(link => link.style.display = 'none');
        }
    }

    // Login user with local storage
    async function login(email, password) {
        console.log('🚪 Login function called with:', { email, hasPassword: !!password });

        // Basic validation
        if (!email || !password) {
            showNotification('Please enter both email and password', 'error');
            return;
        }

        // Disable login button to prevent multiple submissions
        const loginBtn = document.querySelector('#login-form .auth-btn');
        if (!loginBtn) {
            showNotification('UI Error: Please refresh the page and try again.', 'error');
            return;
        }

        const originalBtnText = loginBtn.textContent;
        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing In...';

        try {
            // Get stored users
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

            // Find user by email
            const user = users.find(u => u.email === email);

            if (!user) {
                showNotification('No account found with this email address', 'error');
                return;
            }

            if (user.password !== password) {
                showNotification('Incorrect password', 'error');
                return;
            }

            // Login successful
            console.log('✅ Login successful');

            // Store current user
            const userData = {
                uid: user.uid,
                email: user.email,
                name: user.name,
                provider: 'local'
            };
            db.setCurrentUser(userData);

            checkAuthState();
            hideModal(document.getElementById('auth-modal'));
            showNotification('Welcome back to ElitCards!', 'success');
            showSection('products-section');

        } catch (error) {
            console.error('Login error:', error);
            showNotification('Login failed. Please try again.', 'error');
        } finally {
            // Re-enable login button
            loginBtn.disabled = false;
            loginBtn.textContent = originalBtnText;
        }
    }

    // Register user with local storage
    async function register(name, email, password) {
        console.log('👤 Register function called with:', { name, email, hasPassword: !!password });

        // Basic validation
        if (!name || !email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Password validation
        if (password.length < 6) {
            showNotification('Password must be at least 6 characters long', 'error');
            return;
        }

        // Disable register button to prevent multiple submissions
        const registerBtn = document.querySelector('#register-form .auth-btn');
        if (!registerBtn) {
            showNotification('UI Error: Please refresh the page and try again.', 'error');
            return;
        }

        const originalBtnText = registerBtn.textContent;
        registerBtn.disabled = true;
        registerBtn.textContent = 'Creating Account...';

        try {
            // Get existing users
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

            // Check if email already exists
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                showNotification('An account with this email already exists', 'error');
                return;
            }

            // Create new user
            const newUser = {
                uid: 'user-' + Date.now(),
                name: name,
                email: email,
                password: password,
                createdAt: new Date().toISOString()
            };

            // Add to users array
            users.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(users));

            console.log('✅ Registration successful');

            // Auto-login the user
            const userData = {
                uid: newUser.uid,
                email: newUser.email,
                name: newUser.name,
                provider: 'local'
            };
            db.setCurrentUser(userData);

            checkAuthState();
            hideModal(document.getElementById('auth-modal'));
            showNotification('Account created successfully! Welcome to ElitCards!', 'success');

            // Immediately redirect to products section after successful registration
            showSection('products-section');

        } catch (error) {
            console.error('Registration error:', error);
            showNotification('Registration failed. Please try again.', 'error');
        } finally {
            // Re-enable register button
            registerBtn.disabled = false;
            registerBtn.textContent = originalBtnText;
        }
    }

    // Logout user
    async function logout() {
        // Clear user data
        db.setCurrentUser(null);

        checkAuthState();
        showNotification('Logged out successfully', 'success');
        showSection('home-section');
    }

    // Show modal
    function showModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            console.error('Modal element not found');
        }
    }

    // Hide modal
    function hideModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        } else {
            console.error('Modal element not found');
        }
    }

    // Show section using pages system
    async function showSection(sectionId) {
        let pageKey;
        
        switch(sectionId) {
            case 'home-section':
                pageKey = Pages.PAGES.HOME;
                break;
            case 'products-section':
                pageKey = Pages.PAGES.PRODUCTS;
                break;
            case 'dashboard-section':
                pageKey = Pages.PAGES.DASHBOARD;
                break;
            case 'cart-section':
                pageKey = Pages.PAGES.CART;
                break;
            default:
                pageKey = Pages.PAGES.HOME;
        }
        
        await Pages.load(pageKey);
        window.scrollTo(0, 0);
        
        // Re-initialize any dynamic content in the loaded component
        if (sectionId === 'products-section') {
            renderProducts();
        } else if (sectionId === 'cart-section') {
            await renderCart();
        } else if (sectionId === 'dashboard-section') {
            // Update dashboard content
            const currentUser = db.getCurrentUser();
            if (currentUser) {
                const usernameDisplay = document.getElementById('username-display');
                const userEmail = document.getElementById('user-email');
                
                if (usernameDisplay) usernameDisplay.textContent = currentUser.name.split(' ')[0];
                if (userEmail) userEmail.textContent = currentUser.email;
            }
        }
    }

    // Initialize the app
    function init() {
        updateCartCount();
        checkAuthState();
        setupEventListeners();

        // Initialize demo auth state - Frontend only mode
        console.log('👂 Setting up demo auth state...');
        checkAuthState();

        // Session management functions
        window.forceLogout = function() {
            db.setCurrentUser(null);
            localStorage.removeItem('currentUser');
            checkAuthState();
            showSection('home-section');
            showNotification('Session reset', 'success');
        };

        // Initial page is loaded by pages.js
    }

    // Setup event listeners
    // Set active navigation item
    function setActiveNavItem(linkClass) {
        // Remove active class from all navigation items
        document.querySelectorAll('.nav-links a, .footer-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to matching navigation items
        document.querySelectorAll(`.${linkClass}`).forEach(item => {
            item.classList.add('active');
        });
    }
    
    function setupEventListeners() {
        // Mobile menu functionality
        const navLinks = document.querySelector('.nav-links');
        const authButtons = document.querySelector('.auth-buttons');
        const overlay = document.querySelector('.overlay');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        
        // Function to close mobile menu
        function closeMobileMenu() {
            navLinks.classList.remove('active');
            authButtons.classList.remove('active');
            overlay.classList.remove('active');
        }
        
        // Close mobile menu when clicking the close button
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeMobileMenu();
            });
        }
        
        // Close mobile menu when clicking the overlay
        if (overlay) {
            overlay.addEventListener('click', function() {
                closeMobileMenu();
            });
        }
        
        // Close mobile menu when clicking any navigation link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                // Remove active class from all links
                document.querySelectorAll('.nav-links a').forEach(l => {
                    l.classList.remove('active');
                });
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Close mobile menu
                closeMobileMenu();
            });
        });

        // Navigation links
        homeLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showSection('home-section');
                setActiveNavItem('home-link');
                closeMobileMenu();
            });
        });

        productsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (!db.getCurrentUser()) {
                    showNotification('Please login to browse cards', 'error');
                    showModal(document.getElementById('auth-modal'));
                } else {
                    showSection('products-section');
                    setActiveNavItem('products-link');
                }
                closeMobileMenu();
            });
        });

        // Features link removed


        // Support link
        supportLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Support is available 24/7 via email at support@elitcards.com', 'success');
                closeMobileMenu();
            });
        });

        // Dashboard links (both desktop and mobile)
        document.querySelectorAll('.dashboard-link, .account-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (!db.getCurrentUser()) {
                    showNotification('Please login to access your account', 'error');
                    showModal(document.getElementById('auth-modal'));
                } else {
                    showSection('dashboard-section');
                    setActiveNavItem('account-link');
                }
                closeMobileMenu();
            });
        });

        cartLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (!db.getCurrentUser()) {
                    showNotification('Please login to view your cart', 'error');
                    showModal(document.getElementById('auth-modal'));
                } else {
                    showSection('cart-section');
                    setActiveNavItem('cart-link');
                }
                closeMobileMenu();
            });
        });

        // Use event delegation for dynamically loaded elements
        document.addEventListener('click', async (e) => {
            // Products link (including back to shop button in success modal)
            if (e.target.classList.contains('products-link') || e.target.closest('.products-link')) {
                e.preventDefault();
                if (!db.getCurrentUser()) {
                    showNotification('Please login to browse cards', 'error');
                    showModal(document.getElementById('auth-modal'));
                } else {
                    showSection('products-section');
                    setActiveNavItem('products-link');
                }
                closeMobileMenu();
            }

            // Browse cards button
            if (e.target.id === 'browse-cards-btn' || e.target.closest('#browse-cards-btn')) {
                e.preventDefault();
                if (!db.getCurrentUser()) {
                    showNotification('Please login to browse cards', 'error');
                    showModal(document.getElementById('auth-modal'));
                } else {
                    showSection('products-section');
                    setActiveNavItem('products-link');
                }
                closeMobileMenu();
            }

            // Dashboard browse button
            if (e.target.id === 'dashboard-browse-btn' || e.target.closest('#dashboard-browse-btn')) {
                e.preventDefault();
                showSection('products-section');
                setActiveNavItem('products-link');
                closeMobileMenu();
            }
            
            // Checkout button
            if (e.target.id === 'checkout-btn' || e.target.closest('#checkout-btn')) {
                e.preventDefault();
                
                // Update payment amount in modal
                updatePaymentAmount();
                
                showModal(document.getElementById('payment-modal'));
            }
            
            // Confirm payment button
            if (e.target.id === 'confirm-btn' || e.target.closest('#confirm-btn')) {
                e.preventDefault();
                await handlePaymentConfirmation();
            }
            
            // Logout button
            if (e.target.id === 'logout-btn' || e.target.closest('#logout-btn')) {
                logout();
            }
        });

        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = e.target.getAttribute('data-id'); // Keep as string for PocketBase IDs
                addToCart(productId);
            }
        });

        // Remove item buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
                const button = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
                const productId = button.getAttribute('data-id'); // Keep as string for PocketBase IDs
                removeFromCart(productId);
            }
        });

        // File upload handling for payment screenshot
        document.addEventListener('change', (e) => {
            if (e.target.id === 'payment-screenshot') {
                const file = e.target.files[0];
                const fileNameElement = document.getElementById('file-name');

                if (file) {
                    fileNameElement.textContent = `Selected: ${file.name}`;
                    fileNameElement.style.color = '#00ff88';
                } else {
                    fileNameElement.textContent = '';
                }
            }
        });

        // Auth modal tabs - using event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('auth-tab')) {
                const authTabs = document.querySelectorAll('.auth-tab');
                const authForms = document.querySelectorAll('.auth-form');
                
                authTabs.forEach(t => t.classList.remove('active'));
                authForms.forEach(f => f.classList.remove('active'));
                
                e.target.classList.add('active');
                const tabName = e.target.getAttribute('data-tab');
                const form = document.getElementById(`${tabName}-form`);
                if (form) {
                    form.classList.add('active');
                }
            }
            
            // Switch auth links
            if (e.target.classList.contains('switch-auth')) {
                e.preventDefault();
                const tabName = e.target.textContent === 'Login' ? 'login' : 'register';
                const authTabs = document.querySelectorAll('.auth-tab');
                const authForms = document.querySelectorAll('.auth-form');
                
                authTabs.forEach(t => t.classList.remove('active'));
                authForms.forEach(f => f.classList.remove('active'));
                
                const tab = document.querySelector(`.auth-tab[data-tab="${tabName}"]`);
                const form = document.getElementById(`${tabName}-form`);
                
                if (tab && form) {
                    tab.classList.add('active');
                    form.classList.add('active');
                }
            }
        });
        
        // Form submissions - using event delegation
        document.addEventListener('submit', async (e) => {
            // Login form
            if (e.target.id === 'login-form') {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                await login(email, password);
            }

            // Register form
            if (e.target.id === 'register-form') {
                e.preventDefault();
                const name = document.getElementById('register-name').value;
                const email = document.getElementById('register-email').value;
                const password = document.getElementById('register-password').value;
                const confirm = document.getElementById('register-confirm').value;

                if (password !== confirm) {
                    showNotification('Passwords do not match', 'error');
                    return;
                }

                await register(name, email, password);
            }

            // Mobile money payment form
            if (e.target.id === 'momo-payment-form') {
                e.preventDefault();
                await handlePaymentConfirmation();
            }
        });

        // Login/Register buttons - these exist in the main HTML
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            const authModal = document.getElementById('auth-modal');
            if (authModal) {
                showModal(authModal);
                const authTabs = document.querySelectorAll('.auth-tab');
                const authForms = document.querySelectorAll('.auth-form');
                
                authTabs.forEach(t => t.classList.remove('active'));
                authForms.forEach(f => f.classList.remove('active'));
                
                const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
                const loginForm = document.getElementById('login-form');
                
                if (loginTab && loginForm) {
                    loginTab.classList.add('active');
                    loginForm.classList.add('active');
                }
            }
        });

        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            const authModal = document.getElementById('auth-modal');
            if (authModal) {
                showModal(authModal);
                const authTabs = document.querySelectorAll('.auth-tab');
                const authForms = document.querySelectorAll('.auth-form');
                
                authTabs.forEach(t => t.classList.remove('active'));
                authForms.forEach(f => f.classList.remove('active'));
                
                const registerTab = document.querySelector('.auth-tab[data-tab="register"]');
                const registerForm = document.getElementById('register-form');
                
                if (registerTab && registerForm) {
                    registerTab.classList.add('active');
                    registerForm.classList.add('active');
                }
            }
        });

        // Close modal buttons - using event delegation for dynamically loaded modals
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal')) {
                const modal = e.target.closest('.modal-overlay');
                hideModal(modal);
            }
        });

        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                hideModal(e.target);
            }
        });

        // Prevent clicks on login/register buttons from triggering hamburger menu
        document.addEventListener('click', (e) => {
            // If clicking on login/register buttons or their children, don't toggle mobile menu
            if (e.target.closest('#login-btn') || e.target.closest('#register-btn')) {
                e.stopPropagation();
            }
        });
    }
});