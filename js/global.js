/* ==========================================================================
   GLOBAL FUNCTIONS - для всего сайта (global.js)
   ========================================================================== */

// Глобальное состояние корзины
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Функция обновления счетчика корзины
function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.innerText = totalItems;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Функция добавления в корзину
function addToCart(productName, productPrice) {
    const existing = cart.find(item => item.name === productName);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    updateCartCounter();
    showToast(`➕ ${productName} добавлен в корзину`);
}

// Toast уведомление
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// Бургер-меню
function initBurgerMenu() {
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');
    
    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            burger.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                burger.classList.remove('active'); // Сбрасываем иконку бургера
            });
        });
    }
}

// Плавный скролл для якорных ссылок
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Инициализация корзины
function initCartButton() {
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('🛒 Корзина пуста');
            } else {
                let message = '🛍️ В корзине:\n\n';
                cart.forEach(item => {
                    message += `${item.name} x${item.quantity} — ${item.price}\n`;
                });
                const total = cart.reduce((sum, item) => {
                    const priceNum = parseInt(item.price.replace(/\D/g, ''));
                    return sum + (priceNum * item.quantity);
                }, 0);
                message += `\n━━━━━━━━━━━━━━━━\n💰 Итого: ${total.toLocaleString()} ₽`;
                alert(message);
            }
        });
    }
}

// Инициализация поиска
function initSearchButton() {
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            showToast('🔍 Поиск скоро появится...');
        });
    }
}

// ДИНАМИЧЕСКОЕ ОБНОВЛЕНИЕ ССЫЛОК TELEGRAM (Для секции #contacts)
function updateContactLinks() {
    const telegramButtons = document.querySelectorAll('.contact-btn.telegram');
    const savedProduct = localStorage.getItem('selectedProduct');
    
    if (savedProduct && telegramButtons.length > 0) {
        try {
            const product = JSON.parse(savedProduct);
            const messageText = `Привет! Хочу купить товар:\n📦 Название: ${product.title}\n📝 ${product.description}`;
            const encodedText = encodeURIComponent(messageText);
            
            telegramButtons.forEach(btn => {
                const currentHref = btn.getAttribute('href');
                
                // Проверяем изначальный href, чтобы не перепутать лички Даниила и Павла
                if (currentHref && currentHref.includes('Kamelot709')) {
                    btn.href = `https://t.me/Kamelot709?text=${encodedText}`;
                } else if (currentHref && currentHref.includes('PavelHlebko')) {
                    btn.href = `https://t.me/PavelHlebko?text=${encodedText}`;
                }
            });
        } catch (e) {
            console.error("Ошибка чтения localStorage:", e);
        }
    }
}

// Глобальная инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    initBurgerMenu();
    initSmoothScroll();
    initCartButton();
    initSearchButton();
    updateCartCounter();
    
    // Сразу обновляем контакты на основе того, что было выбрано ранее
    updateContactLinks();
});
