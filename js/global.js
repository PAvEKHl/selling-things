/* ==========================================================================
   GLOBAL FUNCTIONS - для всего сайта (global.js)
   ========================================================================== */

const BOT_USERNAME = 'PhoenixClothesBOT';

// Глобальное состояние корзины
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ---------- Счётчик корзины ----------
function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    ['cartCount', 'cartCountMobile'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = totalItems;
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// ---------- Добавление в корзину ----------
function addToCart(productName, productPrice) {
    const existing = cart.find(item => item.name === productName);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    updateCartCounter();
    showToast(`➕ ${productName} — в корзине`);
}

// ---------- Toast ----------
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
}

// ---------- Бургер-меню ----------
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
                burger.classList.remove('active');
            });
        });
    }
}

// ---------- Плавный скролл ----------
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href === '#catalog') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ---------- Корзина: drawer ----------
function openCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (drawer) {
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
        if (overlay) overlay.classList.add('active');
    }
}

function closeCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (drawer) {
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
    }
    if (overlay) overlay.classList.remove('active');
}

function renderCart() {
    const list = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    if (!list) return;

    if (cart.length === 0) {
        list.innerHTML = `<div class="cart-empty">Корзина пуста 🛒</div>`;
        if (totalEl) totalEl.innerText = '0';
        return;
    }

    let total = 0;
    list.innerHTML = cart.map(item => {
        const priceNum = parseInt((item.price || '0').replace(/\D/g, ''), 10) || 0;
        total += priceNum * (item.quantity || 1);
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">${item.price}</span>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn minus" data-name="${encodeURIComponent(item.name)}" aria-label="Убрать один">−</button>
                    <span class="qty-value">${item.quantity || 1}</span>
                    <button class="qty-btn plus" data-name="${encodeURIComponent(item.name)}" aria-label="Добавить один">+</button>
                </div>
            </div>
        `;
    }).join('');

    if (totalEl) totalEl.innerText = total.toLocaleString();

    // Обработчики +/−
    list.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = decodeURIComponent(btn.dataset.name);
            const item = cart.find(i => i.name === name);
            if (!item) return;
            if (btn.classList.contains('plus')) item.quantity += 1;
            else {
                item.quantity -= 1;
                if (item.quantity <= 0) cart = cart.filter(i => i.name !== name);
            }
            updateCartCounter();
        });
    });
}

function buildOrderText() {
    if (cart.length === 0) return '';
    let text = '🛍️ Мой заказ с сайта 卩卄ㄖ乇几丨乂 WEAR:\n\n';
    cart.forEach(item => {
        text += `${item.name} ×${item.quantity} — ${item.price}\n`;
    });
    const total = cart.reduce((sum, item) => {
        const priceNum = parseInt((item.price || '0').replace(/\D/g, ''), 10) || 0;
        return sum + priceNum * (item.quantity || 1);
    }, 0);
    text += `\nИтого: ${total.toLocaleString()} ₽`;
    return text;
}

function initCartDrawer() {
    // Открыть
    ['cartBtn', 'openCartMobile'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', openCart);
    });

    // Закрыть
    const closeBtn = document.getElementById('closeCart');
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    const overlay = document.getElementById('drawerOverlay');
    if (overlay) overlay.addEventListener('click', closeCart);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCart();
    });

    // Оформить в боте — deep-link + копирование заказа
    const checkout = document.getElementById('checkoutBot');
    if (checkout) {
        checkout.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('🛒 Корзина пуста');
                return;
            }
            const text = buildOrderText();
            // Копируем заказ в буфер, чтобы пользователь мог вставить в бот
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    showToast('📋 Заказ скопирован — вставьте в бот');
                }).catch(() => {});
            }
            // Открываем бот (deep-link), данные — в буфере обмена
            window.open(`https://t.me/${BOT_USERNAME}?start=order`, '_blank', 'noopener');
            closeCart();
        });
    }

    // Кнопка «Скопировать заказ»
    const copyBtn = document.getElementById('copyOrder');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (cart.length === 0) { showToast('🛒 Корзина пуста'); return; }
            const text = buildOrderText();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => showToast('📋 Заказ скопирован'))
                    .catch(() => showToast('Не удалось скопировать'));
            } else {
                prompt('Скопируйте заказ:', text);
            }
        });
    }

    renderCart();
}

// Динамическое обновление ссылок Telegram на странице контактов
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

// Глобальная инициализация
document.addEventListener('DOMContentLoaded', () => {
    initBurgerMenu();
    initSmoothScroll();
    initCartDrawer();
    updateCartCounter();
    updateContactLinks();
});
