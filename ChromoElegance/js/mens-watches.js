// Men's Watches Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Debug function to check products in storage
    function debugProducts() {
        console.log("---- Product Manager Storage Debug ----");
        
        // Check the products in localStorage
        const storedProductsRaw = localStorage.getItem('chronoElegance_products');
        console.log("Raw products string exists:", !!storedProductsRaw);
        
        if (storedProductsRaw) {
            try {
                const storedProducts = JSON.parse(storedProductsRaw);
                console.log(`Found ${storedProducts.length} products in localStorage`);
                
                // Look for men's watches with images
                const mensWatches = storedProducts.filter(p => p.category === 'men');
                console.log(`Found ${mensWatches.length} men's watches`);
                
                // Check image data
                mensWatches.forEach((watch, index) => {
                    console.log(`Watch ${index+1}: ${watch.title}`);
                    console.log(`- Has imageUrl: ${!!watch.imageUrl}`);
                    if (watch.imageUrl) {
                        console.log(`- Image type: ${watch.imageUrl.startsWith('data:image') ? 'Base64' : 'URL'}`);
                        console.log(`- Image URL length: ${watch.imageUrl.length}`);
                    }
                });
            } catch (error) {
                console.error("Error parsing products:", error);
            }
        }
        
        console.log("---- End Debug ----");
    }
    
    // Run debug on page load
    debugProducts();

    // Header scroll effect
    const header = document.querySelector('header');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const adminLoginLink = document.querySelector('.nav-icon .fa-user');
    const adminModal = document.getElementById('admin-modal');
    const adminClose = document.querySelector('.admin-close');
    const adminLoginForm = document.getElementById('admin-login-form');
    const productsContainer = document.getElementById('mens-products-container');
    const productCountElement = document.getElementById('product-count');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    // Cart and wishlist
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Filter elements
    const collectionFilter = document.getElementById('collection-filter');
    const priceFilter = document.getElementById('price-filter');
    const featureFilter = document.getElementById('feature-filter');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const sortSelect = document.getElementById('sort-select');
    const toggleFiltersBtn = document.getElementById('toggle-filters');
    const filterControls = document.getElementById('filter-controls');
    
    // Pagination variables
    const itemsPerPage = 6; // Number of watches per page
    let currentPage = 1;
    let allWatches = [];
    
    // Helper function to get product image from different possible sources
    function getProductImage(product) {
        // Try to get image from different possible properties
        if (product.imageUrl && product.imageUrl.startsWith('data:image')) {
            // If it's a base64 image
            return product.imageUrl;
        } else if (product.imageUrl) {
            // If it's a URL
            return product.imageUrl;
        } else if (product.image && product.image.startsWith('data:image')) {
            // Legacy support for older 'image' property with base64
            return product.image;
        } else if (product.image) {
            // Legacy support for older 'image' property with URL
            return product.image;
        } else {
            // Default fallback
            return 'https://source.unsplash.com/random/300x300/?luxury,watch';
        }
    }
    
    // Toggle filters on mobile
    if (toggleFiltersBtn && filterControls) {
        toggleFiltersBtn.addEventListener('click', function() {
            filterControls.style.display = filterControls.style.display === 'none' ? 'flex' : 'none';
            toggleFiltersBtn.innerHTML = filterControls.style.display === 'none' ? 
                '<i class="fas fa-filter"></i>' : '<i class="fas fa-times"></i>';
        });
        
        // Set initial state based on screen size
        if (window.innerWidth < 768) {
            filterControls.style.display = 'none';
        }
        
        // Update on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth < 768) {
                filterControls.style.display = 'none';
                toggleFiltersBtn.innerHTML = '<i class="fas fa-filter"></i>';
            } else {
                filterControls.style.display = 'flex';
            }
        });
    }
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !e.target.closest('.nav-container')) {
            navMenu.classList.remove('active');
        }
    });
    
    // Admin modal functionality
    if (adminLoginLink) {
        adminLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            adminModal.classList.add('active');
        });
    }
    
    if (adminClose) {
        adminClose.addEventListener('click', () => {
            adminModal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            adminModal.classList.remove('active');
        }
    });
    
    // Admin login form submission
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('admin-password').value;
            
            // Simple authentication
            if (username === 'admin' && password === 'admin123') {
                localStorage.setItem('adminLoggedIn', 'true');
                window.location.href = 'admin.html';
            } else {
                alert('Invalid credentials. Please try again.');
            }
        });
    }
    
    // Update cart count
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }
    
    // Initialize cart count
    updateCartCount();
    
    // Add to cart functionality
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id || item.id.toString() === product.id.toString());
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.imageUrl || product.image,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Show notification
        showNotification(`${product.title} added to cart!`);
    }
    
    // Wishlist functionality
    function toggleWishlist(productId) {
        const index = wishlist.indexOf(productId);
        
        if (index === -1) {
            // Add to wishlist
            wishlist.push(productId);
            showNotification('Added to wishlist!');
        } else {
            // Remove from wishlist
            wishlist.splice(index, 1);
            showNotification('Removed from wishlist!', 'info');
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistUI();
    }
    
    // Update wishlist UI
    function updateWishlistUI() {
        const wishlistBtns = document.querySelectorAll('.wishlist-btn');
        
        wishlistBtns.forEach(btn => {
            const productId = btn.closest('.product-card').dataset.id;
            
            if (wishlist.includes(productId)) {
                btn.querySelector('i').classList.remove('far');
                btn.querySelector('i').classList.add('fas');
                btn.querySelector('i').style.color = '#EF4444';
            } else {
                btn.querySelector('i').classList.remove('fas');
                btn.querySelector('i').classList.add('far');
                btn.querySelector('i').style.color = '';
            }
        });
    }
    
    // Newsletter subscription
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            
            if (email && isValidEmail(email)) {
                showNotification('Thank you for subscribing to our newsletter!');
                newsletterForm.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            hideNotification(notification);
        }, 3000);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            hideNotification(notification);
        });
    }
    
    // Hide notification
    function hideNotification(notification) {
        notification.classList.remove('show');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // Validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Get default men's watches
    function getDefaultMensWatches() {
        return [
            {
                id: 'default1',
                title: "Celestial Chronograph",
                description: "Stainless steel case with black leather strap",
                price: 1250.00,
                imageUrl: "https://source.unsplash.com/random/300x300/?luxury,watch,1",
                isNew: true,
                isSale: false,
                salePercentage: 0,
                category: "men",
                collection: "luxury",
                features: ["chronograph", "leather-strap", "sapphire-crystal"],
                stock: 15
            },
            {
                id: 'default2',
                title: "Royal Automatic",
                description: "Gold-tone case with brown alligator strap",
                price: 1950.00,
                originalPrice: 2450.00,
                imageUrl: "https://source.unsplash.com/random/300x300/?luxury,watch,2",
                isNew: false,
                isSale: true,
                salePercentage: 20,
                category: "men",
                collection: "luxury",
                features: ["automatic", "alligator-strap", "gold-tone"],
                stock: 8
            },
            {
                id: 'default3',
                title: "Oceanic Diver",
                description: "Blue ceramic bezel with stainless steel bracelet",
                price: 2850.00,
                imageUrl: "https://source.unsplash.com/random/300x300/?diving,watch",
                isNew: false,
                isSale: false,
                salePercentage: 0,
                category: "men",
                collection: "sport",
                features: ["diving", "ceramic-bezel", "water-resistant-300m"],
                stock: 12
            },
            {
                id: 'default4',
                title: "Alpine Reserve",
                description: "Titanium case with integrated rubber strap",
                price: 3450.00,
                imageUrl: "https://source.unsplash.com/random/300x300/?luxury,watch,4",
                isNew: true,
                isSale: false,
                salePercentage: 0,
                category: "men",
                collection: "sport",
                features: ["chronograph", "titanium", "rubber-strap"],
                stock: 6
            },
            {
                id: 'default5',
                title: "Vintage Heritage",
                description: "Bronze case with aged leather strap",
                price: 2250.00,
                imageUrl: "https://source.unsplash.com/random/300x300/?vintage,watch",
                isNew: false,
                isSale: false,
                salePercentage: 0,
                category: "men",
                collection: "vintage",
                features: ["automatic", "leather-strap", "bronze"],
                stock: 10
            },
            {
                id: 'default6',
                title: "Executive Quartz",
                description: "Slim stainless steel case with mesh bracelet",
                price: 950.00,
                imageUrl: "https://source.unsplash.com/random/300x300/?silver,watch",
                isNew: false,
                isSale: false,
                salePercentage: 0,
                category: "men",
                collection: "casual",
                features: ["quartz", "mesh-bracelet", "date-display"],
                stock: 18
            }
        ];
    }
    
    // Get all men's watches
    function getAllMensWatches() {
        // Get watches from ProductManager instead of directly from localStorage
        const storedProducts = ProductManager.getAllProducts() || [];
        console.log(`Found ${storedProducts.length} total products from ProductManager`);
        
        // Filter only men's watches
        const mensWatches = storedProducts.filter(product => product.category === 'men');
        console.log(`Found ${mensWatches.length} men's watches from ProductManager`);
        
        // Only return watches from ProductManager, don't add default ones
        console.log(`Total watches to display: ${mensWatches.length}`);
        return mensWatches;
    }
    
    // Setup pagination
    function setupPagination(watches) {
        // Store all watches
        allWatches = watches;
        
        // Calculate total pages
        const totalPages = Math.ceil(watches.length / itemsPerPage);
        
        // Create pagination elements
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) return;
        
        paginationContainer.innerHTML = '';
        
        // Prev button
        const prevBtn = document.createElement('div');
        prevBtn.className = 'pagination-btn prev-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                goToPage(currentPage - 1);
            }
        });
        paginationContainer.appendChild(prevBtn);
        
        // Page buttons (only show max 5 pages with ellipsis)
        if (totalPages <= 5) {
            // Show all pages if 5 or fewer
            for (let i = 1; i <= totalPages; i++) {
                createPageButton(i, paginationContainer);
            }
        } else {
            // Show pages with ellipsis
            if (currentPage <= 3) {
                // Near start
                for (let i = 1; i <= 4; i++) {
                    createPageButton(i, paginationContainer);
                }
                createEllipsis(paginationContainer);
                createPageButton(totalPages, paginationContainer);
            } else if (currentPage >= totalPages - 2) {
                // Near end
                createPageButton(1, paginationContainer);
                createEllipsis(paginationContainer);
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    createPageButton(i, paginationContainer);
                }
            } else {
                // Middle
                createPageButton(1, paginationContainer);
                createEllipsis(paginationContainer);
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    createPageButton(i, paginationContainer);
                }
                createEllipsis(paginationContainer);
                createPageButton(totalPages, paginationContainer);
            }
        }
        
        // Next button
        const nextBtn = document.createElement('div');
        nextBtn.className = 'pagination-btn next-btn';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                goToPage(currentPage + 1);
            }
        });
        paginationContainer.appendChild(nextBtn);
        
        // Handle prev/next button states
        if (currentPage === 1) {
            prevBtn.classList.add('disabled');
        }
        if (currentPage === totalPages || totalPages === 0) {
            nextBtn.classList.add('disabled');
        }
        
        // Display current page items
        displayCurrentPageItems();
    }
    
    function createPageButton(pageNum, container) {
        const pageBtn = document.createElement('div');
        pageBtn.className = 'pagination-btn page-btn';
        if (pageNum === currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.textContent = pageNum;
        pageBtn.addEventListener('click', () => {
            goToPage(pageNum);
        });
        container.appendChild(pageBtn);
    }
    
    function createEllipsis(container) {
        const ellipsis = document.createElement('div');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = '...';
        container.appendChild(ellipsis);
    }
    
    function goToPage(pageNum) {
        currentPage = pageNum;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setupPagination(allWatches);
    }
    
    function displayCurrentPageItems() {
        if (!productsContainer) return;
        
        // Calculate start and end indices
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, allWatches.length);
        
        // Get current page items
        const currentItems = allWatches.slice(startIndex, endIndex);
        
        // Update product count
        if (productCountElement) {
            productCountElement.textContent = allWatches.length;
        }
        
        // Clear container
        productsContainer.innerHTML = '';
        
        // If no watches found
        if (currentItems.length === 0) {
            productsContainer.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3>No watches found</h3>
                    <p>Try adjusting your filters or check back later for new arrivals.</p>
                </div>
            `;
            return;
        }
        
        // Add watches to container
        currentItems.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card fade-up';
            card.dataset.id = product.id;
            
            // Build product tags HTML
            let tagsHtml = '<div class="product-tags">';
            if (product.isNew) {
                tagsHtml += '<span class="product-tag new-tag">New</span>';
            }
            if (product.isSale) {
                tagsHtml += `<span class="product-tag sale-tag">${product.salePercentage}% Off</span>`;
            }
            tagsHtml += '</div>';
            
            // Build price HTML
            let priceHtml = `<span class="current-price">$${product.price.toFixed(2)}</span>`;
            if (product.isSale && product.originalPrice) {
                priceHtml += `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>`;
            }
            
            card.innerHTML = `
                <div class="product-image">
                    <img src="${getProductImage(product)}" alt="${product.title}">
                    ${product.isNew || product.isSale ? tagsHtml : ''}
                </div>
                <div class="product-details">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        ${priceHtml}
                    </div>
                    <div class="product-actions">
                        <button class="wishlist-btn">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="add-to-cart-btn">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
            
            productsContainer.appendChild(card);
        });
        
        // Add event listeners to buttons
        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        const wishlistBtns = document.querySelectorAll('.wishlist-btn');
        const productCards = document.querySelectorAll('.product-card');
        
        // Add to cart button
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.closest('.product-card').dataset.id;
                const product = allWatches.find(p => p.id.toString() === productId.toString());
                if (product) {
                    addToCart(product);
                }
            });
        });
        
        // Wishlist button
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.closest('.product-card').dataset.id;
                toggleWishlist(productId);
            });
        });
        
        // Product card click
        productCards.forEach(card => {
            card.addEventListener('click', () => {
                const productId = card.dataset.id;
                window.location.href = `product.html?id=${productId}`;
            });
        });
        
        // Update wishlist UI
        updateWishlistUI();
        
        // Animate elements
        animateElements();
    }
    
    // Apply filters
    function applyFilters() {
        let filteredWatches = getAllMensWatches();
        
        // Apply collection filter
        if (collectionFilter && collectionFilter.value) {
            filteredWatches = filteredWatches.filter(watch => watch.collection === collectionFilter.value);
        }
        
        // Apply price filter
        if (priceFilter && priceFilter.value) {
            const priceRange = priceFilter.value.split('-');
            if (priceRange.length === 2) {
                const minPrice = parseFloat(priceRange[0]);
                const maxPrice = priceRange[1] === '+' ? Infinity : parseFloat(priceRange[1]);
                filteredWatches = filteredWatches.filter(watch => watch.price >= minPrice && watch.price <= maxPrice);
            }
        }
        
        // Apply feature filter
        if (featureFilter && featureFilter.value) {
            filteredWatches = filteredWatches.filter(watch => {
                return watch.features && watch.features.includes(featureFilter.value);
            });
        }
        
        // Apply sorting
        if (sortSelect && sortSelect.value) {
            switch (sortSelect.value) {
                case 'price-asc':
                    filteredWatches.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    filteredWatches.sort((a, b) => b.price - a.price);
                    break;
                case 'name-asc':
                    filteredWatches.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'name-desc':
                    filteredWatches.sort((a, b) => b.title.localeCompare(a.title));
                    break;
                // Featured is default
                default:
                    break;
            }
        }
        
        // Reset to first page when filters change
        currentPage = 1;
        
        // Setup pagination with filtered watches
        setupPagination(filteredWatches);
    }
    
    // Clear filters
    function clearFilters() {
        if (collectionFilter) collectionFilter.value = '';
        if (priceFilter) priceFilter.value = '';
        if (featureFilter) featureFilter.value = '';
        if (sortSelect) sortSelect.value = 'featured';
        
        // Reset to first page
        currentPage = 1;
        
        // Get all watches and setup pagination
        setupPagination(getAllMensWatches());
    }
    
    // Filter event listeners
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearFilters();
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
    
    // Animate elements on scroll
    function animateElements() {
        const fadeUpElements = document.querySelectorAll('.fade-up');
        
        fadeUpElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
        });
        
        setTimeout(() => {
            fadeUpElements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);
    }
    
    // Add CSS for notifications and pagination
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: white;
            color: var(--primary);
            padding: 1rem 1.5rem;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 1000;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .notification.success {
            border-left: 4px solid var(--success);
        }
        
        .notification.error {
            border-left: 4px solid var(--danger);
        }
        
        .notification.info {
            border-left: 4px solid #0EA5E9;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--secondary);
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: 1rem;
        }
        
        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 3rem;
        }
        
        .pagination-btn {
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #e2e8f0;
            margin: 0 5px;
            border-radius: 5px;
            cursor: pointer;
            transition: var(--transition);
        }
        
        .pagination-btn.active {
            background-color: var(--accent);
            color: var(--dark);
            border-color: var(--accent);
        }
        
        .pagination-btn:hover:not(.active):not(.disabled) {
            background-color: #f8fafc;
        }
        
        .pagination-btn.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .pagination-ellipsis {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 20px;
            margin: 0 5px;
            color: var(--secondary);
        }
    `;
    
    document.head.appendChild(style);
    
    // Initialize page - using pagination instead of direct rendering
    setupPagination(getAllMensWatches());
});