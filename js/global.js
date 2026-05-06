/* ========================================
   GLOBAL FUNCTIONS - для всего сайта
   ======================================== */

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
            });
        });
    }
}

// Плавный скролл для якорных ссылок
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ❌❌❌ ПРОБЛЕМНАЯ ФУНКЦИЯ - МЕНЯЕТ ЦВЕТ НАВБАРА ПРИ СКРОЛЛЕ ❌❌❌
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(20, 10, 0, 1)';  // ← становится белым
                navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
            } else {
                navbar.style.background = 'rgba(20, 10, 0, 1)';  // ← становится белым
                navbar.style.boxShadow = 'none';
            }
        });
    }
}
// ❌❌❌ КОНЕЦ ПРОБЛЕМНОЙ ФУНКЦИИ ❌❌❌

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

// Глобальная инициализация
document.addEventListener('DOMContentLoaded', () => {
    initBurgerMenu();
    initSmoothScroll();
    initNavbarScrollEffect();  // ← ЗДЕСЬ ВЫЗЫВАЕТСЯ ПРОБЛЕМНАЯ ФУНКЦИЯ
    initCartButton();
    initSearchButton();
    updateCartCounter();
});
