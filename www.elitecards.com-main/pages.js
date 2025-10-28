/**
 * Pages System
 *
 * This script handles loading and managing pages for the ElitCards application.
 * It provides a smooth transition between different pages by dynamically loading HTML pages.
 */

// Page cache to avoid unnecessary fetches
const pageCache = {};

// Available pages
const PAGES = {
    HOME: 'pages/home.html',
    PRODUCTS: 'pages/products.html',
    DASHBOARD: 'pages/dashboard.html',
    CART: 'pages/cart.html',
    MODALS: 'pages/modals.html'
};

// Wait for DOM to be fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', function() {
    // Component container element
    const componentContainer = document.getElementById('component-container');
    const mainContent = document.getElementById('main-content');

    // Modal container element (will be created when modals are loaded)
    let modalContainer = null;

    /**
     * Load a page into the container
     * @param {string} pageUrl - URL of the page to load
     * @param {boolean} append - Whether to append the page or replace existing content
     * @returns {Promise} - Promise that resolves when the page is loaded
     */
    async function loadPage(pageUrl, append = false) {
    try {
        // Check if page is already in cache
        if (!pageCache[pageUrl]) {
            const response = await fetch(pageUrl);
            if (!response.ok) {
                throw new Error(`Failed to load page: ${pageUrl}`);
            }
            pageCache[pageUrl] = await response.text();
        }

        // If not appending, fade out current content
        if (!append) {
            componentContainer.style.opacity = '0';

            // Wait for fade out animation
            await new Promise(resolve => setTimeout(resolve, 300));

            // Clear container
            componentContainer.innerHTML = '';
        }

        // Create a temporary container for the page
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = pageCache[pageUrl];

        // Append all child nodes to the component container
        while (tempContainer.firstChild) {
            componentContainer.appendChild(tempContainer.firstChild);
        }

        // Fade in the new content
        componentContainer.style.opacity = '1';

        // Return the loaded page
        return componentContainer;
    } catch (error) {
        console.error('Error loading page:', error);
        componentContainer.innerHTML = `<div class="error-message">Failed to load page: ${error.message}</div>`;
        return null;
    }
}

    /**
     * Initialize the pages system
     */
    async function initPages() {
        // Add fade transition to component container
        componentContainer.style.transition = 'opacity 0.3s ease';

        // Load modals page (always present)
        await loadPage(PAGES.MODALS, true);

        // Create a container for modals if it doesn't exist
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = 'modal-container';
            document.body.appendChild(modalContainer);

            // Move all modals to the modal container
            const modals = document.querySelectorAll('.modal-overlay');
            modals.forEach(modal => {
                modalContainer.appendChild(modal);
            });
        }

        // Load home page by default
        await loadPage(PAGES.HOME);

        console.log('Pages initialized successfully');
    }

    // Initialize pages
    initPages();

    // Export functions for use in other scripts
    window.Pages = {
        load: loadPage,
        PAGES: PAGES
    };
});