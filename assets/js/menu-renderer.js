
/**
 * 
 * Menu Renderer for Kopi Saropah
 * Loads menu items from JSON and renders them dynamically
 */

const MenuRenderer = {
    // Escape HTML to prevent XSS
    escapeHTML(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, function (m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        });
    },

    async init() {
        const menuContainer = document.querySelector('.menu-grid');
        if (!menuContainer) return;

        const categoryId = document.body.dataset.category;
        console.log('Loading menu for category:', categoryId);

        try {
            const response = await fetch('assets/data/menu.json');
            if (!response.ok) throw new Error('Menu data not found');

            const data = await response.json();
            const category = data.categories.find(c => c.id === categoryId);

            if (category) {
                this.renderMenu(menuContainer, category.items);
            } else {
                console.warn('Category not found in JSON:', categoryId);
            }
        } catch (error) {
            console.error('Error loading menu:', error);
            menuContainer.innerHTML = '<p class="error">Gagal memuat menu. Silakan coba lagi nanti.</p>';
        }
    },

    renderMenu(container, items) {
        container.innerHTML = items.map(item => {
            // Sanitize inputs
            const safeName = this.escapeHTML(item.name);
            const safePrice = this.escapeHTML(item.price);
            const safeImage = this.escapeHTML(item.image || 'assets/images/logo.webp');

            return `
            <div class="menu-item fade-in">
                <div class="item-image">
                    <img src="${safeImage}" alt="${safeName}" loading="lazy">
                </div>
                <div class="item-details">
                    <div class="item-header">
                        <h4>${safeName}</h4>
                        <span class="price">${safePrice}</span>
                    </div>
                    <div class="item-actions mt-sm">
                        <a href="https://easyeat.id/r/kopisaropah/3" target="_blank" class="btn-order">Order Now</a>
                    </div>
                </div>
            </div>
        `}).join('');

        // Trigger animation for dynamic items
        setTimeout(() => {
            container.querySelectorAll('.menu-item').forEach(item => {
                item.classList.add('visible');
            });
        }, 100);
    }
};

document.addEventListener('DOMContentLoaded', () => MenuRenderer.init());
