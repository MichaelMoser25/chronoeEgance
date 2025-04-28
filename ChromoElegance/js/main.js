// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('header');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const adminLoginLink = document.querySelector('.nav-icon .fa-user');
    const adminModal = document.getElementById('admin-modal');
    const adminClose = document.querySelector('.admin-close');
    const adminLoginForm = document.getElementById('admin-login-form');
    const productCardsContainer = document.querySelector('.products-container');
    const testimonialDots = document.querySelectorAll('.dot');
    const newsletterForm = document.querySelector('.newsletter-form');

    // Get products from localStorage (from admin panel) or use default products
    let products = JSON.parse(localStorage.getItem('products')) || [
        {
            id: 1,
            title: "Celestial Chronograph",
            description: "Stainless steel case with black leather strap",
            price: 1250.00,
            originalPrice: null,
            image: "https://source.unsplash.com/random/300x300/?luxury,watch,1",
            isNew: true,
            isSale: false,
            salePercentage: 0,
            category: "men",
            collection: "luxury"
        },
        {
            id: 2,
            title: "Royal Automatic",
            description: "Gold-tone case with brown alligator strap",
            price: 1950.00,
            originalPrice: 2450.00,
            image: "https://source.unsplash.com/random/300x300/?luxury,watch,2",
            isNew: false,
            isSale: true,
            salePercentage: 20,
            category: "men",
            collection: "luxury"
        },
        {
            id: 3,
            title: "Oceanic Diver",
            description: "Blue ceramic bezel with stainless steel bracelet",
            price: 2850.00,
            originalPrice: null,
            image: "https://source.unsplash.com/random/300x300/?luxury,watch,3",
            isNew: false,
            isSale: false,
            salePercentage: 0,
            category: "men",
            collection: "sport"
        },
        {
            id: 4,
            title: "Alpine Reserve",
            description: "Titanium case with integrated rubber strap",
            price: 3450.00,
            originalPrice: null,
            image: "https://source.unsplash.com/random/300x300/?luxury,watch,4",
            isNew: true,
            isSale: false,
            salePercentage: 0,
            category: "men",
            collection: "sport"
        },
        {
            id: 5,
            title: "Midnight Elegance",
            description: "Black PVD case with matching bracelet",
            price: 1850.00,
            originalPrice: 2100.00,
            image: "https://source.unsplash.com/random/300x300/?luxury,watch,5",
            isNew: false,
            isSale: true,
            salePercentage: 12,
            category: "women",
            collection: "luxury"
        },
        {
            id: 6,
            title: "Rose Gold Petit",
            description: "Rose gold case with burgundy leather strap",
            price: 1650.00,
            originalPrice: null,
            image: "https://source.unsplash.com/random/300x300/?luxury,watch,6",
            isNew: true,
            isSale: false,
            salePercentage: 0,
            category: "women",
            collection: "luxury"
        },
        {
            id: 7,
            title: "Vintage Heritage",
            description: "Bronze case with aged leather strap",
            price: 2250.00,
            originalPrice: null,
            image: "https://source.unsplash.com/random/300x300/?vintage,watch,1",
            isNew: false,
            isSale: false,
            salePercentage: 0,
            category: "men",
            collection: "vintage"
        },
        {
            id: 8,
            title: "Diamond Constellation",
            description: "White gold case with diamond bezel",
            price: 4750.00,
            originalPrice: 5500.00,
            image: "https://source.unsplash.com/random/300x300/?luxury,watch,diamond",
            isNew: false,
            isSale: true,
            salePercentage: 14,
            category: "women",
            collection: "luxury"
        }
    ];

    // Cart data
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Test image storage
    const storageResult = testImageStorage();
    if (!storageResult) {
        showToast('Warning: Your browser may have limited storage for images. Large images may not save correctly.', 'warning');
    }


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
            
            // Simple authentication (in a real app, this would be server-side)
            if (username === 'admin' && password === 'admin123') {
                // Redirect to admin dashboard
                localStorage.setItem('adminLoggedIn', 'true');
                window.location.href = 'admin.html';
            } else {
                alert('Invalid credentials. Please try again.');
            }
        });
    }

    // Animate elements on scroll
    const fadeUpElements = document.querySelectorAll('.fade-up');
    
    const animateOnScroll = () => {
        fadeUpElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Run once on page load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Testimonial slider functionality
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    let currentSlide = 0;

    // Change testimonial slide
    const changeSlide = (slideIndex) => {
        testimonialSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        testimonialDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        testimonialSlides[slideIndex].classList.add('active');
        testimonialDots[slideIndex].classList.add('active');
        currentSlide = slideIndex;
    };
    
    // Auto slide change
    let testimonialInterval;
    
    const startTestimonialSlider = () => {
        testimonialInterval = setInterval(() => {
            let nextSlide = (currentSlide + 1) % testimonialSlides.length;
            changeSlide(nextSlide);
        }, 5000);
    };
    
    if (testimonialSlides.length > 0) {
        startTestimonialSlider();
        
        // Manual slide change with dots
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(testimonialInterval);
                changeSlide(index);
                startTestimonialSlider();
            });
        });
    }

    // Wishlist functionality
    const updateWishlist = (productId) => {
        const index = wishlist.indexOf(productId);
        
        if (index === -1) {
            // Add to wishlist
            wishlist.push(productId);
        } else {
            // Remove from wishlist
            wishlist.splice(index, 1);
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistUI();
    };
    
    const updateWishlistUI = () => {
        // Get updated set of wishlist buttons
        const currentWishlistBtns = document.querySelectorAll('.wishlist-btn');
        
        currentWishlistBtns.forEach(btn => {
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
    };

    // Cart functionality
    const updateCart = (productId) => {
        const product = products.find(p => p.id === productId || p.id.toString() === productId.toString());
        
        if (!product) return;
        
        const existingItem = cart.find(item => item.id === productId || item.id.toString() === productId.toString());
        
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
        updateCartUI();
        
        // Show cart added notification
        showNotification(`${product.title} added to cart!`);
    };
    
    const updateCartUI = () => {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    };
    
    // Initialize cart UI
    updateCartUI();

    
    
    // Render products dynamically on the homepage
    function renderProducts() {
        if (!productCardsContainer) return;
        
        // Clear existing product cards
        productCardsContainer.innerHTML = '';
        
        // Get products to display - use all products or limit to 4 if there are many
        const productsToShow = products.length > 0 ? (products.length > 8 ? products.slice(0, 8) : products) : [];
        
        if (productsToShow.length === 0) {
            // Add some default products if none exist
            productsToShow.push(
                {
                    id: 'default1',
                    title: "Celestial Chronograph",
                    description: "Stainless steel case with black leather strap",
                    price: 1250.00,
                    imageUrl: "https://source.unsplash.com/random/300x300/?luxury,watch,1",
                    isNew: true,
                    collection: "luxury",
                    isSale: false
                },
                {
                    id: 'default2',
                    title: "Royal Automatic",
                    description: "Gold-tone case with brown alligator strap",
                    price: 1950.00,
                    originalPrice: 2450.00,
                    imageUrl: "https://source.unsplash.com/random/300x300/?luxury,watch,2",
                    isNew: false,
                    collection: "luxury",
                    isSale: true,
                    salePercentage: 20
                },
                {
                    id: 'default3',
                    title: "Oceanic Diver",
                    description: "Blue ceramic bezel with stainless steel bracelet",
                    price: 2850.00,
                    imageUrl: "https://source.unsplash.com/random/300x300/?luxury,watch,3",
                    isNew: false,
                    collection: "sport",
                    isSale: false
                },
                {
                    id: 'default4',
                    title: "Alpine Reserve",
                    description: "Titanium case with integrated rubber strap",
                    price: 3450.00,
                    imageUrl: "https://source.unsplash.com/random/300x300/?luxury,watch,4",
                    isNew: true,
                    collection: "sport",
                    isSale: false
                }
            );
        }
        
        productsToShow.forEach(product => {
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
            let priceHtml = `<span class="current-price">${product.price.toFixed(2)}</span>`;
            if (product.isSale && product.originalPrice) {
                priceHtml += `<span class="original-price">${product.originalPrice.toFixed(2)}</span>`;
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
            
            productCardsContainer.appendChild(card);
        });
        
        // Reattach event listeners
        const productCards = document.querySelectorAll('.product-card');
        const wishlistBtns = document.querySelectorAll('.wishlist-btn');
        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        
        // Product card click to open product page
        productCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.wishlist-btn') && !e.target.closest('.add-to-cart-btn')) {
                    const productId = card.dataset.id;
                    window.location.href = `product.html?id=${productId}`;
                }
            });
        });
        
        // Add event listeners to wishlist buttons
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.closest('.product-card').dataset.id;
                updateWishlist(productId);
            });
        });
        
        // Add event listeners to add to cart buttons
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.closest('.product-card').dataset.id;
                updateCart(productId);
            });
        });
        
        // Initialize wishlist UI
        updateWishlistUI();
        
        // Animate elements
        animateOnScroll();
    }
    
    // Call render products function
    renderProducts();

    // Newsletter subscription
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            
            if (email && isValidEmail(email)) {
                // In a real application, this would send the email to a server
                showNotification('Thank you for subscribing to our newsletter!');
                newsletterForm.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }

    // Utility function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function testImageStorage() {
        // Test image (a small red dot as base64)
        const testBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
        
        // Try storing it
        try {
            localStorage.setItem('test_image_storage', testBase64);
            const retrieved = localStorage.getItem('test_image_storage');
            
            if (retrieved === testBase64) {
                console.log('Image storage test successful!');
                return true;
            } else {
                console.error('Image storage test failed: Retrieved data does not match stored data');
                return false;
            }
        } catch (error) {
            console.error('Image storage test failed:', error);
            return false;
        } finally {
            // Clean up
            localStorage.removeItem('test_image_storage');
        }
    }
    
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
    

    // Notification system
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            hideNotification(notification);
        }, 3000);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            hideNotification(notification);
        });
    }
    
    function hideNotification(notification) {
        notification.classList.remove('show');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Add product IDs to product cards
    productCards.forEach((card, index) => {
        card.dataset.id = products[index].id;
    });

    // Admin Dashboard Functionality
    // Check if we are on the admin page
    const adminDashboard = document.querySelector('.admin-dashboard');
    
    if (adminDashboard) {
        const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        
        if (!isLoggedIn) {
            window.location.href = '../pages/index.html';
            return;
        }
        
        adminDashboard.classList.add('active');
        
        // Admin Tabs
        const adminTabs = document.querySelectorAll('.admin-tab');
        const adminContents = document.querySelectorAll('.admin-content');
        
        adminTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                adminTabs.forEach(t => t.classList.remove('active'));
                adminContents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                adminContents[index].classList.add('active');
            });
        });
        
        // Product Form Functionality
        const productForm = document.getElementById('product-form');
        const imageInput = document.getElementById('product-image');
        const imagePreview = document.querySelector('.image-preview');
        
        if (imageInput) {
            imageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                
                if (file) {
                    const reader = new FileReader();
                    
                    reader.onload = (e) => {
                        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Product Preview">`;
                    };
                    
                    reader.readAsDataURL(file);
                }
            });
        }
        
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form values
                const title = document.getElementById('product-title').value;
                const description = document.getElementById('product-description').value;
                const price = parseFloat(document.getElementById('product-price').value);
                const category = document.getElementById('product-category').value;
                const collection = document.getElementById('product-collection').value;
                const isNew = document.getElementById('product-new').checked;
                const isSale = document.getElementById('product-sale').checked;
                const salePercentage = isSale ? parseFloat(document.getElementById('product-sale-percentage').value) : 0;
                
                // Create new product object
                const newProduct = {
                    id: products.length + 1,
                    title,
                    description,
                    price,
                    originalPrice: isSale ? price * (1 + salePercentage / 100) : null,
                    image: imagePreview.querySelector('img') ? imagePreview.querySelector('img').src : 'https://source.unsplash.com/random/300x300/?watch',
                    isNew,
                    isSale,
                    salePercentage,
                    category,
                    collection
                };
                
                // Add to products array
                products.push(newProduct);
                
                // In a real app, this would send data to a server
                showNotification('Product added successfully!');
                
                // Reset form
                productForm.reset();
                imagePreview.innerHTML = '<i class="fas fa-image" style="font-size: 3rem; color: #cbd5e1;"></i>';
                
                // Update products table
                populateProductsTable();
            });
        }
        
        // Products Table
        const productsTable = document.querySelector('.products-table tbody');
        
        function populateProductsTable() {
            if (!productsTable) return;
            
            productsTable.innerHTML = '';
            
            products.forEach(product => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>
                        <img src="${product.image}" alt="${product.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                    </td>
                    <td>${product.title}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>${product.category}</td>
                    <td>${product.collection}</td>
                    <td>${product.isNew ? '<span class="badge new">New</span>' : ''}${product.isSale ? `<span class="badge sale">${product.salePercentage}% Off</span>` : ''}</td>
                    <td>
                        <div class="action-btns">
                            <button class="edit-btn" data-id="${product.id}">Edit</button>
                            <button class="delete-btn" data-id="${product.id}">Delete</button>
                        </div>
                    </td>
                `;
                
                productsTable.appendChild(row);
            });
            
            // Add event listeners to edit and delete buttons
            const editBtns = document.querySelectorAll('.edit-btn');
            const deleteBtns = document.querySelectorAll('.delete-btn');
            
            editBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const productId = parseInt(btn.dataset.id);
                    // In a real app, this would populate the form with product data
                    showNotification('Edit functionality would be implemented in a full application.');
                });
            });
            
            deleteBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const productId = parseInt(btn.dataset.id);
                    
                    // Remove product from array
                    const index = products.findIndex(p => p.id === productId);
                    
                    if (index !== -1) {
                        products.splice(index, 1);
                        
                        // Update table
                        populateProductsTable();
                        
                        showNotification('Product deleted successfully!');
                    }
                });
            });
        }
        
        // Initialize products table
        populateProductsTable();
        
        // Logout functionality
        const logoutBtn = document.querySelector('.admin-logout');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('adminLoggedIn');
                window.location.href = 'index.html';
            });
        }
    }

    // Add CSS for notifications
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
        
        .badge {
            display: inline-block;
            padding: 0.2rem 0.5rem;
            border-radius: 20px;
            font-size: 0.7rem;
            font-weight: 600;
            margin-right: 0.3rem;
        }
        
        .badge.new {
            background-color: var(--accent);
            color: var(--dark);
        }
        
        .badge.sale {
            background-color: var(--danger);
            color: white;
        }
    `;
    
    document.head.appendChild(style);
});