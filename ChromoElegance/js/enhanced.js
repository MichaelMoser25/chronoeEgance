// Enhanced Features JavaScript for ChronoElegance
document.addEventListener('DOMContentLoaded', function() {
    // New DOM Elements
    const searchIcon = document.querySelector('.search-icon');
    const searchDropdown = document.querySelector('.search-dropdown');
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    const wishlistIcon = document.querySelector('.fa-heart').parentElement;
    const wishlistDropdown = document.querySelector('.wishlist-dropdown');
    const cartIcon = document.querySelector('.fa-shopping-bag').parentElement;
    const cartDropdown = document.querySelector('.cart-dropdown');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchOverlayClose = document.querySelector('.search-close');
    const searchOverlayInput = document.querySelector('.search-overlay-input');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const testPrevBtn = document.querySelector('.testimonial-prev');
    const testNextBtn = document.querySelector('.testimonial-next');
    const backToTopBtn = document.getElementById('back-to-top');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // Search dropdown functionality
    if (searchIcon && searchDropdown) {
        searchIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Close other dropdowns
            wishlistDropdown.classList.remove('active');
            cartDropdown.classList.remove('active');
            
            // Toggle search overlay instead of dropdown
            searchOverlay.classList.add('active');
            setTimeout(() => {
                searchOverlayInput.focus();
            }, 300);
        });
    }

    // Search overlay close
    if (searchOverlayClose && searchOverlay) {
        searchOverlayClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
        
        // Close when clicking outside of the content
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
            }
        });
    }

    // Popular search tags functionality
    const searchTags = document.querySelectorAll('.search-tag');
    searchTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            const tagText = tag.textContent;
            
            if (searchOverlayInput) {
                searchOverlayInput.value = tagText;
                searchOverlayInput.focus();
                
                // Trigger search (in a real application this would search the database)
                performSearch(tagText);
            }
        });
    });

    // Simulate search functionality
    function performSearch(query) {
        // In a real app, this would fetch results from a database
        // For demo purposes, we'll use a sample product list
        
        // Simulated search delay
        setTimeout(() => {
            alert(`Searching for: ${query}. In a real application, this would show matching results.`);
            // This would normally populate search results
        }, 300);
    }

    // Wishlist dropdown functionality
    if (wishlistIcon && wishlistDropdown) {
        wishlistIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Close other dropdowns
            searchDropdown.classList.remove('active');
            cartDropdown.classList.remove('active');
            
            // Toggle wishlist dropdown
            wishlistDropdown.classList.toggle('active');
            
            // Update wishlist items
            updateWishlistDropdown();
        });
    }

    // Cart dropdown functionality
    if (cartIcon && cartDropdown) {
        cartIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Close other dropdowns
            searchDropdown.classList.remove('active');
            wishlistDropdown.classList.remove('active');
            
            // Toggle cart dropdown
            cartDropdown.classList.toggle('active');
            
            // Update cart items
            updateCartDropdown();
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-dropdown') && !e.target.closest('.search-icon')) {
            searchDropdown.classList.remove('active');
        }
        
        if (!e.target.closest('.wishlist-dropdown') && !e.target.closest('.fa-heart')) {
            wishlistDropdown.classList.remove('active');
        }
        
        if (!e.target.closest('.cart-dropdown') && !e.target.closest('.fa-shopping-bag')) {
            cartDropdown.classList.remove('active');
        }
    });

    // Update wishlist dropdown
    function updateWishlistDropdown() {
        // Get wishlist from localStorage
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const wishlistItems = document.querySelector('.wishlist-items');
        const emptyWishlist = document.querySelector('.empty-wishlist');
        
        if (!wishlistItems) return;
        
        // Clear current items except for the empty message
        wishlistItems.innerHTML = '';
        
        if (wishlist.length === 0) {
            // Show empty message
            wishlistItems.innerHTML = '<div class="empty-wishlist">Your wishlist is empty</div>';
            return;
        }
        
        // Get products from localStorage
        const products = JSON.parse(localStorage.getItem('products')) || [];
        
        // Create wishlist items
        wishlist.forEach(productId => {
            const product = products.find(p => p.id.toString() === productId.toString());
            
            if (product) {
                const wishlistItem = document.createElement('div');
                wishlistItem.className = 'wishlist-item';
                wishlistItem.dataset.id = product.id;
                
                wishlistItem.innerHTML = `
                    <img src="${product.imageUrl || product.image || 'https://source.unsplash.com/random/60x60/?watch'}" alt="${product.title}" class="wishlist-item-img">
                    <div class="wishlist-item-info">
                        <h4>${product.title}</h4>
                        <p>$${product.price.toFixed(2)}</p>
                    </div>
                    <div class="wishlist-item-remove">
                        <i class="fas fa-times"></i>
                    </div>
                `;
                
                wishlistItems.appendChild(wishlistItem);
            }
        });
        
        // Add remove functionality
        const removeButtons = wishlistItems.querySelectorAll('.wishlist-item-remove');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = btn.closest('.wishlist-item').dataset.id;
                removeFromWishlist(productId);
                updateWishlistDropdown();
            });
        });
    }

    // Remove from wishlist
    function removeFromWishlist(productId) {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const index = wishlist.indexOf(productId.toString());
        
        if (index !== -1) {
            wishlist.splice(index, 1);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Show notification
            showNotification('Item removed from wishlist', 'info');
        }
    }

    // Update cart dropdown
    function updateCartDropdown() {
        // Get cart from localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItems = document.querySelector('.cart-items');
        const emptyCart = document.querySelector('.empty-cart');
        const totalAmount = document.querySelector('.total-amount');
        
        if (!cartItems) return;
        
        // Clear current items except for the empty message
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            // Show empty message
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            totalAmount.textContent = '$0.00';
            return;
        }
        
        // Calculate total
        let total = 0;
        
        // Create cart items
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.dataset.id = item.id;
            
            cartItem.innerHTML = `
                <img src="${item.image || 'https://source.unsplash.com/random/60x60/?watch'}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <div class="quantity-btn minus">
                            <i class="fas fa-minus"></i>
                        </div>
                        <span class="cart-quantity">${item.quantity}</span>
                        <div class="quantity-btn plus">
                            <i class="fas fa-plus"></i>
                        </div>
                    </div>
                </div>
                <div class="cart-item-remove">
                    <i class="fas fa-times"></i>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // Update total
        totalAmount.textContent = `$${total.toFixed(2)}`;
        
        // Add quantity change functionality
        const minusButtons = cartItems.querySelectorAll('.minus');
        const plusButtons = cartItems.querySelectorAll('.plus');
        const removeButtons = cartItems.querySelectorAll('.cart-item-remove');
        
        minusButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = btn.closest('.cart-item').dataset.id;
                updateCartItemQuantity(productId, -1);
            });
        });
        
        plusButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = btn.closest('.cart-item').dataset.id;
                updateCartItemQuantity(productId, 1);
            });
        });
        
        removeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = btn.closest('.cart-item').dataset.id;
                removeFromCart(productId);
            });
        });
    }

    // Update cart item quantity
    function updateCartItemQuantity(productId, change) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const item = cart.find(item => item.id.toString() === productId.toString());
        
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                // Remove item if quantity is 0 or less
                removeFromCart(productId);
            } else {
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDropdown();
                updateCartCount();
            }
        }
    }

    // Remove from cart
    function removeFromCart(productId) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const index = cart.findIndex(item => item.id.toString() === productId.toString());
        
        if (index !== -1) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartDropdown();
            updateCartCount();
            
            // Show notification
            showNotification('Item removed from cart', 'info');
        }
    }

    // Cart checkout button
    const checkoutBtn = document.querySelector('.cart-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (cart.length === 0) {
                showNotification('Your cart is empty', 'error');
            } else {
                // In a real app, this would redirect to checkout page
                alert('Proceeding to checkout. In a real application, this would take you to a checkout page.');
            }
        });
    }

    // Product filtering with tabs
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Get category to filter
                const category = btn.dataset.category;
                
                // Filter products
                filterProducts(category);
            });
        });
    }

    // Filter products by category
    function filterProducts(category) {
        const products = document.querySelectorAll('.product-card');
        
        if (products.length === 0) return;
        
        products.forEach(product => {
            if (category === 'all' || product.dataset.category === category) {
                product.style.display = 'block';
                
                // Add animation
                product.classList.remove('fade-up');
                void product.offsetWidth; // Trigger reflow
                product.classList.add('fade-up');
            } else {
                product.style.display = 'none';
            }
        });
    }

    // Improved testimonial slider
    if (testPrevBtn && testNextBtn) {
        const testimonialSlides = document.querySelectorAll('.testimonial-slide');
        const testimonialDots = document.querySelectorAll('.dot');
        let currentSlide = 0;
        
        // Previous slide button
        testPrevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
            changeTestimonialSlide(currentSlide);
        });
        
        // Next slide button
        testNextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            changeTestimonialSlide(currentSlide);
        });
        
        // Change slide function
        function changeTestimonialSlide(slideIndex) {
            // Hide all slides
            testimonialSlides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Remove active class from all dots
            testimonialDots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Show current slide
            testimonialSlides[slideIndex].classList.add('active');
            testimonialDots[slideIndex].classList.add('active');
        }
    }

    // Back to top button
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        // Scroll to top when clicking button
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Scroll indicator functionality
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            // Scroll to the next section
            const heroSection = document.querySelector('.hero');
            const nextSection = heroSection.nextElementSibling;
            
            if (nextSection) {
                nextSection.scrollIntoView({
                    behavior: 'smooth'
                });
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

    // Initialize functions on page load
    updateCartCount();
    
    // Add data-category attributes to products for filtering
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        if (!card.dataset.category) {
            // Set default category if not already set
            // In a real application this would come from the product data
            card.dataset.category = 'all';
        }
    });
    
    // Load initial tab content
    const initialTab = document.querySelector('.tab-btn.active');
    if (initialTab) {
        filterProducts(initialTab.dataset.category);
    }
    
    // Instagram gallery item functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // In a real app, this would open the Instagram post
            window.open('https://www.instagram.com/chronoelegance', '_blank');
        });
    });
});