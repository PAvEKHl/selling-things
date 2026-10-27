/* ==========================================================================
   MAIN PAGE SPECIFIC - Каталог, фильтры, модалка, корзина (main.js)
   ========================================================================== */

const BYN_TO_RUB = 26;
// BOT_USERNAME объявлен в global.js (загружается раньше) — здесь используем общий

// Telegram WebApp
const tg = window.Telegram && window.Telegram.WebApp;
if (tg && tg.initData) {
    document.body.classList.add('telegram-view');
}

const items = [
    { name: "Кроссовки Puma (белые)", size: "42", price: "105", quantity: null, currency: "бун", category: "Кроссовки", brand: "", img: "https://i.ibb.co/20xYFJMr/1-Puma.jpg" },
    { name: "Кроссовки Puma (красные)", size: "42", price: "120", quantity: null, currency: "бун", category: "Кроссовки", brand: "", img: "https://i.ibb.co/4gMFBxxR/2-Puma.jpg" },
    { name: "Тапочки Nike (чёрные)", size: "Универсальный", price: "80", quantity: null, currency: "бун", category: "Кроссовки", brand: "", img: "https://i.ibb.co/YTTyT9kN/3-Nike.jpg" },
    { name: "Тапочки Nike (серо-белые)", size: "Универсальный", price: "80", quantity: null, currency: "бун", category: "Кроссовки", brand: "", img: "https://i.ibb.co/QvDKstWC/4-Nike-2.jpg" },
    { name: "Тапочки Nike (серые)", size: "Универсальный", price: "80", quantity: null, currency: "бун", category: "Кроссовки", brand: "", img: "https://i.ibb.co/6c6ZWkjv/5-Nike.jpg" },
    { name: "Сумочка C.P. Company", size: "Универсальный", price: "25", quantity: null, currency: "бун", category: "Аксессуары", brand: "", img: "https://i.ibb.co/dwSf8h4x/6-c-p-company.jpg" },
    { name: "Футболка GloGang (белая)", size: "Универсальный", price: "55", quantity: null, currency: "бун", category: "Футболки и майки", brand: "", img: "https://i.ibb.co/vCDnjpQ2/11-Glo-Gang.jpg" },
    { name: "Футболка GloGang (фиолетовая)", size: "Универсальный", price: "55", quantity: null, currency: "бун", category: "Футболки и майки", brand: "", img: "https://i.ibb.co/xtvb8hJh/8-Glo-Gang.jpg" },
    { name: "Футболка GloGang (чёрная)", size: "Универсальный", price: "55", quantity: null, currency: "бун", category: "Футболки и майки", brand: "", img: "https://i.ibb.co/B2yyvsx9/10-Glo-Gang.jpg" },
    { name: "Polo Fred Perry (белая)", size: "L", price: "40", quantity: null, currency: "бун", category: "Футболки и майки", brand: "", img: "https://i.ibb.co/nNLdvJb8/13-Polo-Fred-Perry.jpg" },
    { name: "Polo Fred Perry (чёрное)", size: "L", price: "40", quantity: null, currency: "бун", category: "Футболки и майки", brand: "", img: "https://i.ibb.co/FLKwDdL3/14-Polo-Fred-Perry-2.png" },
    { name: "Женские ASICS", size: "40", price: "90", quantity: null, currency: "бун", category: "Аксессуары", brand: "", img: "https://i.ibb.co/GQrQZdmJ/15-ASICS.jpg" },
    { name: "Кепки LA", size: "Универсальный", price: "15", quantity: null, currency: "бун", category: "Аксессуары", brand: "", img: "https://i.ibb.co/6cf7mJ49/LA.jpg" },
    { name: "Футболка GloGang (чёрная)", size: "Универсальный", price: "55", quantity: null, currency: "бун", category: "Футболки и майки", brand: "", img: "https://i.ibb.co/39GdRGyT/9-Glo-Gang.jpg" },
    { name: "Polo Fred Perry (белая)", size: "Универсальный", price: "55", quantity: null, currency: "бун", category: "Футболки и майки", brand: "", img: "https://i.ibb.co/35pnB43X/12-Glo-Gang.jpg" },
    { name: "Polo Fred Perry (белая)", size: "Универсальный", price: "55", quantity: null, currency: "бун", category: "Футболки и майки", brand: "", img: "https://i.ibb.co/d4STskWn/7-Glo-Gang.jpg" },
    { name: "джинсы Dime (чёрные)", size: "L", price: "85", quantity: 1, currency: "бун", category: "Джинсы", brand: "", img: "https://i.ibb.co/BDBmYT4/Dimebkack-Street.jpg" }
];

// Транслитерация для safe deep-link в Telegram
function slugify(str) {
    const map = { 'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya' };
    let s = (str || '').toLowerCase().trim();
    s = s.replace(/[^a-zа-я0-9]+/g, '-');
    s = s.replace(/[\u0400-\u04ff]/g, m => map[m] || 'x');
    s = s.replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
    return s || 'item';
}

// Deep-link в бот (без токена — безопасно)
function buildBotLink(action, param) {
    const start = `${action}_${param}`.trim();
    return `https://t.me/${BOT_USERNAME}?start=${encodeURIComponent(start)}`;
}

function convertToRUB(priceBYN) {
    return Math.round(parseInt(priceBYN, 10) * BYN_TO_RUB);
}

// Сохранение выбранного товара (для страницы контактов)
function saveSelectedProduct(productName, productPrice) {
    const productData = {
        title: productName,
        description: `Цена: ${productPrice}`
    };
    localStorage.setItem('selectedProduct', JSON.stringify(productData));
    if (typeof updateContactLinks === 'function') {
        updateContactLinks();
    }
}

// Постраничность (lazy-рендер каталога)
const PAGE_SIZE = 6;
let visibleCount = PAGE_SIZE;

// Генерация карточек товаров (только текущая страница)
function loadProducts() {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    grid.innerHTML = "";

    items.slice(0, visibleCount).forEach((product, index) => {
        const priceInRub = convertToRUB(product.price);
        const formattedPrice = priceInRub.toLocaleString() + " ₽";

        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-index', index);
        card.setAttribute('data-category', product.category);
        card.innerHTML = `
            <div class="img-container">
                <img src="${product.img}" alt="${product.name}" loading="lazy">
                <div class="badge">${product.brand || ''}</div>
            </div>
            <div class="info">
                <div class="category-tag">${product.category}</div>
                <h3>${product.name}</h3>
                <div class="size-info">📏 Размер: ${product.size}</div>
                <div class="price-wrapper">
                    <div class="price">${product.price} ${product.currency}</div>
                    <div class="price-hint">≈ ${formattedPrice}</div>
                </div>
                <button class="cart-add-btn" type="button">🛒 В корзину</button>
            </div>
        `;

        // Кнопка «В корзину»
        const addBtn = card.querySelector('.cart-add-btn');
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof addToCart === 'function') {
                addToCart(product.name, formattedPrice);
            }
        });

        // Скелет-плейсхолдер: проявляем картинку, когда она загрузилась
        const img = card.querySelector('img');
        if (img) {
            const reveal = () => img.classList.add('loaded');
            img.addEventListener('load', reveal);
            if (img.complete) reveal();
        }

        // Клик по карточке (не по кнопке) — модалка
        card.addEventListener('click', (e) => {
            if (e.target.closest('.cart-add-btn')) return;
            openModal(product);
        });

        grid.appendChild(card);
    });

    toggleLoadMoreButton();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card').forEach(card => observer.observe(card));
}

// Кнопка «Показать ещё»
function toggleLoadMoreButton() {
    const container = document.querySelector('main#catalog');
    let btn = document.getElementById('loadMoreBtn');

    if (visibleCount < items.length) {
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'loadMoreBtn';
            btn.className = 'load-more-btn';
            btn.type = 'button';
            btn.addEventListener('click', showMore);
            if (container) container.appendChild(btn);
        }
        btn.textContent = `Показать ещё (${items.length - visibleCount})`;
    } else if (btn) {
        btn.remove();
    }
}

// Показать ещё страницу
function showMore() {
    visibleCount = Math.min(visibleCount + PAGE_SIZE, items.length);
    loadProducts();
}

// Модальное окно
const modal = document.getElementById('productModal');
let currentProduct = null;

function openModal(product) {
    if (!modal) return;
    currentProduct = product;

    const priceInRub = convertToRUB(product.price);
    const formattedPrice = priceInRub.toLocaleString() + " ₽";

    document.getElementById('modalImg').src = product.img;
    document.getElementById('modalName').innerText = product.name;
    document.getElementById('modalCategory').innerHTML = `<span class="modal-category">${product.category}</span>`;
    document.getElementById('modalBrand').innerHTML = `<span class="modal-brand">🏷️ ${product.brand || ''}</span>`;
    document.getElementById('modalSize').innerHTML = `<span class="modal-size">📏 Размер: ${product.size}</span>`;
    document.getElementById('modalPrice').innerText = `${product.price} ${product.currency}`;
    document.getElementById('modalRubHint').innerHTML = `≈ ${formattedPrice} рублей`;

    // Кнопка «Купить в боте» — deep-link + копирование товара (в боте отправляем напрямую через sendData)
    const botBtn = document.getElementById('modalBotBtn');
    if (botBtn) {
        botBtn.href = buildBotLink('buy', slugify(product.name));
        botBtn.onclick = (e) => {
            const info = {
                title: product.name,
                brand: product.brand,
                size: product.size,
                price: `${product.price} ${product.currency}`,
                rub: formattedPrice
            };
            // Внутри Telegram Web App — отправляем товар боту напрямую
            if (tg && tg.initData) {
                e.preventDefault();
                try {
                    tg.sendData(JSON.stringify(info));
                } catch (err) {
                    window.open(botBtn.href, '_blank');
                }
                return;
            }
            // В обычном браузере — копируем товар в буфер (чтобы вставить в чат бота) + открываем deep-link
            const text = `🛍️ Хочу купить: ${info.title}\n🏷️ Бренд: ${info.brand || '—'}\n📏 Размер: ${info.size}\n💰 ${info.price} (≈ ${info.rub})`;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    showToast('📋 Товар скопирован — вставьте в чат бота');
                }).catch(() => {});
            }
        };
    }

    // Кнопка «Обсудить с менеджером»
    const discussBtn = document.getElementById('modalDiscussBtn');
    if (discussBtn) {
        // Снимаем старые обработчики через клон
        const fresh = discussBtn.cloneNode(true);
        discussBtn.parentNode.replaceChild(fresh, discussBtn);

        fresh.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (tg && tg.initData) {
                try {
                    const orderData = { title: product.name, cost: formattedPrice };
                    tg.sendData(JSON.stringify(orderData));
                } catch (err) {
                    window.open(buildBotLink('buy', slugify(product.name)), '_blank');
                }
            } else {
                saveSelectedProduct(product.name, formattedPrice);
                window.location.href = "contacts.html#contacts";
            }
        });
    }

    modal.style.display = 'flex';
}

function closeModal() {
    if (modal) modal.style.display = 'none';
}

function initModal() {
    if (!modal) return;
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });
}

// Фильтры категорий
function initFilters() {
    if (document.querySelector('.filter-bar')) return;

    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-bar';
    filterContainer.innerHTML = `
        <button class="filter-btn active" data-filter="all">Все товары</button>
        <button class="filter-btn" data-filter="Футболки и майки">Футболки</button>
        <button class="filter-btn" data-filter="Кроссовки">Кроссовки</button>
        <button class="filter-btn" data-filter="Джинсы">Джинсы</button>
    `;

    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle) sectionTitle.after(filterContainer);

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            const cards = document.querySelectorAll('.product-card');

            cards.forEach((card) => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('visible'), 10);
                } else {
                    card.style.display = 'none';
                    card.classList.remove('visible');
                }
            });
        });
    });
}

// Статистика
function showStats() {
    if (document.querySelector('.stats-bar')) return;

    const uniqueBrands = [...new Set(items.map(i => i.brand).filter(b => b && b !== ''))];
    const cheapItems = items.filter(i => parseInt(i.price, 10) < 50).length;

    const statsHTML = `
        <div class="stats-bar">
            <div class="stat-item"><span class="stat-number">${items.length}</span><span class="stat-label">товаров</span></div>
            <div class="stat-item"><span class="stat-number">${uniqueBrands.length}</span><span class="stat-label">брендов</span></div>
            <div class="stat-item"><span class="stat-number">${cheapItems}</span><span class="stat-label">до 50 бун</span></div>
        </div>
    `;

    const heroContent = document.querySelector('.hero-content');
    if (heroContent) heroContent.insertAdjacentHTML('beforeend', statsHTML);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    initModal();
    initFilters();
    showStats();
});
