// Email service for ElitCards application
// Handles email sending using EmailJS

const EmailService = {
    // Send transaction notification to admin
    async sendTransactionNotification(data) {
        try {
            if (!window.emailjs) {
                throw new Error('EmailJS not available');
            }

            const templateParams = {
                to_email: window.EMAIL_CONFIG.ADMIN_EMAIL,
                customer_email: data.customerEmail,
                amount: `$${data.amount.toFixed(2)}`,
                payment_id: data.paymentId,
                invoice_number: data.invoiceNumber,
                payment_method: data.paymentMethod,
                timestamp: data.timestamp,
                cart_items: data.cartItems.map(item =>
                    `${item.title} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
                ).join('\n'),
                total_items: data.cartItems.reduce((sum, item) => sum + item.quantity, 0)
            };

            const result = await emailjs.send(
                window.EMAIL_CONFIG.SERVICE_ID,
                window.EMAIL_CONFIG.TEMPLATES.TRANSACTION_NOTIFICATION,
                templateParams
            );

            console.log('Transaction notification email sent:', result);
            return { success: true, result };

        } catch (error) {
            console.error('Failed to send transaction notification:', error);
            return { success: false, error: error.message };
        }
    },

    // Send welcome email to new user
    async sendWelcomeEmail(userEmail, userName) {
        try {
            if (!window.emailjs) {
                throw new Error('EmailJS not available');
            }

            const templateParams = {
                to_email: userEmail,
                user_name: userName,
                welcome_message: `Welcome to ElitCards, ${userName}! Your premium virtual card experience awaits.`,
                support_email: window.EMAIL_CONFIG.SUPPORT_EMAIL
            };

            const result = await emailjs.send(
                window.EMAIL_CONFIG.SERVICE_ID,
                window.EMAIL_CONFIG.TEMPLATES.WELCOME,
                templateParams
            );

            console.log('Welcome email sent:', result);
            return { success: true, result };

        } catch (error) {
            console.error('Failed to send welcome email:', error);
            return { success: false, error: error.message };
        }
    },

    // Send support email
    async sendSupportEmail(fromEmail, subject, message) {
        try {
            if (!window.emailjs) {
                throw new Error('EmailJS not available');
            }

            const templateParams = {
                from_email: fromEmail,
                to_email: window.EMAIL_CONFIG.SUPPORT_EMAIL,
                subject: subject,
                message: message,
                timestamp: new Date().toISOString()
            };

            const result = await emailjs.send(
                window.EMAIL_CONFIG.SERVICE_ID,
                window.EMAIL_CONFIG.TEMPLATES.SUPPORT,
                templateParams
            );

            console.log('Support email sent:', result);
            return { success: true, result };

        } catch (error) {
            console.error('Failed to send support email:', error);
            return { success: false, error: error.message };
        }
    },

    // Validate email address
    validateEmail(email) {
        return window.EMAIL_CONFIG.EMAIL_REGEX.test(email);
    },

    // Check rate limit (simple implementation)
    checkRateLimit() {
        const lastSent = localStorage.getItem('lastEmailSent');
        const now = Date.now();

        if (lastSent) {
            const timeDiff = now - parseInt(lastSent);
            const hourInMs = 60 * 60 * 1000;

            if (timeDiff < hourInMs) {
                const emailsSent = parseInt(localStorage.getItem('emailsSentToday') || '0');
                if (emailsSent >= window.EMAIL_CONFIG.RATE_LIMIT) {
                    return { allowed: false, message: 'Rate limit exceeded. Please try again later.' };
                }
            } else {
                // Reset counter after an hour
                localStorage.setItem('emailsSentToday', '0');
            }
        }

        return { allowed: true };
    },

    // Update rate limit counter
    updateRateLimit() {
        localStorage.setItem('lastEmailSent', Date.now().toString());
        const currentCount = parseInt(localStorage.getItem('emailsSentToday') || '0');
        localStorage.setItem('emailsSentToday', (currentCount + 1).toString());
    },

    // Send email with rate limiting
    async sendEmail(templateId, templateParams) {
        // Check rate limit
        const rateLimitCheck = this.checkRateLimit();
        if (!rateLimitCheck.allowed) {
            return rateLimitCheck;
        }

        try {
            if (!window.emailjs) {
                throw new Error('EmailJS not available');
            }

            const result = await emailjs.send(
                window.EMAIL_CONFIG.SERVICE_ID,
                templateId,
                templateParams
            );

            // Update rate limit on success
            this.updateRateLimit();

            console.log('Email sent successfully:', result);
            return { success: true, result };

        } catch (error) {
            console.error('Failed to send email:', error);
            return { success: false, error: error.message };
        }
    }
};

// Make EmailService available globally
window.EmailService = EmailService;