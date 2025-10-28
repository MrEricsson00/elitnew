// Email configuration for ElitCards application

const EMAIL_CONFIG = {
    // EmailJS configuration
    SERVICE_ID: 'your-email-service-id', // Replace with your EmailJS service ID
    TEMPLATE_ID: 'your-template-id',    // Replace with your EmailJS template ID
    PUBLIC_KEY: 'your-public-key',      // Replace with your EmailJS public key

    // Email templates
    TEMPLATES: {
        TRANSACTION_NOTIFICATION: 'transaction_notification_template',
        WELCOME: 'welcome_template',
        SUPPORT: 'support_template'
    },

    // Admin email for notifications
    ADMIN_EMAIL: 'admin@elitcards.com',

    // Support email
    SUPPORT_EMAIL: 'support@elitcards.com',

    // Email validation regex
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    // Rate limiting (emails per hour)
    RATE_LIMIT: 10,

    // Email sending timeout (ms)
    TIMEOUT: 30000
};

// Initialize EmailJS if available
if (window.emailjs) {
    emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
    console.log('EmailJS initialized with config');
} else {
    console.warn('EmailJS not loaded, email functionality will not work');
}

// Make config available globally
window.EMAIL_CONFIG = EMAIL_CONFIG;