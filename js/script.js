// Cerrar el banner promocional
document.addEventListener('DOMContentLoaded', function () {
    const closeBtn = document.querySelector('.close-btn');
    const promoBanner = document.querySelector('.promo-banner');

    if (closeBtn && promoBanner) {
        closeBtn.addEventListener('click', function () {
            promoBanner.style.display = 'none';
        });
    }

    // Inicialización de productos para simular navegación
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('click', function () {
            const productTitle = this.querySelector('.product-title').textContent;
            const productPrice = this.querySelector('.product-price').textContent;
            const productDescription = this.getAttribute('data-description');

            // Obtener la clase de la imagen para replicarla en el modal
            const imageDiv = this.querySelector('.product-image');
            const imageClass = Array.from(imageDiv.classList).find(cls => cls !== 'product-image');

            showProductModal({
                title: productTitle,
                price: productPrice,
                description: productDescription,
                imageClass: imageClass
            });
        });
    });

    // Manejo de paginación
    const paginationItems = document.querySelectorAll('.page');

    paginationItems.forEach(item => {
        item.addEventListener('click', function () {
            let targetPage = 1;

            // Determinar la página destino
            if (this.classList.contains('next')) {
                const currentActive = document.querySelector('.page.active');
                if (currentActive) {
                    const currentPage = parseInt(currentActive.textContent);
                    targetPage = currentPage + 1;
                    // Limitar a máximo 2 páginas por ahora
                    if (targetPage > 2) targetPage = 1;
                }
            } else {
                targetPage = parseInt(this.textContent);
            }

            // Si la página no existe (ej. 3, 4, 5), no hacer nada o ir a la 1
            // Para este demo, solo tenemos 2 páginas
            if (isNaN(targetPage) || targetPage > 2) return;

            // Actualizar UI de paginación
            paginationItems.forEach(p => p.classList.remove('active'));

            // Encontrar el botón correspondiente a la página y activarlo
            paginationItems.forEach(p => {
                if (p.textContent.trim() === targetPage.toString() && !p.classList.contains('next')) {
                    p.classList.add('active');
                }
            });

            // Mostrar la página de productos correspondiente
            const productPages = document.querySelectorAll('.product-page');
            productPages.forEach(page => {
                page.style.display = 'none';
                page.classList.remove('active');

                if (page.getAttribute('data-page') === targetPage.toString()) {
                    page.style.display = 'block';
                    page.classList.add('active');

                    // Actualizar contador de items
                    const itemsCount = document.querySelector('.items-count');
                    const productsOnPage = page.querySelectorAll('.product-card').length;
                    if (itemsCount) {
                        itemsCount.textContent = `${productsOnPage} items`;
                    }

                    // Animación simple de entrada
                    page.style.opacity = '0';
                    setTimeout(() => {
                        page.style.transition = 'opacity 0.5s ease';
                        page.style.opacity = '1';
                    }, 50);
                }
            });

            // Scroll suave hacia arriba
            const grid = document.querySelector('.product-grid');
            if (grid) {
                window.scrollTo({
                    top: grid.offsetTop - 100,
                    behavior: 'smooth'
                });
            }

            console.log('Página mostrada: ' + targetPage);
        });
    });

    // Manejo de filtros
    const filterButtons = document.querySelectorAll('.filter');

    filterButtons.forEach(filter => {
        filter.addEventListener('click', function () {
            const filterType = this.querySelector('span').textContent;
            console.log('Filtro seleccionado:', filterType);

            // Aquí iría la lógica para filtrar productos
            // Por ahora solo mostramos una notificación
            showNotification(`Filtro aplicado: ${filterType}`);
        });
    });

    // Manejo del formulario de newsletter
    const subscribeBtn = document.querySelector('.subscribe-btn');
    const emailInput = document.querySelector('.email-input');

    if (subscribeBtn && emailInput) {
        subscribeBtn.addEventListener('click', function () {
            const email = emailInput.value.trim();

            if (email && isValidEmail(email)) {
                showNotification('¡Gracias por suscribirte a nuestro newsletter!');
                emailInput.value = '';
            } else {
                showNotification('Por favor, ingresa un email válido');
            }
        });

        // Enviar con Enter
        emailInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                subscribeBtn.click();
            }
        });
    }

    // Navegación móvil (hamburger menu)
    createMobileMenu();

    // Búsqueda
    const searchIcon = document.querySelector('.icon-link .fa-search');
    if (searchIcon) {
        searchIcon.addEventListener('click', function () {
            showSearchModal();
        });
    }

    // Carrito de compras
    const cartIcon = document.querySelector('.icon-link .fa-shopping-bag');
    if (cartIcon) {
        cartIcon.addEventListener('click', function () {
            showCartModal();
        });
    }

    // Usuario
    const userIcon = document.querySelector('.icon-link .fa-user');
    if (userIcon) {
        userIcon.addEventListener('click', function () {
            showUserModal();
        });
    }
});

// Función para mostrar notificaciones
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 12px 24px;
        border-radius: 22px;
        z-index: 1000;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para crear menú móvil
function createMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');

    // Crear botón hamburguesa
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger-btn';
    hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    hamburger.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 18px;
        cursor: pointer;
        padding: 8px;
    `;

    // Insertar botón hamburguesa
    const navIcons = document.querySelector('.nav-icons');
    navIcons.insertBefore(hamburger, navIcons.firstChild);

    // Manejo del menú móvil
    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('mobile-active');
    });

    // Estilos responsive para el menú
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 1200px) {
            .hamburger-btn {
                display: block !important;
            }
            
            .nav-links {
                position: fixed;
                top: 0;
                left: -100%;
                width: 280px;
                height: 100vh;
                background-color: #000;
                padding: 80px 24px 24px;
                transition: left 0.3s ease;
                z-index: 999;
                border-right: 1px solid var(--border-color);
            }
            
            .nav-links.mobile-active {
                left: 0;
            }
            
            .nav-menu {
                flex-direction: column;
                gap: 24px;
            }
            
            .nav-link {
                font-size: 18px;
                padding: 12px 0;
                border-bottom: 1px solid var(--border-color);
            }
        }
    `;
    document.head.appendChild(style);
}

// Función para mostrar modal de búsqueda
function showSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Buscar productos</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <input type="text" placeholder="¿Qué estás buscando?" class="search-input">
                <div class="search-suggestions">
                    <div class="suggestion">Laptop</div>
                    <div class="suggestion">Smartphone</div>
                    <div class="suggestion">Tablet</div>
                    <div class="suggestion">Gaming</div>
                </div>
            </div>
        </div>
    `;

    addModalStyles(modal);
    document.body.appendChild(modal);

    // Enfocar input
    const searchInput = modal.querySelector('.search-input');
    searchInput.focus();

    // Manejar cierre
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Función para mostrar modal de carrito
function showCartModal() {
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Carrito de compras</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="cart-empty">
                    <i class="fas fa-shopping-bag" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                    <p>Tu carrito está vacío</p>
                    <button class="btn-primary">Continuar comprando</button>
                </div>
            </div>
        </div>
    `;

    addModalStyles(modal);
    document.body.appendChild(modal);

    // Manejar cierre
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Función para mostrar modal de usuario
function showUserModal() {
    const modal = document.createElement('div');
    modal.className = 'user-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Mi cuenta</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="user-options">
                    <button class="user-option">Iniciar sesión</button>
                    <button class="user-option">Registrarse</button>
                    <button class="user-option">Mis pedidos</button>
                    <button class="user-option">Configuración</button>
                </div>
            </div>
        </div>
    `;

    addModalStyles(modal);
    document.body.appendChild(modal);

    // Manejar cierre
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Función para mostrar modal de producto
function showProductModal(product) {
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content product-detail-content">
            <div class="modal-header">
                <h3>${product.title}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="product-detail-layout">
                    <div class="product-detail-image ${product.imageClass}"></div>
                    <div class="product-detail-info">
                        <p class="detail-description">${product.description}</p>
                        <p class="detail-price">${product.price}</p>
                        <button class="btn-add-cart">Agregar al Carrito</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    addModalStyles(modal);

    // Estilos específicos para este modal
    const content = modal.querySelector('.modal-content');
    content.style.maxWidth = '800px';

    const layout = modal.querySelector('.product-detail-layout');
    layout.style.cssText = `
        display: flex;
        gap: 24px;
        flex-wrap: wrap;
    `;

    const image = modal.querySelector('.product-detail-image');
    image.style.cssText = `
        width: 100%;
        max-width: 350px;
        height: 300px;
        border-radius: 12px;
        background-size: cover;
        background-position: center;
        flex: 1 1 300px;
    `;

    // Replicar el background image de la clase original
    // Esto asume que las clases están definidas en CSS con sus URLs
    // Como no podemos acceder a las reglas CSS fácilmente desde JS sin getComputedStyle complejo,
    // vamos a usar la misma clase que ya tiene la imagen definida

    const info = modal.querySelector('.product-detail-info');
    info.style.cssText = `
        flex: 1 1 300px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    `;

    const desc = modal.querySelector('.detail-description');
    desc.style.cssText = `
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 24px;
        color: rgba(255, 255, 255, 0.8);
    `;

    const price = modal.querySelector('.detail-price');
    price.style.cssText = `
        font-size: 32px;
        font-weight: 800;
        color: var(--primary-color);
        margin-bottom: 24px;
    `;

    const btn = modal.querySelector('.btn-add-cart');
    btn.style.cssText = `
        background-color: var(--primary-color);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 22px;
        font-weight: 600;
        font-size: 16px;
        cursor: pointer;
        transition: transform 0.2s;
        align-self: start;
    `;

    btn.addEventListener('mouseover', () => {
        btn.style.transform = 'scale(1.05)';
    });

    btn.addEventListener('mouseout', () => {
        btn.style.transform = 'scale(1)';
    });

    btn.addEventListener('click', () => {
        showNotification(`${product.title} añadido al carrito!`);
        document.body.removeChild(modal);
    });

    document.body.appendChild(modal);

    // Manejar cierre
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Función para añadir estilos a los modales
function addModalStyles(modal) {
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background-color: #1a1a1a;
        border-radius: 22px;
        padding: 24px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        border: 1px solid var(--border-color);
    `;

    const modalHeader = modal.querySelector('.modal-header');
    modalHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--border-color);
    `;

    const closeButton = modal.querySelector('.close-modal');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 24px;
        cursor: pointer;
    `;
}
