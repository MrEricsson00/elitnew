// Firebase Authentication Module
// This module provides authentication functions for the ElitCards application

const FirebaseAuth = {
    // Login user with email and password
    async loginUser(email, password) {
        console.log('🔐 FirebaseAuth.loginUser called with:', { email, hasPassword: !!password });
        console.log('🔍 Firebase auth instance available:', !!window.firebaseAuth);

        if (!window.firebaseAuth) {
            console.error('❌ Firebase auth not initialized');
            return {
                success: false,
                message: 'Authentication service is not available. Please refresh the page.',
                error: 'auth/not-initialized'
            };
        }

        try {
            console.log('📡 Attempting Firebase sign in...');
            const userCredential = await window.firebaseAuth.signInWithEmailAndPassword(
                email,
                password
            );

            console.log('✅ Firebase sign in successful:', {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: userCredential.user.displayName,
                emailVerified: userCredential.user.emailVerified
            });

            return {
                success: true,
                message: 'Login successful!',
                user: {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    displayName: userCredential.user.displayName,
                    emailVerified: userCredential.user.emailVerified
                }
            };
        } catch (error) {
            console.error('❌ Login error:', error);
            console.error('❌ Error code:', error.code);
            console.error('❌ Error message:', error.message);

            let errorMessage = 'Login failed. Please try again.';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = 'This account has been disabled.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed login attempts. Please try again later.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network connection issue. Please check your internet and try again.';
            }

            return {
                success: false,
                message: errorMessage,
                error: error.code
            };
        }
    },

    // Register new user
    async registerUser(email, password, displayName, phone = '') {
        console.log('👤 FirebaseAuth.registerUser called with:', {
            email,
            hasPassword: !!password,
            displayName,
            phone
        });
        console.log('🔍 Firebase auth instance available:', !!window.firebaseAuth);

        if (!window.firebaseAuth) {
            console.error('❌ Firebase auth not initialized');
            return {
                success: false,
                message: 'Authentication service is not available. Please refresh the page.',
                error: 'auth/not-initialized'
            };
        }

        try {
            console.log('📡 Attempting Firebase user creation...');
            const userCredential = await window.firebaseAuth.createUserWithEmailAndPassword(
                email,
                password
            );

            console.log('✅ Firebase user creation successful:', {
                uid: userCredential.user.uid,
                email: userCredential.user.email
            });

            // Update display name if provided
            if (displayName) {
                console.log('📝 Updating display name to:', displayName);
                await userCredential.user.updateProfile({
                    displayName: displayName
                });
            }

            // Send email verification
            console.log('📧 Sending email verification...');
            await userCredential.user.sendEmailVerification();
            console.log('✅ Email verification sent');

            return {
                success: true,
                message: 'Account created successfully! Please check your email to verify your account.',
                user: {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    displayName: displayName || userCredential.user.email.split('@')[0],
                    emailVerified: userCredential.user.emailVerified
                }
            };
        } catch (error) {
            console.error('❌ Registration error:', error);
            console.error('❌ Error code:', error.code);
            console.error('❌ Error message:', error.message);

            let errorMessage = 'Registration failed. Please try again.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'An account with this email already exists.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters.';
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMessage = 'Email/password accounts are not enabled.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network connection issue. Please check your internet and try again.';
            }

            return {
                success: false,
                message: errorMessage,
                error: error.code
            };
        }
    },

    // Logout user
    async logoutUser() {
        if (!window.firebaseAuth) {
            console.error('❌ Firebase auth not initialized');
            return {
                success: false,
                message: 'Authentication service is not available.',
                error: 'auth/not-initialized'
            };
        }

        try {
            await window.firebaseAuth.signOut();
            return {
                success: true,
                message: 'Logged out successfully!'
            };
        } catch (error) {
            console.error('Logout error:', error);
            return {
                success: false,
                message: 'Logout failed. Please try again.',
                error: error.code
            };
        }
    },

    // Get current user
    getCurrentUser() {
        if (!window.firebaseAuth) {
            console.error('❌ Firebase auth not initialized');
            return null;
        }
        return window.firebaseAuth.currentUser;
    },

    // Listen to auth state changes
    onAuthStateChanged(callback) {
        if (!window.firebaseAuth) {
            console.error('❌ Firebase auth not initialized');
            return null;
        }
        return window.firebaseAuth.onAuthStateChanged(callback);
    },

    // Send password reset email
    async sendPasswordResetEmail(email) {
        if (!window.firebaseAuth) {
            console.error('❌ Firebase auth not initialized');
            return {
                success: false,
                message: 'Authentication service is not available.',
                error: 'auth/not-initialized'
            };
        }

        try {
            await window.firebaseAuth.sendPasswordResetEmail(email);
            return {
                success: true,
                message: 'Password reset email sent. Please check your inbox.'
            };
        } catch (error) {
            console.error('Password reset error:', error);

            let errorMessage = 'Failed to send password reset email.';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network connection issue. Please check your internet and try again.';
            }

            return {
                success: false,
                message: errorMessage,
                error: error.code
            };
        }
    },

    // Update user profile
    async updateProfile(updates) {
        if (!window.firebaseAuth) {
            console.error('❌ Firebase auth not initialized');
            return {
                success: false,
                message: 'Authentication service is not available.',
                error: 'auth/not-initialized'
            };
        }

        try {
            const user = window.firebaseAuth.currentUser;
            if (!user) {
                throw new Error('No user logged in');
            }

            await user.updateProfile(updates);
            return {
                success: true,
                message: 'Profile updated successfully!'
            };
        } catch (error) {
            console.error('Profile update error:', error);
            return {
                success: false,
                message: 'Failed to update profile.',
                error: error.code
            };
        }
    }
};

// Make FirebaseAuth available globally
window.FirebaseAuth = FirebaseAuth;