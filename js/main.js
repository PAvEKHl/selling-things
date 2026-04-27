/* ========================================
   MAIN PAGE SPECIFIC - только для главной страницы
   ======================================== */

// Константа для конвертации (1 бун = 26 рублей)
const BYN_TO_RUB = 26;

// Массив товаров
const items = [
    {
        name: "Футболка Dior",
        size: "L",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
        brand: "Dior",
        img: "/images/Dior.jpg"
    },
    {
        name: "Футболка Vans (белая)",
        size: "L",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
        brand: "Vans",
        img: "/images/Vans_White.jpg"
    },
    {
        name: "Футболка Vans (чёрная)",
        size: "L",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
        brand: "Vans",
        img: "/images/Vans_Black.jpg"
    },
    {
        name: "Футболка 'RULES THE WORLD'",
        size: "L",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
        brand: "Streetwear",
        img: "/images/RULES_THE_WORL.jpg"
    },
    {
        name: "Кроссовки Lanvin",
        size: "45",
        price: "200",
        currency: "бун",
        category: "Кроссовки",
        brand: "Lanvin",
        img: "/images/Lanvin.jpg"
    },
    {
        name: "C.P. Company (белая)",
        size: "L-XL",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
        brand: "C.P. Company",
        img: "/images/C.P.Company_White.jpg"
    },
    {
        name: "C.P. Company (чёрная)",
        size: "L-XL",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
        brand: "C.P. Company",
        img: "/images/C.P.Company_Black.jpg"
    },
    {
        name: "MM6 Maison Margiela (белая)",
        size: "L",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
        brand: "MM6",
        img: "/images/Masion_Margela_Whity.jpg"
    },
    {
        name: "MM6 Maison Margiela (чёрная)",
        size: "L",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
        brand: "MM6",
        img: "/images/Masion_Margela_Black.jpg"
    },
    {
        name: "Футболка 'Цветущая сакура'",
        size: "L",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
        brand: "Artwear",
        img: "/images/sakura.jpg"
    },
    {
        name: "Джинсы Dime",
        size: "L",
        price: "90",
        currency: "бун",
        category: "Джинсы",
        brand: "Dime",
        img: "/images/Diime.jpg"
    }
];

// Функция конвертации бун в рубли
function convertToRUB(priceBYN) {
    const priceNum = parseInt(priceBYN);
    return Math.round(priceNum * BYN_TO_RUB);
}

// Функция для перенаправления на контакты
function discussPurchase(productName) {
    localStorage.setItem('selectedProduct', productName);
    window.location.href = '/contacts.html#contacts';
}

// Функция загрузки товаров
function loadProducts() {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;
    
    grid.innerHTML = "";
    
    items.forEach((product, index) => {
        const priceInRub = convertToRUB(product.price);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-index', index);
        card.setAttribute('data-category', product.category);
        card.innerHTML = `
            <div class="img-container">
                <img src="${product.img}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/500x500?text=Image+Not+Found'">
                <div class="badge">${product.brand}</div>
            </div>
            <div class="info">
                <div class="category-tag">${product.category}</div>
                <h3>${product.name}</h3>
                <div class="size-info">📏 Размер: ${product.size}</div>
                <div class="price-wrapper">
                    <div class="price">${product.price} ${product.currency}</div>
                    <div class="price-hint">≈ ${priceInRub.toLocaleString()} ₽</div>
                </div>
                <button class="discuss-btn" data-name="${product.name}">
                    💬 Обсудить покупку
                </button>
            </div>
        `;
        
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('discuss-btn')) return;
            openModal(product);
        });
        
        const btn = card.querySelector('.discuss-btn');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            discussPurchase(product.name);
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
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    
    document.querySelectorAll('.product-card').forEach(card => observer.observe(card));
}

// Модальное окно
const modal = document.getElementById('productModal');

function openModal(product) {
    if (!modal) return;
    
    const priceInRub = convertToRUB(product.price);
    const modalImg = document.getElementById('modalImg');
    const modalName = document.getElementById('modalName');
    const modalCategory = document.getElementById('modalCategory');
    const modalPrice = document.getElementById('modalPrice');
    const modalSize = document.getElementById('modalSize');
    const modalBrand = document.getElementById('modalBrand');
    const modalRubHint = document.getElementById('modalRubHint');
    
    if (modalImg) modalImg.src = product.img;
    if (modalName) modalName.innerText = product.name;
    if (modalCategory) modalCategory.innerHTML = `<span class="modal-category">${product.category}</span>`;
    if (modalBrand) modalBrand.innerHTML = `<span class="modal-brand">🏷️ ${product.brand}</span>`;
    if (modalSize) modalSize.innerHTML = `<span class="modal-size">📏 Размер: ${product.size}</span>`;
    if (modalPrice) modalPrice.innerText = `${product.price} ${product.currency}`;
    if (modalRubHint) modalRubHint.innerHTML = `≈ ${priceInRub.toLocaleString()} рублей`;
    
    modal.style.display = 'flex';
}

function initModal() {
    if (!modal) return;
    
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

// Фильтрация
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
    
    const catalogSection = document.querySelector('#catalog');
    const sectionTitle = document.querySelector('.section-title');
    if (catalogSection && sectionTitle) {
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
    
    const uniqueBrands = [...new Set(items.map(i => i.brand))];
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

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    initModal();
    initFilters();
    showStats();
    
    console.log('✅ Главная страница загружена');
    console.log(`📦 Товаров в каталоге: ${items.length}`);
    console.log(`💱 Курс: 1 бун = ${BYN_TO_RUB} ₽`);
});