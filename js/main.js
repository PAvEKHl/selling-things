/* ==========================================================================
   MAIN PAGE SPECIFIC & CONTACTS LOGIC — PHOENIX WEAR
   ========================================================================== */

const BYN_TO_RUB = 26;

// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;

// Если открыто внутри Telegram, добавляем класс для скрытия лишних блоков
if (tg.initData) {
    document.body.classList.add('telegram-view');
}

// Массив товаров каталога
const items = [
    {
        name: "Футболка Dior",
        size: "L",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
        brand: "Dior",
        img: "images/Dior.jpg"
    },
    {
        name: "худи с сердцем(серое)",
        size: "L",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
        brand: "",
        img: "images/hoodie grey.jpg"
    },
    {
        name: "Футболка Vans (чёрная)",
        size: "L",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
        brand: "Vans",
        img: "images/Vans_Black.jpg"
    },
    {
        name: "Кроссовки Lanvin",
        size: "42",
        price: "200",
        currency: "бун",
        category: "Кроссовки",
        brand: "Lanvin",
        img: "images/Lanvin.jpg"
    },
    {
        name: "C.P. Company (белая)",
        size: "L-XL",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
        brand: "C.P. Company",
        img: "images/C.P.Company_White.jpg"
    },
    {
        name: "C.P. Company (чёрная)",
        size: "L-XL",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
        brand: "C.P. Company",
        img: "images/C.P.Company_Black.jpg"
    },
    {
        name: "MM6 Maison Margiela (белая)",
        size: "L",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
        brand: "MM6",
        img: "images/Masion_Margela_Whity.jpg"
    },
    {
        name: "MM6 Maison Margiela (чёрная)",
        size: "L",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
        brand: "MM6",
        img: "images/Masion_Margela_Black.jpg"
    },
    {
        name: "Футболка 'Цветущая сакура'",
        size: "L",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
        brand: "Artwear",
        img: "images/sakura.jpg"
    },
    {
        name: "Джинсы Dime",
        size: "L",
        price: "85",
        currency: "бун",
        category: "Джинсы",
        brand: "Dime",
        img: "images/Diime.jpg"
    },
    {
        name: "Джинсы Dime",
        size: "L",
        price: "85",
        currency: "бун",
        category: "Джинсы",
        brand: "Dime",
        img: "images/JeansDimeWhite.jpg"
    },
];

// Конвертер валюты
function convertToRUB(priceBYN) {
    const priceNum = parseInt(priceBYN);
    return Math.round(priceNum * BYN_TO_RUB);
}

// Функция перехода на страницу контактов со строгим сохранением структуры JSON-объекта
function discussPurchase(productName, productPrice) {
    const productData = {
        title: productName,
        description: `Цена: ${productPrice}`
    };
    localStorage.setItem('selectedProduct', JSON.stringify(productData));
    window.location.href = 'contacts.html#contacts';
}

// Генерация карточек товаров на главной странице
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
                <button class="discuss-btn" data-name="${product.name}" data-price="${formattedPrice}">
                    💬 Обсудить покупку
                </button>
            </div>
        `;
        
        // Клик по самой карточке открывает модалку
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('discuss-btn')) return;
            openModal(product);
        });
        
        // Клик по кнопке «Обсудить покупку»
        const btn = card.querySelector('.discuss-btn');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (tg.initData) {
                // Если внутри Telegram WebApp — шлем данные боту
                const orderData = {
                    title: product.name,
                    cost: formattedPrice
                };
                tg.sendData(JSON.stringify(orderData));
            } else {
                // Если в обычном браузере — сохраняем инфу и редиректим
                discussPurchase(product.name, formattedPrice);
            }
        });
        
        grid.appendChild(card);
    });
    
    // Анимация плавного появления карточек при скролле (IntersectionObserver)
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

// Работа с модальным окном
const modal = document.getElementById('productModal');

function openModal(product) {
    if (!modal) return;
    
    const priceInRub = convertToRUB(product.price);
    const formattedPrice = priceInRub.toLocaleString() + " ₽";
    
    document.getElementById('modalImg').src = product.img;
    document.getElementById('modalName').innerText = product.name;
    document.getElementById('modalCategory').innerHTML = `<span class="modal-category">${product.category}</span>`;
    document.getElementById('modalBrand').innerHTML = `<span class="modal-brand">🏷️ ${product.brand || ''}</span>`;
    document.getElementById('modalSize').innerHTML = `<span class="modal-size">📏 Размер: ${product.size}</span>`;
    document.getElementById('modalPrice').innerText = `${product.price} ${product.currency}`;
    document.getElementById('modalRubHint').innerHTML = `≈ ${formattedPrice} рублей`;
    
    // Находим контейнер, где лежит кнопка/кнопки связи в модальном окне
    const modalContactBtn = modal.querySelector('.modal-contact-btn');
    
    if (modalContactBtn) {
        // Формируем текст сообщения для Telegram лички
        const messageText = `Привет! Хочу купить товар:\n📦 Название: ${product.name}\n📝 Цена: ${formattedPrice}`;
        const encodedText = encodeURIComponent(messageText);

        if (tg.initData) {
            // ЕСЛИ ВНУТРИ ТЕЛЕГРАМА: Оставляем одну кнопку отправки данных в бот
            modalContactBtn.outerHTML = `
                <button class="modal-contact-btn custom-modal-btn default-btn" style="width: 100%;">
                    💬 Обсудить покупку в боте
                </button>
            `;
            
            modal.querySelector('.modal-contact-btn').addEventListener('click', (e) => {
                e.preventDefault();
                const orderData = {
                    title: product.name,
                    cost: formattedPrice
                };
                tg.sendData(JSON.stringify(orderData));
            });
        } else {
            // ЕСЛИ В ОБЫЧНОМ БРАУЗЕРЕ: Выводим полноценный выбор менеджера со всеми ссылками и телефонами!
            // Используем твои родные CSS-классы, чтобы дизайн идеально вписался в стили сайта
            modalContactBtn.outerHTML = `
                <div class="modal-managers-block" style="margin-top: 20px; display: flex; flex-direction: column; gap: 15px; width: 100%;">
                    
                    <div class="modal-manager-card" style="border-top: 1px solid rgba(255,0,255,0.2); padding-top: 10px;">
                        <h4 style="margin-bottom: 8px; color: #fff; font-size: 0.95rem; text-align: left;">👨‍💼 Написать или позвонить Даниилу:</h4>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <a href="https://t.me/Kamelot709?text=${encodedText}" class="contact-btn telegram" target="_blank" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.8rem;">
                                📱 @Kamelot709
                            </a>
                            <a href="tel:+375296293264" class="contact-btn phone" target="_blank" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.8rem;">
                                📞 +375 29 629 32 64
                            </a>
                        </div>
                    </div>

                    <div class="modal-manager-card" style="border-top: 1px solid rgba(255,0,255,0.2); padding-top: 10px;">
                        <h4 style="margin-bottom: 8px; color: #fff; font-size: 0.95rem; text-align: left;">👨‍💻 Написать или позвонить Павлу:</h4>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <a href="https://t.me/PavelHlebko?text=${encodedText}" class="contact-btn telegram" target="_blank" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.8rem;">
                                📱 @PavelHlebko
                            </a>
                            <a href="tel:+375336621641" class="contact-btn phone" target="_blank" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.8rem;">
                                📞 +375 33 662 16 41
                            </a>
                        </div>
                    </div>

                </div>
            `;
        }
    }
    
    modal.style.display = 'flex';
}

function initModal() {
    if (!modal) return;
    
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

// Фильтрация товаров каталога
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

// Статистика магазина в Hero-блок
function showStats() {
    if (document.querySelector('.stats-bar')) return;
    
    const uniqueBrands = [...new Set(items.map(i => i.brand).filter(b => b && b !== ''))];
    const cheapItems = items.filter(i => parseInt(i.price) < 50).length;
    
    const statsHTML = `
        <div class="stats-bar">
            <div class="stat-item">
                <span class="stat-number">${items.length}</span>
                <span class="stat-label">товаров</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${uniqueBrands.length}</span>
                <span class="stat-label">брендов</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${cheapItems}</span>
                <span class="stat-label">до 50 бун</span>
            </div>
        </div>
    `;
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.insertAdjacentHTML('beforeend', statsHTML);
    }
}

// БЕЗОПАСНОЕ ДИНАМИЧЕСКОЕ ОБНОВЛЕНИЕ ССЫЛОК TELEGRAM (Для contacts.html)
// Ищет элементы по классам стилей, не нарушая верстку и селекторы CSS
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
                
                // Проверяем изначальный href, чтобы понять, чья это кнопка, и не перепутать лички
                if (currentHref && currentHref.includes('Kamelot709')) {
                    btn.href = `https://t.me/Kamelot709?text=${encodedText}`;
                } else if (currentHref && currentHref.includes('PavelHlebko')) {
                    btn.href = `https://t.me/PavelHlebko?text=${encodedText}`;
                }
            });
        } catch (e) {
            console.error("Ошибка парсинга данных о выбранном товаре из localStorage:", e);
        }
    }
}

// Главный инициализатор скриптов при полной сборке DOM дерева
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация элементов главной страницы (если они присутствуют в DOM)
    loadProducts();
    initModal();
    initFilters();
    showStats();
    
    // Попытка обновления контактов (сработает на странице contacts.html)
    updateContactLinks();
    
    // Инициализация выпадающих списков FAQ (чтобы они корректно работали)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        }
    });

    console.log('✅ Инициализация скриптов магазина Phoenix Wear успешно завершена.');
});
