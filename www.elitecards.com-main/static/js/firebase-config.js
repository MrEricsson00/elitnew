// Firebase configuration and initialization
// This file initializes Firebase with the configuration from config.js

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

// Initialize Firebase
console.log('🔥 Initializing Firebase with config:', window.CONFIG?.FIREBASE_CONFIG ? 'Config available' : 'Config missing');
const app = initializeApp(window.CONFIG.FIREBASE_CONFIG);
const auth = getAuth(app);

// Make auth available globally
window.firebaseAuth = auth;
window.firebaseApp = app;

// Also make FirebaseAuth available globally (for compatibility)
window.FirebaseAuth = window.FirebaseAuth || {};

console.log('✅ Firebase initialized successfully');
console.log('🔍 Firebase Auth instance:', !!auth);
console.log('🔍 Firebase App instance:', !!app);