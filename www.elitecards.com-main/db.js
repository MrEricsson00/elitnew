// Database module for ElitCards application
// Handles data operations and localStorage

const DB = {

    // Initialize database
    async initializeData() {
        try {
            // Initialize local data if not exists
            this.initializeLocalData();
        } catch (error) {
            console.error('Error initializing database:', error);
        }
    },

    // Initialize local data
    initializeLocalData() {
        if (!localStorage.getItem('products')) {
            const products = [
                {
                    id: 'visa-gold-1',
                    title: 'Visa Gold Card',
                    price: 25,
                    image: 'Visa Gold 1.jpeg',
                    description: 'Premium Visa Gold virtual card'
                },
                {
                    id: 'visa-infinite-1',
                    title: 'Visa Infinite Card',
                    price: 35,
                    image: 'Visa Infinite1.jpeg',
                    description: 'Elite Visa Infinite virtual card'
                },
                {
                    id: 'visa-infinite-2',
                    title: 'Visa Infinite Card Premium',
                    price: 50,
                    image: 'Visa Infinite 2.jpeg',
                    description: 'Premium Visa Infinite virtual card'
                },
                {
                    id: 'platinum-mastercard-1',
                    title: 'Platinum Mastercard',
                    price: 100,
                    image: 'Platinum Mastercard1.jpeg',
                    description: 'Exclusive Platinum Mastercard'
                },
                {
                    id: 'american-express-1',
                    title: 'American Express Card',
                    price: 75,
                    image: 'American Express 1.jpeg',
                    description: 'Premium American Express card'
                },
                {
                    id: 'american-express-2',
                    title: 'American Express Premium',
                    price: 90,
                    image: 'American Express 2.jpeg',
                    description: 'Elite American Express card'
                },
                {
                    id: 'discover-1',
                    title: 'Discover Card',
                    price: 40,
                    image: 'Discover1.jpeg',
                    description: 'Premium Discover virtual card'
                },
                {
                    id: 'discover-2',
                    title: 'Discover Premium',
                    price: 55,
                    image: 'Discover2.jpeg',
                    description: 'Elite Discover virtual card'
                },
                {
                    id: 'platinum-2',
                    title: 'Platinum Card',
                    price: 80,
                    image: 'platinum2.jpeg',
                    description: 'Premium Platinum virtual card'
                }
            ];
            localStorage.setItem('products', JSON.stringify(products));
        }

        if (!localStorage.getItem('cart')) {
            localStorage.setItem('cart', JSON.stringify([]));
        }

        if (!localStorage.getItem('exchangeRate')) {
            localStorage.setItem('exchangeRate', '12.50');
        }
    },

    // Products operations
    async getProducts() {
        // Use localStorage
        const products = localStorage.getItem('products');
        return products ? JSON.parse(products) : [];
    },

    // Cart operations
    getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },

    getCartCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    async getCartSubtotal() {
        const cart = this.getCart();
        const products = await this.getProducts();
        let subtotal = 0;

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                subtotal += product.price * item.quantity;
            }
        });

        return subtotal;
    },

    addToCart(productId) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    },

    removeFromCart(productId) {
        const cart = this.getCart();
        const updatedCart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    },

    clearCart() {
        localStorage.setItem('cart', JSON.stringify([]));
    },

    // User operations
    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    setCurrentUser(user) {
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('currentUser');
        }
    },

    // Payment operations
    async recordPayment(paymentData) {
        const result = {
            localId: null,
            success: true,
            message: 'Payment recorded locally'
        };

        // Save locally only
        try {
            const localPayments = JSON.parse(localStorage.getItem('localPayments') || '[]');
            const localPayment = {
                id: Date.now().toString(),
                ...paymentData,
                status: 'completed', // Mark as completed for frontend-only
                created: new Date().toISOString()
            };

            localPayments.push(localPayment);
            localStorage.setItem('localPayments', JSON.stringify(localPayments));
            result.localId = localPayment.id;
        } catch (error) {
            console.error('Local payment storage failed:', error);
            result.success = false;
            result.message = 'Failed to save payment locally';
        }

        return result;
    },

    // Orders operations
    async getRecentOrders(userEmail) {
        // Use localStorage
        const localPayments = JSON.parse(localStorage.getItem('localPayments') || '[]');
        return localPayments
            .filter(payment => payment.customerEmail === userEmail)
            .slice(0, 10)
            .map(payment => ({
                id: payment.id,
                date: new Date(payment.created).toLocaleDateString(),
                total: this.formatPrice(payment.amount),
                status: payment.status || 'pending',
                items: payment.cartItems || []
            }));
    },

    // Exchange rate operations
    getCurrentExchangeRate() {
        const rate = localStorage.getItem('exchangeRate');
        return rate ? parseFloat(rate) : 12.50;
    },

    updateExchangeRate(newRate) {
        localStorage.setItem('exchangeRate', newRate.toString());
    },

    fixExchangeRate() {
        const fixedRate = 12.50;
        this.updateExchangeRate(fixedRate);
        return fixedRate;
    },

    // Utility functions
    formatPrice(amount) {
        return `$${amount.toFixed(2)}`;
    },

    // Testing functions
    async testPaymentSubmission() {
        const testData = {
            customerEmail: 'test@example.com',
            amount: 25,
            currency: 'USD',
            cartItems: [{ id: 'test', title: 'Test Card', price: 25, quantity: 1 }],
            paymentMethod: 'mobile_money',
            invoiceNumber: 'TEST123'
        };

        return await this.recordPayment(testData);
    },

    // Mock PocketBase connection for compatibility
    testPocketBaseConnection() {
        return {
            success: true,
            message: 'Frontend-only mode - no backend connection needed',
            url: 'N/A',
            httpsContext: true
        };
    },

    // Mock PocketBase object for compatibility
    pb: {
        baseUrl: 'frontend-only',
        authStore: {
            token: null,
            model: null
        }
    },

    isHttpsContext: true
};

// Initialize database when script loads
DB.initializeData();

// Make DB available globally
window.db = DB;