/* ========================================
   MAIN PAGE SPECIFIC - только для главной страницы
   ======================================== */

const BYN_TO_RUB = 26;

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
        name: "Футболка Adidas",
        size: "L",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
        brand: "Adidas",
        img: "images/adidas T-shirt.jpg"
    },
    {
        name: "худи с сердцем(серое)",
        size: "L",
        price: "40",
        currency: "бун",
        category: "Футболки и майки",
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
    {
        name: "Джинсы Dime",
        size: "L",
        price: "90",
        currency: "бун",
        category: "Джинсы",
        brand: "Dime",
        img: "images/Diime.jpg"
    }
];

function convertToRUB(priceBYN) {
    const priceNum = parseInt(priceBYN);
    return Math.round(priceNum * BYN_TO_RUB);
}

function discussPurchase(productName) {
    localStorage.setItem('selectedProduct', productName);
    window.location.href = 'contacts.html#contacts';
}

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
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.product-card').forEach(card => observer.observe(card));
}

const modal = document.getElementById('productModal');

function openModal(product) {
    if (!modal) return;
    
    const priceInRub = convertToRUB(product.price);
    document.getElementById('modalImg').src = product.img;
    document.getElementById('modalName').innerText = product.name;
    document.getElementById('modalCategory').innerHTML = `<span class="modal-category">${product.category}</span>`;
    document.getElementById('modalBrand').innerHTML = `<span class="modal-brand">🏷️ ${product.brand}</span>`;
    document.getElementById('modalSize').innerHTML = `<span class="modal-size">📏 Размер: ${product.size}</span>`;
    document.getElementById('modalPrice').innerText = `${product.price} ${product.currency}`;
    document.getElementById('modalRubHint').innerHTML = `≈ ${priceInRub.toLocaleString()} рублей`;
    
    modal.style.display = 'flex';
}

function initModal() {
    if (!modal) return;
    
    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

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

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    initModal();
    initFilters();
    showStats();
    console.log('✅ Главная страница загружена');
});
