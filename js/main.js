/* ==========================================================================
   MAIN PAGE SPECIFIC - Каталог, фильтры и модальное окно (main.js)
   ========================================================================== */

const BYN_TO_RUB = 26;

// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;

if (tg.initData) {
    document.body.classList.add('telegram-view');
}

// Массив товаров
const items = [
    { name: "Футболка Dior", size: "L", price: "40", currency: "бун", category: "Футболки и майки", brand: "Dior", img: "images/Dior.jpg" },
    { name: "худи с сердцем(серое)", size: "L", price: "90", currency: "бун", category: "Футболки и майки", brand: "", img: "images/hoodie grey.jpg" },
    { name: "Кроссовки Lanvin", size: "42", price: "155", currency: "бун", category: "Кроссовки", brand: "Lanvin", img: "images/Lanvin.jpg" },
    { name: "C.P. Company (белая)", size: "L-XL", price: "40", currency: "бун", category: "Футболки и майки", brand: "C.P. Company", img: "images/C.P.Company_White.jpg" },
    { name: "C.P. Company (чёрная)", size: "L-XL", price: "40", currency: "бун", category: "Футболки и майки", brand: "C.P. Company", img: "images/C.P.Company_Black.jpg" },
    { name: "MM6 Maison Margiela (чёрная)", size: "L", price: "40", currency: "бун", category: "Футболки и майки", brand: "MM6", img: "images/Masion_Margela_Black.jpg" },
    { name: "Футболка 'Цветущая сакура'", size: "L", price: "40", currency: "бун", category: "Футболки и майки", brand: "Artwear", img: "images/sakura.jpg" },
    { name: "Джинсы Dime", size: "L", price: "85", currency: "бун", category: "Джинсы", brand: "Dime", img: "images/Diime.jpg" },
];

function convertToRUB(priceBYN) {
    return Math.round(parseInt(priceBYN) * BYN_TO_RUB);
}

// Вспомогательная функция для сохранения выбранного товара
function saveSelectedProduct(productName, productPrice) {
    const productData = {
        title: productName,
        description: `Цена: ${productPrice}`
    };
    localStorage.setItem('selectedProduct', JSON.stringify(productData));
    
    // Вызываем функцию обновления ссылок из global.js, если она доступна
    if (typeof updateContactLinks === 'function') {
        updateContactLinks();
    }
}

// Генерация карточек товаров
function loadProducts() {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;
    
    grid.innerHTML = "";
    
    items.forEach((product, index) => {
        const priceInRub = convertToRUB(product.price);
        const formattedPrice = priceInRub.toLocaleString() + " ₽";
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-index', index);
        card.setAttribute('data-category', product.category);
        card.innerHTML = `
            <div class="img-container">
                <img src="${product.img}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/500x500?text=Image+Not+Found'">
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
                <button class="discuss-btn">
                    💬 Обсудить покупку
                </button>
            </div>
        `;
        
        // НАДЕЖНЫЙ КЛИК ПО КНОПКЕ «ОБСУДИТЬ ПОКУПКУ» НА КАРТОЧКЕ
        const btn = card.querySelector('.discuss-btn');
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); 
            
            if (tg.initData) {
                // Если в Telegram WebApp
                const orderData = { title: product.name, cost: formattedPrice };
                tg.sendData(JSON.stringify(orderData));
            } else {
                // Если в обычном браузере — сохраняем и ПЕРЕНАПРАВЛЯЕМ на страницу контактов
                saveSelectedProduct(product.name, formattedPrice);
                window.location.href = "contacts.html#contacts";
            }
        });

        // КЛИК ПО САМОЙ КАРТОЧКЕ (ОТКРЫТИЕ МОДАЛКИ)
        card.addEventListener('click', (e) => {
            if (e.target.closest('.discuss-btn')) return;
            openModal(product);
        });
        
        grid.appendChild(card);
    });
    
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

// Управление модальным окном
const modal = document.getElementById('productModal');

function openModal(product) {
    if (!modal) return;
    
    const priceInRub = convertToRUB(product.price);
    const formattedPrice = priceInRub.toLocaleString() + " ₽";
    
    // Заполнение данных в модалке
    document.getElementById('modalImg').src = product.img;
    document.getElementById('modalName').innerText = product.name;
    document.getElementById('modalCategory').innerHTML = `<span class="modal-category">${product.category}</span>`;
    document.getElementById('modalBrand').innerHTML = `<span class="modal-brand">🏷️ ${product.brand || ''}</span>`;
    document.getElementById('modalSize').innerHTML = `<span class="modal-size">📏 Размер: ${product.size}</span>`;
    document.getElementById('modalPrice').innerText = `${product.price} ${product.currency}`;
    document.getElementById('modalRubHint').innerHTML = `≈ ${formattedPrice} рублей`;
    
    let modalContactBtn = modal.querySelector('.modal-contact-btn') || modal.querySelector('.discuss-btn');
    
    if (modalContactBtn) {
        // Очищаем старые обработчики клика
        const newBtn = modalContactBtn.cloneNode(true);
        modalContactBtn.parentNode.replaceChild(newBtn, modalContactBtn);
        
        const messageText = `Привет! Хочу купить товар:\n📦 Название: ${product.name}\n📝 Цена: ${formattedPrice}`;
        const encodedText = encodeURIComponent(messageText);
        
        if (tg.initData) {
            newBtn.innerText = "💬 Обсудить покупку";
            newBtn.href = "#";
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                    const orderData = { title: product.name, cost: formattedPrice };
                    tg.sendData(JSON.stringify(orderData));
                } catch (error) {
                    // Аварийный переход в ТГ Павла, если sendData недоступен
                    window.location.href = `https://t.me/PavelHlebko?text=${encodedText}`;
                }
            });
        } else {
            // В обычном браузере кнопка модалки просто редиректит на контакты
            newBtn.innerText = "📞 Связаться для покупки";
            newBtn.href = "contacts.html#contacts";
            newBtn.addEventListener('click', () => {
                saveSelectedProduct(product.name, formattedPrice);
                modal.style.display = 'none';
            });
        }
    }
    
    modal.style.display = 'flex';
}

function initModal() {
    if (!modal) return;
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    }
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
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
    if (sectionTitle) {
        sectionTitle.after(filterContainer);
    }
    
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
    const cheapItems = items.filter(i => parseInt(i.price) < 50).length;
    
    const statsHTML = `
        <div class="stats-bar">
            <div class="stat-item"><span class="stat-number">${items.length}</span><span class="stat-label">товаров</span></div>
            <div class="stat-item"><span class="stat-number">${uniqueBrands.length}</span><span class="stat-label">брендов</span></div>
            <div class="stat-item"><span class="stat-number">${cheapItems}</span><span class="stat-label">до 50 бун</span></div>
        </div>
    `;
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.insertAdjacentHTML('beforeend', statsHTML);
    }
}

// Инициализация скриптов главной страницы
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    initModal();
    initFilters();
    showStats();
    
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => { item.classList.toggle('active'); });
        }
    });
});
