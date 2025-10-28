// Configuration file for ElitCards application

const CONFIG = {
    // Application settings
    APP_NAME: 'ElitCards',
    VERSION: '1.0.0',

    // API endpoints (if needed)
    API_BASE_URL: '',

    // Firebase configuration
    FIREBASE_CONFIG: {
        apiKey: "AIzaSyBApkyl2-OrfwDBBI46sLecPQkTAR_x6qw",
        authDomain: "elite-cards-bd3a0.firebaseapp.com",
        projectId: "elite-cards-bd3a0",
        storageBucket: "elite-cards-bd3a0.firebasestorage.app",
        messagingSenderId: "577170723227",
        appId: "1:577170723227:web:7f5aa565da91cc1316113e"
    },

    // Payment settings
    PAYMENT_CURRENCY: 'USD',
    SERVICE_FEE: 1.00,

    // Exchange rate (GHC to USD)
    DEFAULT_EXCHANGE_RATE: 12.50,

    // Email settings (placeholder)
    EMAIL_SERVICE_ID: 'your-email-service-id',
    EMAIL_TEMPLATE_ID: 'your-template-id',
    EMAIL_PUBLIC_KEY: 'your-public-key',

    // Support contact
    SUPPORT_EMAIL: 'support@elitcards.com',

    // Development settings
    DEBUG_MODE: true,
    LOG_LEVEL: 'info'
};

// Make config available globally
window.CONFIG = CONFIG;