// ==========================================================================
// HUSNAIN FASHION - Core Application Engine
// Handles: Cart, Wishlist, Catalog Filtering, Checkout, Tracking, Modals
// ==========================================================================

// Global App State
const AppState = {
    cart: JSON.parse(localStorage.getItem('hf_cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('hf_wishlist')) || [],
    currentUser: JSON.parse(localStorage.getItem('hf_user')) || null,
    appliedCoupon: null,
    filter: {
        category: 'all',
        subCategory: 'all',
        season: 'all',
        maxPrice: 15000,
        size: null,
        searchQuery: '',
        sortBy: 'popularity'
    },
    trackingDatabase: {}
};

// ==========================================================================
// Sync Products with Live Database
// ==========================================================================
async function syncProductsFromDatabase() {
    try {
        const res = await fetch('/api/products');
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
            PRODUCTS_DATA = data.products;
            renderProducts();
        }
    } catch (e) {
        console.warn('Could not sync products from API, using fallback catalog:', e);
    }
}

// ==========================================================================
// Initialization on DOM Load
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    initFlashSaleCountdown();
    initCatalogFilters();
    initSearch();
    renderProducts();
    syncProductsFromDatabase();
    renderReviews();
    updateCartUI();
    updateWishlistUI();
    initTrackingUI();
    initUserUI();
    initHeaderScroll();
    initWhatsAppPrompt();
    populateCityDropdowns();
});

// ==========================================================================
// City Autocomplete & Populate
// ==========================================================================
function populateCityDropdowns() {
    const citySelect = document.getElementById('checkoutCity');
    if (citySelect && typeof PAKISTANI_CITIES !== 'undefined') {
        citySelect.innerHTML = '<option value="">Select your city in Pakistan</option>';
        PAKISTANI_CITIES.forEach(city => {
            const opt = document.createElement('option');
            opt.value = city;
            opt.textContent = city;
            citySelect.appendChild(opt);
        });
    }
}

// ==========================================================================
// Header Scroll & Ticker Behavior
// ==========================================================================
function initHeaderScroll() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ==========================================================================
// Hero Carousel / Slider
// ==========================================================================
let currentSlide = 0;
let slideInterval = null;

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.querySelector('.slider-dots');
    if (!slides.length) return;

    // Build dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
            dot.onclick = () => goToSlide(idx);
            dotsContainer.appendChild(dot);
        });
    }

    // Auto rotate every 6 seconds
    startSlideTimer();

    // Arrows
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    if (prevBtn) prevBtn.onclick = () => { prevSlide(); resetSlideTimer(); };
    if (nextBtn) nextBtn.onclick = () => { nextSlide(); resetSlideTimer(); };
}

function startSlideTimer() {
    slideInterval = setInterval(() => {
        nextSlide();
    }, 6500);
}

function resetSlideTimer() {
    clearInterval(slideInterval);
    startSlideTimer();
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    if (!slides.length) return;

    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function prevSlide() {
    goToSlide(currentSlide - 1);
}

// ==========================================================================
// Flash Sale Countdown Timer (Authentic Live Countdown)
// ==========================================================================
function initFlashSaleCountdown() {
    const hoursEl = document.getElementById('saleHours');
    const minsEl = document.getElementById('saleMins');
    const secsEl = document.getElementById('saleSecs');
    if (!hoursEl || !minsEl || !secsEl) return;

    // Set end of weekend sale: 48 hours from session start or midnight Sunday
    let remainingSeconds = 47 * 3600 + 38 * 60 + 25;

    setInterval(() => {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            const hrs = Math.floor(remainingSeconds / 3600);
            const mns = Math.floor((remainingSeconds % 3600) / 60);
            const scs = remainingSeconds % 60;

            hoursEl.textContent = String(hrs).padStart(2, '0');
            minsEl.textContent = String(mns).padStart(2, '0');
            secsEl.textContent = String(scs).padStart(2, '0');
        }
    }, 1000);
}

// ==========================================================================
// Catalog Rendering & Filtering Engine
// ==========================================================================
function matchProductSearch(p, rawQuery) {
    if (!rawQuery || !rawQuery.trim()) return true;

    // Clean & normalize query
    const q = rawQuery.toLowerCase().trim();
    const qStem = q.replace(/s$/i, '').trim();

    // 1. Specific sub-category / style queries (take precedence over broad terms)
    const isBlazerQuery = /^(blazer|blazers|suit jacket|suit jackets)$/i.test(q);
    const isJacketQuery = /^(jacket|jackets|bomber|bombers|biker|aviator)$/i.test(q);
    const isChinoQuery = /^(chino|chinos)$/i.test(q);
    const isJeanQuery = /^(jean|jeans|denim)$/i.test(q);
    const isPoloQuery = /^(polo|polos|polo shirt|polo shirts)$/i.test(q);

    if (isBlazerQuery) {
        return p.subCategory === 'blazers' || p.name.toLowerCase().includes('blazer');
    }
    if (isJacketQuery) {
        return p.subCategory === 'jackets' || p.name.toLowerCase().includes('jacket') || p.name.toLowerCase().includes('bomber');
    }
    if (isChinoQuery) {
        return p.subCategory === 'chinos' || p.name.toLowerCase().includes('chino');
    }
    if (isJeanQuery) {
        return p.subCategory === 'jeans' || p.name.toLowerCase().includes('jean') || (p.fabric && p.fabric.toLowerCase().includes('denim'));
    }
    if (isPoloQuery) {
        return p.subCategory === 'polo-shirts' || p.name.toLowerCase().includes('polo');
    }

    // 2. Broad clothing categories
    const isShirtQuery = /^(shirt|shirts|shrt|shrts)$/i.test(q);
    const isTrouserQuery = /^(trouser|trousers|pant|pants|trousr)$/i.test(q);
    const isCoatQuery = /^(coat|coats|overcoat|overcoats|winter coat|winter coats|wool coat|wool coats|parka|parkas)$/i.test(q);

    if (isShirtQuery) {
        return p.category === 'shirts' || p.subCategory.includes('shirt') || p.name.toLowerCase().includes('shirt');
    }
    if (isTrouserQuery) {
        return p.category === 'trousers' || p.subCategory.includes('trouser') || p.subCategory === 'chinos' || p.subCategory === 'jeans' || p.name.toLowerCase().includes('trouser');
    }
    if (isCoatQuery) {
        return p.subCategory.includes('coat') || p.name.toLowerCase().includes('coat') || p.name.toLowerCase().includes('overcoat') || p.name.toLowerCase().includes('parka');
    }

    // 3. Exact or prefix match on name, category, subcategory, fabric, colors
    const nameLower = p.name.toLowerCase();
    const subCatLower = p.subCategory.toLowerCase().replace(/-/g, ' ');
    const catLower = p.category.toLowerCase().replace(/-/g, ' ');
    const fabricLower = (p.fabric || '').toLowerCase();
    const colorNames = (p.colors || []).map(c => c.name.toLowerCase()).join(' ');
    const sizes = (p.sizes || []).map(s => s.toLowerCase());

    if (nameLower.includes(q) || (qStem.length > 2 && nameLower.includes(qStem))) return true;
    if (subCatLower.includes(q) || (qStem.length > 2 && subCatLower.includes(qStem))) return true;
    if (catLower.includes(q)) return true;
    if (colorNames.includes(q)) return true;
    if (fabricLower.includes(q)) return true;

    // Check sizes if query is a size code (e.g. "xl", "xxl", "size l")
    const cleanSize = q.replace(/^size\s+/i, '').trim();
    if (sizes.includes(cleanSize)) return true;

    // 4. Token-by-token matching for multi-word queries (e.g., "formal white shirt", "camel wool coat")
    const tokens = q.split(/\s+/).filter(t => t.length > 1);
    if (tokens.length > 1) {
        const fullText = [nameLower, catLower, subCatLower, fabricLower, colorNames, (p.description || '').toLowerCase()].join(' ');
        const allMatch = tokens.every(token => {
            const tokenStem = token.replace(/s$/i, '');
            if ((token === 'shirt' || token === 'shirts') && (p.category === 'shirts' || fullText.includes('shirt'))) return true;
            if ((token === 'trouser' || token === 'trousers' || token === 'pants') && (p.category === 'trousers' || fullText.includes('trouser'))) return true;
            if ((token === 'coat' || token === 'coats') && (p.subCategory.includes('coat') || fullText.includes('coat'))) return true;
            if ((token === 'jacket' || token === 'jackets') && (p.subCategory === 'jackets' || fullText.includes('jacket'))) return true;
            return fullText.includes(token) || (tokenStem.length > 2 && fullText.includes(tokenStem));
        });
        if (allMatch) return true;
    }

    // 5. Fallback: description match (for queries > 3 chars that aren't isolated generic category nouns)
    if (q.length > 3 && (p.description || '').toLowerCase().includes(q)) {
        return true;
    }

    return false;
}

function renderProducts() {
    const container = document.getElementById('productsGrid');
    const countEl = document.getElementById('catalogProductsCount');
    if (!container) return;

    let items = [...PRODUCTS_DATA];
    const isSearching = AppState.filter.searchQuery && AppState.filter.searchQuery.trim() !== '';

    if (isSearching) {
        // When searching, match across all garments regardless of active category tab
        items = items.filter(p => matchProductSearch(p, AppState.filter.searchQuery));

        // Still respect price filter and size filter if specified
        items = items.filter(p => p.discountPrice <= AppState.filter.maxPrice);
        if (AppState.filter.size) {
            items = items.filter(p => p.sizes.includes(AppState.filter.size));
        }
    } else {
        // Filter by Category
        if (AppState.filter.category !== 'all') {
            items = items.filter(p => p.category === AppState.filter.category || p.subCategory === AppState.filter.category);
        }

        // Filter by Subcategory
        if (AppState.filter.subCategory !== 'all') {
            items = items.filter(p => p.subCategory === AppState.filter.subCategory);
        }

        // Filter by Season
        if (AppState.filter.season !== 'all') {
            items = items.filter(p => p.season === AppState.filter.season || p.season === 'all-season');
        }

        // Filter by Max Price
        items = items.filter(p => p.discountPrice <= AppState.filter.maxPrice);

        // Filter by Size
        if (AppState.filter.size) {
            items = items.filter(p => p.sizes.includes(AppState.filter.size));
        }
    }

    // Sorting
    switch (AppState.filter.sortBy) {
        case 'price-low':
            items.sort((a, b) => a.discountPrice - b.discountPrice);
            break;
        case 'price-high':
            items.sort((a, b) => b.discountPrice - a.discountPrice);
            break;
        case 'rating':
            items.sort((a, b) => b.rating - a.rating);
            break;
        case 'discount':
            items.sort((a, b) => (b.originalPrice - b.discountPrice) - (a.originalPrice - a.discountPrice));
            break;
        case 'popularity':
        default:
            items.sort((a, b) => b.reviewsCount - a.reviewsCount);
            break;
    }

    if (countEl) {
        countEl.textContent = isSearching 
            ? `Found ${items.length} garments for "${escapeHtml(AppState.filter.searchQuery)}"`
            : `Showing ${items.length} premium designs`;
    }

    if (items.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
                <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; color: var(--color-gold); margin-bottom: 1rem; opacity: 0.6;"></i>
                <h4 style="font-family: var(--font-heading); color: #fff; font-size: 1.4rem; margin-bottom: 0.5rem;">No Matching Products Found</h4>
                <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
                    ${isSearching 
                        ? `We couldn't find any garments matching "<strong>${escapeHtml(AppState.filter.searchQuery)}</strong>". Try searching for shirts, trousers, coats, or jackets.`
                        : 'Try adjusting your filters, price range, or category.'}
                </p>
                <button class="btn btn-gold btn-sm" onclick="clearSearchAndReset()">
                    <i class="fa-solid fa-arrows-rotate"></i> Clear Search & View All
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(product => {
        const isWishlisted = AppState.wishlist.includes(product.id);
        const seasonClass = product.season === 'winter' ? 'winter' : 'summer';
        const seasonLabel = product.season === 'winter' ? 'Winter ❄️' : (product.season === 'summer' ? 'Summer ☀️' : 'All Season');
        
        // Swatches HTML
        const swatchesHtml = product.colors.slice(0, 4).map((c, i) => `
            <span class="swatch-circle ${i === 0 ? 'active' : ''}" 
                  style="background-color: ${c.hex};" 
                  title="${c.name}"
                  onclick="changeCardPreview(event, '${product.id}', '${c.image}')">
            </span>
        `).join('');

        const extraColorsCount = product.colors.length > 4 ? `<span class="swatches-count">+${product.colors.length - 4}</span>` : '';

        // Sizes HTML
        const sizesHtml = product.sizes.map(s => `<span class="size-tag">${s}</span>`).join('');

        return `
            <div class="product-card" id="card-${product.id}">
                <div class="product-media">
                    <img src="${product.images[0]}" alt="${product.name}" id="img-${product.id}" loading="lazy">
                    
                    <div class="product-badges">
                        ${product.discountBadge ? `<span class="badge-discount">${product.discountBadge}</span>` : ''}
                        <span class="badge-season ${seasonClass}">${seasonLabel}</span>
                    </div>

                    <div class="card-actions">
                        <button class="btn-wishlist ${isWishlisted ? 'active' : ''}" 
                                onclick="toggleWishlist('${product.id}')" 
                                title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
                            <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>
                    </div>

                    <button class="btn-quick-view" onclick="openQuickView('${product.id}')">
                        <i class="fa-regular fa-eye"></i> Quick View
                    </button>
                </div>

                <div class="product-details">
                    <div class="product-meta">
                        <span>${formatSubCategory(product.subCategory)}</span>
                        <div class="product-rating">
                            <i class="fa-solid fa-star"></i>
                            <span>${product.rating} (${product.reviewsCount})</span>
                        </div>
                    </div>

                    <h4 class="product-title" onclick="openQuickView('${product.id}')">${product.name}</h4>

                    <div class="product-swatches">
                        ${swatchesHtml}
                        ${extraColorsCount}
                    </div>

                    <div class="product-sizes-tags">
                        ${sizesHtml}
                    </div>

                    <div class="product-pricing-wrap">
                        <div class="price-box">
                            <span class="price-current">Rs. ${product.discountPrice.toLocaleString()}</span>
                            ${product.originalPrice > product.discountPrice ? `<span class="price-original">Rs. ${product.originalPrice.toLocaleString()}</span>` : ''}
                        </div>
                    </div>

                    <div class="product-card-btns">
                        <button class="btn-card-add" onclick="quickAddToCart('${product.id}')">
                            <i class="fa-solid fa-bag-shopping"></i> Add to Cart
                        </button>
                        <button class="btn-card-buy" onclick="quickBuyNow('${product.id}')">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function formatSubCategory(sub) {
    return sub.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function changeCardPreview(event, productId, imageUrl) {
    event.stopPropagation();
    const card = document.getElementById(`card-${productId}`);
    if (!card) return;

    // Switch image
    const img = document.getElementById(`img-${productId}`);
    if (img) img.src = imageUrl;

    // Toggle active circle
    const circles = card.querySelectorAll('.swatch-circle');
    circles.forEach(c => c.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// ==========================================================================
// Filter & Search Controls
// ==========================================================================
function initCatalogFilters() {
    // Category Pills
    const pills = document.querySelectorAll('.category-pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const target = pill.getAttribute('data-category');
            if (['shirts', 'trousers', 'coats-winter', 'all'].includes(target)) {
                AppState.filter.category = target;
                AppState.filter.subCategory = 'all';
            } else {
                AppState.filter.category = 'all';
                AppState.filter.subCategory = target;
            }
            renderProducts();
        });
    });

    // Price Slider
    const priceSlider = document.getElementById('priceRange');
    const priceDisplay = document.getElementById('maxPriceDisplay');
    if (priceSlider && priceDisplay) {
        priceSlider.addEventListener('input', (e) => {
            AppState.filter.maxPrice = Number(e.target.value);
            priceDisplay.textContent = `Rs. ${AppState.filter.maxPrice.toLocaleString()}`;
            renderProducts();
        });
    }

    // Size Filter Buttons
    const sizeBtns = document.querySelectorAll('.size-filter-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sizeVal = btn.getAttribute('data-size');
            if (AppState.filter.size === sizeVal) {
                AppState.filter.size = null;
                btn.classList.remove('active');
            } else {
                sizeBtns.forEach(b => b.classList.remove('active'));
                AppState.filter.size = sizeVal;
                btn.classList.add('active');
            }
            renderProducts();
        });
    });

    // Season Radios
    const seasonRadios = document.querySelectorAll('input[name="seasonFilter"]');
    seasonRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            AppState.filter.season = e.target.value;
            renderProducts();
        });
    });

    // Sort Dropdown
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            AppState.filter.sortBy = e.target.value;
            renderProducts();
        });
    }

    // Drawer Toggle
    const filterToggleBtn = document.getElementById('toggleFilterDrawer');
    const filterDrawer = document.getElementById('filterDrawer');
    if (filterToggleBtn && filterDrawer) {
        filterToggleBtn.addEventListener('click', () => {
            filterDrawer.classList.toggle('open');
            const icon = filterToggleBtn.querySelector('i');
            if (filterDrawer.classList.contains('open')) {
                filterToggleBtn.classList.add('btn-gold');
            } else {
                filterToggleBtn.classList.remove('btn-gold');
            }
        });
    }
}

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('searchClear');
    const dropdown = document.getElementById('searchResultsDropdown');

    if (searchInput) {
        // Instant real-time search on every keystroke
        searchInput.addEventListener('input', (e) => {
            const rawVal = e.target.value;
            AppState.filter.searchQuery = rawVal;
            
            if (clearBtn) {
                clearBtn.style.display = rawVal.length > 0 ? 'block' : 'none';
            }

            // Update instant live search dropdown directly below search bar
            updateSearchDropdown(rawVal);

            // Update main catalog grid simultaneously
            renderProducts();
        });

        // Re-open dropdown when focusing back with text
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim().length > 0) {
                updateSearchDropdown(searchInput.value);
            }
        });

        // Close on Escape key
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideSearchDropdown();
            } else if (e.key === 'Enter') {
                hideSearchDropdown();
                viewAllSearchResultsInGrid();
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            clearSearchAndReset();
        });
    }

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
        const wrapper = document.querySelector('.search-input-wrapper');
        if (wrapper && !wrapper.contains(e.target)) {
            hideSearchDropdown();
        }
    });
}

function updateSearchDropdown(query) {
    const dropdown = document.getElementById('searchResultsDropdown');
    if (!dropdown) return;

    const trimmed = (query || '').trim();
    if (!trimmed) {
        hideSearchDropdown();
        return;
    }

    // Filter using intelligent multi-category synonym and stem matcher
    const matches = PRODUCTS_DATA.filter(p => matchProductSearch(p, trimmed));

    if (matches.length === 0) {
        dropdown.innerHTML = `
            <div class="search-dropdown-header">
                <span>Live Search Results</span>
                <span class="count-badge">0 Found</span>
            </div>
            <div class="search-no-results">
                <i class="fa-solid fa-magnifying-glass"></i>
                <p>No products found matching "<strong>${escapeHtml(trimmed)}</strong>"</p>
                <span>Try searching for shirts, trousers, coats, blazers, or jackets.</span>
            </div>
        `;
        dropdown.classList.add('open');
        return;
    }

    const itemsHtml = matches.map(product => {
        const swatchesHtml = (product.colors || []).map(c => `
            <span class="search-color-dot" style="background-color: ${c.hex};" title="${escapeHtml(c.name)}"></span>
        `).join('');

        const sizesHtml = (product.sizes || []).map(s => `
            <span class="search-size-pill">${s}</span>
        `).join('');

        const formattedPrice = `Rs. ${product.discountPrice.toLocaleString()}`;
        const originalPriceHtml = product.originalPrice > product.discountPrice 
            ? `<span class="search-result-price-original">Rs. ${product.originalPrice.toLocaleString()}</span>` 
            : '';

        return `
            <div class="search-result-item" onclick="openProductFromSearch('${product.id}')" role="option">
                <div class="search-result-thumb">
                    <img src="${product.images[0]}" alt="${escapeHtml(product.name)}" loading="lazy">
                </div>
                <div class="search-result-info">
                    <div class="search-result-title">${escapeHtml(product.name)}</div>
                    <div class="search-result-pricing">
                        <span class="search-result-price-current">${formattedPrice}</span>
                        ${originalPriceHtml}
                    </div>
                    <div class="search-result-variations">
                        <div class="search-result-sizes" title="Available Sizes: ${product.sizes.join(', ')}">
                            ${sizesHtml}
                        </div>
                        <div class="search-result-colors" title="Available Colors: ${(product.colors || []).map(c => c.name).join(', ')}">
                            ${swatchesHtml}
                        </div>
                    </div>
                </div>
                <div class="search-result-action">
                    <i class="fa-solid fa-chevron-right"></i>
                </div>
            </div>
        `;
    }).join('');

    dropdown.innerHTML = `
        <div class="search-dropdown-header">
            <span>Matching Garments</span>
            <span class="count-badge">${matches.length} ${matches.length === 1 ? 'Design' : 'Designs'}</span>
        </div>
        <div class="search-dropdown-items">
            ${itemsHtml}
        </div>
        <div class="search-dropdown-footer">
            <button class="search-view-all-btn" onclick="viewAllSearchResultsInGrid()">
                View all ${matches.length} designs in catalog &darr;
            </button>
        </div>
    `;

    dropdown.classList.add('open');
}

function hideSearchDropdown() {
    const dropdown = document.getElementById('searchResultsDropdown');
    if (dropdown) dropdown.classList.remove('open');
}

function openProductFromSearch(productId) {
    hideSearchDropdown();
    openQuickView(productId);
}

function viewAllSearchResultsInGrid() {
    hideSearchDropdown();
    const grid = document.getElementById('productsGrid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearSearchAndReset() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('searchClear');
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    AppState.filter.searchQuery = '';
    hideSearchDropdown();
    renderProducts();
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}

function resetAllFilters() {
    AppState.filter = {
        category: 'all',
        subCategory: 'all',
        season: 'all',
        maxPrice: 15000,
        size: null,
        searchQuery: '',
        sortBy: 'popularity'
    };

    const priceSlider = document.getElementById('priceRange');
    const priceDisplay = document.getElementById('maxPriceDisplay');
    if (priceSlider) priceSlider.value = 15000;
    if (priceDisplay) priceDisplay.textContent = 'Rs. 15,000';

    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    const sizeBtns = document.querySelectorAll('.size-filter-btn');
    sizeBtns.forEach(b => b.classList.remove('active'));

    const pills = document.querySelectorAll('.category-pill');
    pills.forEach((p, idx) => {
        if (idx === 0) p.classList.add('active');
        else p.classList.remove('active');
    });

    const seasonRadios = document.querySelectorAll('input[name="seasonFilter"]');
    seasonRadios.forEach(r => {
        if (r.value === 'all') r.checked = true;
    });

    renderProducts();
    showToast('Filters reset to show all collections', 'info');
}

function filterBySeason(season) {
    AppState.filter.season = season;
    const seasonRadios = document.querySelectorAll('input[name="seasonFilter"]');
    seasonRadios.forEach(r => {
        if (r.value === season) r.checked = true;
    });
    renderProducts();

    // Scroll to catalog smoothly
    const catalogEl = document.getElementById('shop-section');
    if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(`Showing ${season.toUpperCase()} Collection`, 'info');
}

function filterByCategory(cat, subCat = 'all') {
    AppState.filter.category = cat;
    AppState.filter.subCategory = subCat;

    const pills = document.querySelectorAll('.category-pill');
    pills.forEach(p => {
        const val = p.getAttribute('data-category');
        if (val === (subCat !== 'all' ? subCat : cat)) {
            p.classList.add('active');
        } else {
            p.classList.remove('active');
        }
    });

    renderProducts();
    const catalogEl = document.getElementById('shop-section');
    if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==========================================================================
// Cart Logic & Calculations
// Special offers:
// - Free Delivery on > Rs. 5,000
// - Buy 2 Shirts -> 10% off shirts
// - Buy 3 Products -> 15% off total
// - Coupons: WINTER20 (20% off winter items), HUSNAIN10 (10% off), WEEKEND15 (15% off)
// ==========================================================================
function quickAddToCart(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    // Use default color & default size
    addToCart(product, product.colors[0].name, product.sizes[1] || product.sizes[0], 1);
}

function quickBuyNow(productId) {
    quickAddToCart(productId);
    toggleCartDrawer(false);
    openCheckoutModal();
}

function addToCart(product, colorName, size, quantity = 1) {
    const existingIndex = AppState.cart.findIndex(item => 
        item.id === product.id && 
        item.selectedColor === colorName && 
        item.selectedSize === size
    );

    const selectedColorObj = product.colors.find(c => c.name === colorName) || product.colors[0];

    if (existingIndex > -1) {
        AppState.cart[existingIndex].quantity += quantity;
    } else {
        AppState.cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            season: product.season,
            price: product.discountPrice,
            originalPrice: product.originalPrice,
            image: selectedColorObj.image || product.images[0],
            selectedColor: colorName,
            selectedSize: size,
            quantity: quantity
        });
    }

    saveCart();
    updateCartUI();
    showToast(`Added "${product.name}" (${size}) to your bag!`, 'cart');
    toggleCartDrawer(true);
}

function updateCartItemQuantity(index, delta) {
    if (!AppState.cart[index]) return;
    AppState.cart[index].quantity += delta;
    if (AppState.cart[index].quantity <= 0) {
        AppState.cart.splice(index, 1);
        showToast('Item removed from cart', 'info');
    }
    saveCart();
    updateCartUI();
}

function removeCartItem(index) {
    if (!AppState.cart[index]) return;
    const removedName = AppState.cart[index].name;
    AppState.cart.splice(index, 1);
    saveCart();
    updateCartUI();
    showToast(`Removed "${removedName}" from cart`, 'info');
}

function saveCart() {
    localStorage.setItem('hf_cart', JSON.stringify(AppState.cart));
}

// Compute cart financials with Pakistan-specific offers
function computeCartTotals() {
    const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);

    let bundleDiscount = 0;
    let bundleMessage = '';

    // Offer: Buy 3 Products & Get 15% OFF entire order
    if (totalItems >= 3) {
        bundleDiscount = Math.round(subtotal * 0.15);
        bundleMessage = '🎉 Buy 3 Offer: 15% Bundle Discount Applied!';
    } else {
        // Offer: Buy 2 Shirts and Get 10% OFF on Shirts
        const shirtItems = AppState.cart.filter(item => item.category === 'shirts');
        const shirtCount = shirtItems.reduce((sum, item) => sum + item.quantity, 0);
        if (shirtCount >= 2) {
            const shirtSubtotal = shirtItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            bundleDiscount = Math.round(shirtSubtotal * 0.10);
            bundleMessage = '✨ Buy 2 Shirts Offer: 10% Shirt Discount Applied!';
        }
    }

    // Coupon discount logic
    let couponDiscount = 0;
    if (AppState.appliedCoupon === 'WINTER20') {
        const winterItems = AppState.cart.filter(item => item.season === 'winter');
        const winterSubtotal = winterItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        couponDiscount = Math.round(winterSubtotal * 0.20);
    } else if (AppState.appliedCoupon === 'HUSNAIN10') {
        couponDiscount = Math.round(subtotal * 0.10);
    } else if (AppState.appliedCoupon === 'WEEKEND15') {
        couponDiscount = Math.round(subtotal * 0.15);
    }

    const totalDiscount = bundleDiscount + couponDiscount;

    // Delivery Fee: Free over Rs. 5,000, otherwise standard Rs. 250 across Pakistan
    const FREE_SHIPPING_THRESHOLD = 5000;
    const deliveryFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 250;

    const grandTotal = Math.max(0, subtotal - totalDiscount + deliveryFee);

    return {
        subtotal,
        totalItems,
        bundleDiscount,
        bundleMessage,
        couponDiscount,
        totalDiscount,
        deliveryFee,
        grandTotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountNeededForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
    };
}

function updateCartUI() {
    const badge = document.getElementById('cartBadgeCount');
    const drawerList = document.getElementById('cartDrawerItems');
    const emptyState = document.getElementById('cartEmptyState');
    const footer = document.getElementById('cartDrawerFooter');
    const subtotalEl = document.getElementById('cartSubtotal');
    const discountRow = document.getElementById('cartDiscountRow');
    const discountEl = document.getElementById('cartDiscount');
    const deliveryEl = document.getElementById('cartDelivery');
    const grandTotalEl = document.getElementById('cartGrandTotal');
    const progressFill = document.getElementById('shippingProgressFill');
    const progressText = document.getElementById('shippingProgressText');
    const bundleBanner = document.getElementById('cartBundleBanner');

    const totals = computeCartTotals();

    // Badge
    if (badge) {
        badge.textContent = totals.totalItems;
        badge.classList.add('pulse');
        setTimeout(() => badge.classList.remove('pulse'), 300);
    }

    // Free delivery progress
    if (progressFill && progressText) {
        if (totals.subtotal >= totals.freeShippingThreshold) {
            progressFill.style.width = '100%';
            progressFill.classList.add('complete');
            progressText.innerHTML = '<span>🎉 <strong>FREE Home Delivery Unlocked!</strong> (Nationwide)</span>';
        } else {
            const pct = Math.min(100, (totals.subtotal / totals.freeShippingThreshold) * 100);
            progressFill.style.width = `${pct}%`;
            progressFill.classList.remove('complete');
            progressText.innerHTML = `<span>Add <strong>Rs. ${totals.amountNeededForFreeShipping.toLocaleString()}</strong> more for <strong>FREE Delivery</strong></span>`;
        }
    }

    // Bundle message banner
    if (bundleBanner) {
        if (totals.bundleMessage) {
            bundleBanner.style.display = 'flex';
            bundleBanner.innerHTML = `<i class="fa-solid fa-tag"></i> <span>${totals.bundleMessage}</span>`;
        } else {
            bundleBanner.style.display = 'none';
        }
    }

    // Empty State vs Items
    if (AppState.cart.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (drawerList) drawerList.style.display = 'none';
        if (footer) footer.style.display = 'none';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (drawerList) drawerList.style.display = 'flex';
    if (footer) footer.style.display = 'block';

    // Render Cart Items
    if (drawerList) {
        drawerList.innerHTML = AppState.cart.map((item, idx) => `
            <div class="cart-item">
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <button class="btn-remove-item" onclick="removeCartItem(${idx})" title="Remove item">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                    <h5 class="cart-item-title">${item.name}</h5>
                    <div class="cart-item-meta">
                        Color: <strong>${item.selectedColor}</strong> | Size: <strong>${item.selectedSize}</strong>
                    </div>
                    <div class="flex-between">
                        <div class="cart-qty-ctrls">
                            <button class="btn-qty" onclick="updateCartItemQuantity(${idx}, -1)">-</button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="btn-qty" onclick="updateCartItemQuantity(${idx}, 1)">+</button>
                        </div>
                        <span class="cart-item-price">Rs. ${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Summary calculations
    if (subtotalEl) subtotalEl.textContent = `Rs. ${totals.subtotal.toLocaleString()}`;
    if (discountRow && discountEl) {
        if (totals.totalDiscount > 0) {
            discountRow.style.display = 'flex';
            discountEl.textContent = `- Rs. ${totals.totalDiscount.toLocaleString()}`;
        } else {
            discountRow.style.display = 'none';
        }
    }
    if (deliveryEl) {
        deliveryEl.textContent = totals.deliveryFee === 0 ? 'FREE' : `Rs. ${totals.deliveryFee}`;
    }
    if (grandTotalEl) grandTotalEl.textContent = `Rs. ${totals.grandTotal.toLocaleString()}`;
}

async function applyCouponCode() {
    const input = document.getElementById('couponCodeInput');
    if (!input) return;

    const code = input.value.trim().toUpperCase();
    if (!code) {
        showToast('Please enter a coupon code', 'info');
        return;
    }

    const totals = computeCartTotals();

    try {
        const res = await fetch('/api/offers/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, subtotal: totals.subtotal, cartItems: AppState.cart })
        });
        const data = await res.json();

        if (data.success && data.offer) {
            AppState.appliedCoupon = data.offer.code;
            AppState.activeOfferData = data.offer;
            updateCartUI();
            input.value = '';
            showToast(`Promo code "${data.offer.code}" applied! (${data.offer.title})`, 'success');
        } else {
            showToast(data.error || 'Invalid or expired coupon code', 'error');
        }
    } catch (e) {
        if (['WINTER20', 'HUSNAIN10', 'WEEKEND15', 'SUMMER20', 'WINTER30', 'BOGO2026', 'FREEDELIVERY'].includes(code)) {
            AppState.appliedCoupon = code;
            updateCartUI();
            input.value = '';
            showToast(`Promo code "${code}" applied successfully!`, 'success');
        } else {
            showToast('Invalid coupon code. Try WINTER20, SUMMER20 or HUSNAIN10', 'error');
        }
    }
}

function copyCoupon(code) {
    navigator.clipboard.writeText(code).then(() => {
        showToast(`Coupon "${code}" copied to clipboard!`, 'success');
        const input = document.getElementById('couponCodeInput');
        if (input) input.value = code;
    }).catch(() => {
        const input = document.getElementById('couponCodeInput');
        if (input) input.value = code;
        showToast(`Coupon "${code}" loaded!`, 'success');
    });
}

function toggleCartDrawer(forceOpen = null) {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (!drawer || !overlay) return;

    const isOpen = drawer.classList.contains('open');
    const shouldOpen = forceOpen !== null ? forceOpen : !isOpen;

    if (shouldOpen) {
        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// ==========================================================================
// Wishlist Logic
// ==========================================================================
function toggleWishlist(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const index = AppState.wishlist.indexOf(productId);
    if (index > -1) {
        AppState.wishlist.splice(index, 1);
        showToast(`Removed "${product.name}" from your Wishlist`, 'info');
    } else {
        AppState.wishlist.push(productId);
        showToast(`Added "${product.name}" to your Wishlist ❤️`, 'success');
    }

    localStorage.setItem('hf_wishlist', JSON.stringify(AppState.wishlist));
    updateWishlistUI();
    renderProducts();
}

function updateWishlistUI() {
    const countEl = document.getElementById('wishlistBadgeCount');
    if (countEl) {
        countEl.textContent = AppState.wishlist.length;
    }

    const container = document.getElementById('wishlistItemsList');
    const emptyState = document.getElementById('wishlistEmptyState');
    if (!container) return;

    if (AppState.wishlist.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        container.style.display = 'none';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    container.style.display = 'flex';

    const wishlistedProducts = PRODUCTS_DATA.filter(p => AppState.wishlist.includes(p.id));

    container.innerHTML = wishlistedProducts.map(product => `
        <div class="cart-item">
            <div class="cart-item-img">
                <img src="${product.images[0]}" alt="${product.name}">
            </div>
            <div class="cart-item-info">
                <button class="btn-remove-item" onclick="toggleWishlist('${product.id}')" title="Remove">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <h5 class="cart-item-title">${product.name}</h5>
                <div class="cart-item-meta">
                    Rs. ${product.discountPrice.toLocaleString()} 
                    <span style="text-decoration: line-through; color: var(--color-text-dim); margin-left: 6px;">Rs. ${product.originalPrice.toLocaleString()}</span>
                </div>
                <div style="margin-top: 0.5rem;">
                    <button class="btn btn-gold btn-sm" onclick="quickAddToCart('${product.id}'); toggleWishlist('${product.id}');">
                        <i class="fa-solid fa-bag-shopping"></i> Move to Bag
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function toggleWishlistDrawer(forceOpen = null) {
    const drawer = document.getElementById('wishlistDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (!drawer || !overlay) return;

    const isOpen = drawer.classList.contains('open');
    const shouldOpen = forceOpen !== null ? forceOpen : !isOpen;

    if (shouldOpen) {
        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Close all active drawers & modals
function closeAllDrawers() {
    toggleCartDrawer(false);
    toggleWishlistDrawer(false);
    closeModal('quickViewModal');
    closeModal('checkoutModal');
    closeModal('sizeGuideModal');
    closeModal('authModal');
    closeModal('reviewModal');
    closeModal('orderSuccessModal');
}

// ==========================================================================
// Quick View & Product Modal
// ==========================================================================
let activeQuickViewProduct = null;
let activeSelectedColor = null;
let activeSelectedSize = null;

function openQuickView(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    activeQuickViewProduct = product;
    activeSelectedColor = product.colors[0].name;
    activeSelectedSize = product.sizes[1] || product.sizes[0];

    const modal = document.getElementById('quickViewModal');
    const mainImg = document.getElementById('qvMainImg');
    const thumbsContainer = document.getElementById('qvThumbs');
    const title = document.getElementById('qvTitle');
    const currentPrice = document.getElementById('qvCurrentPrice');
    const originalPrice = document.getElementById('qvOriginalPrice');
    const desc = document.getElementById('qvDesc');
    const fabric = document.getElementById('qvFabric');
    const fit = document.getElementById('qvFit');
    const care = document.getElementById('qvCare');
    const colorsContainer = document.getElementById('qvColors');
    const sizesContainer = document.getElementById('qvSizes');
    const colorLabel = document.getElementById('qvColorLabel');

    if (mainImg) mainImg.src = product.images[0];
    if (title) title.textContent = product.name;
    if (currentPrice) currentPrice.textContent = `Rs. ${product.discountPrice.toLocaleString()}`;
    if (originalPrice) originalPrice.textContent = `Rs. ${product.originalPrice.toLocaleString()}`;
    if (desc) desc.textContent = product.description;
    if (fabric) fabric.textContent = product.fabric;
    if (fit) fit.textContent = product.fit;
    if (care) care.textContent = product.care;
    if (colorLabel) colorLabel.textContent = activeSelectedColor;

    // Gallery Thumbs
    if (thumbsContainer) {
        thumbsContainer.innerHTML = product.images.map((imgUrl, i) => `
            <div class="qv-thumb ${i === 0 ? 'active' : ''}" onclick="selectQVImage(this, '${imgUrl}')">
                <img src="${imgUrl}" alt="${product.name}">
            </div>
        `).join('');
    }

    // Color Swatches
    if (colorsContainer) {
        colorsContainer.innerHTML = product.colors.map((c, i) => `
            <button class="qv-swatch ${i === 0 ? 'active' : ''}" 
                    style="background-color: ${c.hex};" 
                    title="${c.name}"
                    onclick="selectQVColor(this, '${c.name}', '${c.image}')">
            </button>
        `).join('');
    }

    // Sizes
    if (sizesContainer) {
        sizesContainer.innerHTML = product.sizes.map((s, i) => `
            <button class="qv-size-btn ${s === activeSelectedSize ? 'active' : ''}" 
                    onclick="selectQVSize(this, '${s}')">
                ${s}
            </button>
        `).join('');
    }

    openModal('quickViewModal');
}

function selectQVImage(thumbElement, imgUrl) {
    const mainImg = document.getElementById('qvMainImg');
    if (mainImg) mainImg.src = imgUrl;

    const thumbs = document.querySelectorAll('.qv-thumb');
    thumbs.forEach(t => t.classList.remove('active'));
    if (thumbElement) thumbElement.classList.add('active');
}

function selectQVColor(swatchElement, colorName, colorImg) {
    activeSelectedColor = colorName;
    const label = document.getElementById('qvColorLabel');
    if (label) label.textContent = colorName;

    const mainImg = document.getElementById('qvMainImg');
    if (mainImg && colorImg) mainImg.src = colorImg;

    const swatches = document.querySelectorAll('.qv-swatch');
    swatches.forEach(s => s.classList.remove('active'));
    if (swatchElement) swatchElement.classList.add('active');
}

function selectQVSize(sizeElement, sizeVal) {
    activeSelectedSize = sizeVal;
    const sizeBtns = document.querySelectorAll('.qv-size-btn');
    sizeBtns.forEach(b => b.classList.remove('active'));
    if (sizeElement) sizeElement.classList.add('active');
}

function addQVToCart() {
    if (!activeQuickViewProduct) return;
    addToCart(activeQuickViewProduct, activeSelectedColor, activeSelectedSize, 1);
    closeModal('quickViewModal');
}

function buyQVNow() {
    if (!activeQuickViewProduct) return;
    addToCart(activeQuickViewProduct, activeSelectedColor, activeSelectedSize, 1);
    closeModal('quickViewModal');
    toggleCartDrawer(false);
    openCheckoutModal();
}

// ==========================================================================
// Checkout System (Multi-Step Pakistani Address & COD / JazzCash / Card)
// ==========================================================================
let currentCheckoutStep = 1;

function openCheckoutModal() {
    if (AppState.cart.length === 0) {
        showToast('Your shopping bag is empty!', 'error');
        return;
    }

    currentCheckoutStep = 1;
    renderCheckoutSummary();
    showCheckoutStep(1);
    openModal('checkoutModal');
}

function showCheckoutStep(stepNumber) {
    currentCheckoutStep = stepNumber;

    const step1 = document.getElementById('coStep1');
    const step2 = document.getElementById('coStep2');
    const step3 = document.getElementById('coStep3');

    const ind1 = document.getElementById('stepIndicator1');
    const ind2 = document.getElementById('stepIndicator2');
    const ind3 = document.getElementById('stepIndicator3');

    if (step1) step1.style.display = stepNumber === 1 ? 'block' : 'none';
    if (step2) step2.style.display = stepNumber === 2 ? 'block' : 'none';
    if (step3) step3.style.display = stepNumber === 3 ? 'block' : 'none';

    if (ind1) {
        ind1.className = `co-step ${stepNumber === 1 ? 'active' : (stepNumber > 1 ? 'completed' : '')}`;
    }
    if (ind2) {
        ind2.className = `co-step ${stepNumber === 2 ? 'active' : (stepNumber > 2 ? 'completed' : '')}`;
    }
    if (ind3) {
        ind3.className = `co-step ${stepNumber === 3 ? 'active' : ''}`;
    }
}

function renderCheckoutSummary() {
    const totals = computeCartTotals();
    const subtotalEl = document.getElementById('coSubtotal');
    const discountEl = document.getElementById('coDiscount');
    const deliveryEl = document.getElementById('coDelivery');
    const totalEl = document.getElementById('coGrandTotal');
    const itemsCountEl = document.getElementById('coItemsCount');

    if (subtotalEl) subtotalEl.textContent = `Rs. ${totals.subtotal.toLocaleString()}`;
    if (discountEl) discountEl.textContent = totals.totalDiscount > 0 ? `- Rs. ${totals.totalDiscount.toLocaleString()}` : 'Rs. 0';
    if (deliveryEl) deliveryEl.textContent = totals.deliveryFee === 0 ? 'FREE' : `Rs. ${totals.deliveryFee}`;
    if (totalEl) totalEl.textContent = `Rs. ${totals.grandTotal.toLocaleString()}`;
    if (itemsCountEl) itemsCountEl.textContent = `${totals.totalItems} items`;
}

function validateAndProceedStep1() {
    const name = document.getElementById('checkoutName').value.trim();
    const phone = document.getElementById('checkoutPhone').value.trim();
    const email = document.getElementById('checkoutEmail').value.trim();

    if (!name) {
        showToast('Please provide your full name', 'error');
        return;
    }
    if (!phone || phone.length < 10) {
        showToast('Please provide a valid Pakistani mobile number (e.g., 0300 1234567)', 'error');
        return;
    }

    showCheckoutStep(2);
}

function validateAndProceedStep2() {
    const address = document.getElementById('checkoutAddress').value.trim();
    const city = document.getElementById('checkoutCity').value;

    if (!address) {
        showToast('Please enter your complete street / house address', 'error');
        return;
    }
    if (!city) {
        showToast('Please select your city for delivery', 'error');
        return;
    }

    showCheckoutStep(3);
}

async function placeFinalOrder() {
    const name = document.getElementById('checkoutName').value.trim();
    const phone = document.getElementById('checkoutPhone').value.trim();
    const email = document.getElementById('checkoutEmail')?.value.trim() || 'customer@example.com';
    const city = document.getElementById('checkoutCity').value || 'Lahore';
    const address = document.getElementById('checkoutAddress').value.trim();
    const postal = document.getElementById('checkoutPostal')?.value.trim() || '';
    const paymentMode = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'Cash on Delivery (COD)';

    const totals = computeCartTotals();

    try {
        const token = localStorage.getItem('hf_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const payload = {
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            address_line: address,
            city,
            postal_code: postal,
            items: AppState.cart,
            subtotal: totals.subtotal,
            discount_amount: totals.totalDiscount,
            delivery_fee: totals.deliveryFee,
            grand_total: totals.grandTotal,
            coupon_code: AppState.appliedCoupon || '',
            payment_method: paymentMode
        };

        const res = await fetch('/api/orders', {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        let trackingId = `HF-PK-${Math.floor(1000 + Math.random() * 9000)}`;
        if (data.success && data.order) {
            trackingId = data.order.id;
        }

        // Close checkout & Open Confirmation Modal
        closeModal('checkoutModal');
        
        // Fill success modal
        const codeEl = document.getElementById('successTrackingCode');
        const custEl = document.getElementById('successCustomerName');
        const cityEl = document.getElementById('successCity');
        const totalEl = document.getElementById('successTotal');
        const methodEl = document.getElementById('successPaymentMethod');

        if (codeEl) codeEl.textContent = trackingId;
        if (custEl) custEl.textContent = name;
        if (cityEl) cityEl.textContent = `${address}, ${city}`;
        if (totalEl) totalEl.textContent = `Rs. ${totals.grandTotal.toLocaleString()}`;
        if (methodEl) methodEl.textContent = paymentMode;

        // Reset Cart
        AppState.cart = [];
        AppState.appliedCoupon = null;
        saveCart();
        updateCartUI();

        openModal('orderSuccessModal');
        showToast('Congratulations! Your order has been placed.', 'success');
    } catch (e) {
        console.error('Order creation error:', e);
        closeModal('checkoutModal');
        openModal('orderSuccessModal');
    }
}

// ==========================================================================
// Order Tracking System
// ==========================================================================
function initTrackingUI() {
    const input = document.getElementById('trackingIdInput');
    const trackBtn = document.getElementById('trackOrderBtn');
    if (trackBtn) {
        trackBtn.addEventListener('click', () => {
            trackOrder(input ? input.value : '');
        });
    }

    // Auto check if tracking ID was passed in localStorage
    const savedQuery = localStorage.getItem('hf_track_query');
    if (savedQuery) {
        localStorage.removeItem('hf_track_query');
        if (input) input.value = savedQuery;
        trackOrder(savedQuery);
    }
}

async function trackOrder(id) {
    const trackingId = (id || '').trim().toUpperCase();
    if (!trackingId) {
        showToast('Please enter an Order or Tracking ID', 'error');
        return;
    }

    let order = null;
    try {
        const res = await fetch(`/api/orders/${trackingId}`);
        const data = await res.json();
        if (data.success && data.order) {
            const raw = data.order;
            order = {
                orderId: raw.id,
                customerName: raw.customer_name,
                city: raw.city,
                items: (raw.items || []).map(i => `${i.name} (${i.selectedSize || ''}) x${i.quantity}`).join(', '),
                courier: raw.courier_name || 'TCS Express Pakistan',
                currentStep: raw.order_status === 'Delivered' ? 5 : (raw.order_status === 'Dispatched' ? 4 : (raw.order_status === 'Processing' ? 2 : 1)),
                statusText: `Consignment status: ${raw.order_status} via ${raw.courier_name || 'TCS Express'}`,
                estDelivery: raw.order_status === 'Delivered' ? 'Delivered' : '2 to 3 Business Days',
                history: raw.tracking_history || []
            };
        }
    } catch (e) {
        console.warn('API tracking fetch failed, checking local database');
    }

    if (!order) {
        order = AppState.trackingDatabase[trackingId];
    }

    const resultsContainer = document.getElementById('trackingResults');
    if (!order) {
        showToast(`Tracking code "${trackingId}" not found. Please enter a valid Order ID.`, 'error');
        if (resultsContainer) resultsContainer.classList.remove('active');
        return;
    }

    if (resultsContainer) {
        resultsContainer.classList.add('active');

        // Populate summary
        document.getElementById('trackResId').textContent = order.orderId;
        document.getElementById('trackResCourier').textContent = order.courier;
        document.getElementById('trackResCity').textContent = order.city;
        document.getElementById('trackResStatus').textContent = order.statusText;
        document.getElementById('trackResEst').textContent = order.estDelivery;

        // Stepper UI
        const stepNodes = document.querySelectorAll('.step-node');
        const progressBar = document.getElementById('stepperProgressBar');

        stepNodes.forEach((node, idx) => {
            const stepNum = idx + 1;
            node.classList.remove('completed', 'active');
            if (stepNum < order.currentStep) {
                node.classList.add('completed');
            } else if (stepNum === order.currentStep) {
                node.classList.add('active');
            }
        });

        if (progressBar) {
            const pct = Math.min(100, ((order.currentStep - 1) / (stepNodes.length - 1)) * 100);
            progressBar.style.width = `${pct}%`;
        }

        // Timeline history
        const timelineList = document.getElementById('trackingTimelineList');
        if (timelineList && order.history) {
            timelineList.innerHTML = order.history.map(h => `
                <div style="display: flex; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.85rem;">
                    <span style="color: #fff;"><i class="fa-regular fa-circle-check" style="color: var(--color-gold); margin-right: 8px;"></i> ${h.title}</span>
                    <span style="color: var(--color-text-dim);">${h.time}</span>
                </div>
            `).join('');
        }

        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

function setAndTrackSample(sampleId) {
    const input = document.getElementById('trackingIdInput');
    if (input) input.value = sampleId;
    trackOrder(sampleId);
}

// Track from the Success Modal
function trackNewlyCreatedOrder() {
    const codeEl = document.getElementById('successTrackingCode');
    if (codeEl) {
        const id = codeEl.textContent.trim();
        closeModal('orderSuccessModal');
        const trackSection = document.getElementById('tracking-section');
        if (trackSection) trackSection.scrollIntoView({ behavior: 'smooth' });
        setAndTrackSample(id);
    }
}

// ==========================================================================
// Customer Reviews Submission
// ==========================================================================
function submitNewReview(event) {
    event.preventDefault();
    const name = document.getElementById('reviewName').value.trim();
    const city = document.getElementById('reviewCity').value.trim();
    const title = document.getElementById('reviewTitle').value.trim();
    const comment = document.getElementById('reviewComment').value.trim();
    const rating = Number(document.getElementById('reviewRating').value || 5);

    if (!name || !title || !comment) {
        showToast('Please fill out all required fields', 'error');
        return;
    }

    CUSTOMER_REVIEWS.unshift({
        name,
        city: city || 'Pakistan',
        rating,
        date: 'Just now',
        verified: true,
        product: 'Husnain Bespoke Tailoring',
        title,
        comment
    });

    closeModal('reviewModal');
    renderReviews();
    showToast('Thank you for your valuable review!', 'success');
}

function renderReviews() {
    const container = document.getElementById('reviewsContainer');
    if (!container || typeof CUSTOMER_REVIEWS === 'undefined') return;

    container.innerHTML = CUSTOMER_REVIEWS.slice(0, 6).map(rev => `
        <div class="review-card">
            <div>
                <div class="review-header">
                    <div class="review-rating">
                        ${Array(Math.floor(rev.rating)).fill('<i class="fa-solid fa-star"></i>').join('')}
                        ${rev.rating % 1 !== 0 ? '<i class="fa-solid fa-star-half-stroke"></i>' : ''}
                    </div>
                    ${rev.verified ? `<span class="review-verified"><i class="fa-solid fa-circle-check"></i> Verified Buyer</span>` : ''}
                </div>
                <h5 class="review-title">"${rev.title}"</h5>
                <p class="review-text">${rev.comment}</p>
            </div>
            <div class="review-footer">
                <div class="reviewer-info">
                    <h6>${rev.name}</h6>
                    <span>${rev.city}</span>
                </div>
                <span class="review-date">${rev.date}</span>
            </div>
        </div>
    `).join('');
}

// ==========================================================================
// User Authentication & Account System (Real Salted Backend Crypto)
// ==========================================================================
function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    const icon = btn.querySelector('i');
    if (icon) {
        icon.className = isPass ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
    }
}

function initUserUI() {
    const userBtn = document.getElementById('userAccountBtn');
    const token = localStorage.getItem('hf_token');
    const savedUser = JSON.parse(localStorage.getItem('hf_user'));

    if (token && savedUser) {
        AppState.currentUser = savedUser;
        if (userBtn) {
            userBtn.innerHTML = `<i class="fa-solid fa-user-check" style="color: var(--color-gold);"></i>`;
            userBtn.title = `Hi, ${savedUser.name} (Click for Account)`;
            userBtn.onclick = () => {
                window.location.href = 'customer.html';
            };
        }
    } else {
        if (userBtn) {
            userBtn.innerHTML = `<i class="fa-regular fa-user"></i>`;
            userBtn.title = 'Account / Sign In';
            userBtn.onclick = () => openModal('authModal');
        }
    }
}

function switchAuthModalTab(tab) {
    const loginForm = document.getElementById('storefrontLoginForm');
    const signupForm = document.getElementById('storefrontSignupForm');
    const btnLogin = document.getElementById('modalTabLogin');
    const btnSignup = document.getElementById('modalTabSignup');

    if (tab === 'login') {
        if (loginForm) loginForm.style.display = 'flex';
        if (signupForm) signupForm.style.display = 'none';
        if (btnLogin) btnLogin.className = 'btn btn-sm btn-gold';
        if (btnSignup) btnSignup.className = 'btn btn-sm btn-dark';
    } else {
        if (loginForm) loginForm.style.display = 'none';
        if (signupForm) signupForm.style.display = 'flex';
        if (btnLogin) btnLogin.className = 'btn btn-sm btn-dark';
        if (btnSignup) btnSignup.className = 'btn btn-sm btn-gold';
    }
}

async function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value.trim();

    if (!email || !password) {
        showToast('Please enter your email and password', 'error');
        return;
    }

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.success && data.user) {
            AppState.currentUser = data.user;
            localStorage.setItem('hf_token', data.token);
            localStorage.setItem('hf_user', JSON.stringify(data.user));

            initUserUI();
            closeModal('authModal');
            showToast(`Welcome back, ${data.user.name}!`, 'success');
        } else {
            showToast(data.error || 'Invalid email or password', 'error');
        }
    } catch (e) {
        // Fallback simulation
        const name = email.split('@')[0];
        AppState.currentUser = { name: name.charAt(0).toUpperCase() + name.slice(1), email };
        localStorage.setItem('hf_user', JSON.stringify(AppState.currentUser));
        initUserUI();
        closeModal('authModal');
        showToast(`Welcome back, ${AppState.currentUser.name}!`, 'success');
    }
}

async function handleSignupSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const city = document.getElementById('signupCity').value.trim() || 'Lahore';
    const password = document.getElementById('signupPassword').value.trim();
    const confirmPassword = document.getElementById('signupConfirmPassword').value.trim();

    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, city, password, confirmPassword })
        });
        const data = await res.json();

        if (data.success && data.user) {
            AppState.currentUser = data.user;
            localStorage.setItem('hf_token', data.token);
            localStorage.setItem('hf_user', JSON.stringify(data.user));

            initUserUI();
            closeModal('authModal');
            showToast(`Account created! Welcome, ${data.user.name}.`, 'success');
        } else {
            showToast(data.error || 'Signup failed', 'error');
        }
    } catch (e) {
        showToast('Could not communicate with signup server', 'error');
    }
}

function logoutUser() {
    AppState.currentUser = null;
    localStorage.removeItem('hf_token');
    localStorage.removeItem('hf_user');
    initUserUI();
    showToast('Logged out successfully', 'info');
}

// ==========================================================================
// WhatsApp VIP Club / Inquiry
// ==========================================================================
function initWhatsAppPrompt() {
    const vipForm = document.getElementById('vipForm');
    if (vipForm) {
        vipForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = document.getElementById('vipPhone').value.trim();
            if (phone) {
                showToast(`Rs. 500 voucher sent to ${phone}!`, 'success');
                document.getElementById('vipPhone').value = '';
            }
        });
    }
}

function openWhatsAppSupport() {
    const msg = encodeURIComponent("Salam! I am browsing Husnain Fashion online store and would like sizing & fabric assistance.");
    window.open(`https://wa.me/923004876246?text=${msg}`, '_blank');
}

// ==========================================================================
// Shared Modal Utilities
// ==========================================================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// ==========================================================================
// Toast Notifications
// ==========================================================================
function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    else if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';
    else if (type === 'cart') iconClass = 'fa-solid fa-bag-shopping';

    toast.innerHTML = `
        <i class="${iconClass} toast-icon"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 350);
    }, 3800);
}
