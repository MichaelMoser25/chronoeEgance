// Collections Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('header');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const adminLoginLink = document.querySelector('.nav-icon .fa-user');
    const adminModal = document.getElementById('admin-modal');
    const adminClose = document.querySelector('.admin-close');
    const adminLoginForm = document.getElementById('admin-login-form');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    // Cart and wishlist
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
    
    // Add to cart functionality for featured watches
    const viewDetailsBtns = document.querySelectorAll('.add-to-cart-btn');
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const watchCard = btn.closest('.watch-card');
            const title = watchCard.querySelector('h3').textContent;
            showNotification(`Viewing details for ${title}`);
            // In a real implementation, this would navigate to the product page
        });
    });
    
    // Wishlist functionality for featured watches
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const watchCard = btn.closest('.watch-card');
            const title = watchCard.querySelector('h3').textContent;
            
            // Toggle heart icon
            const heartIcon = btn.querySelector('i');
            if (heartIcon.classList.contains('far')) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                heartIcon.style.color = '#EF4444';
                showNotification(`${title} added to wishlist!`);
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                heartIcon.style.color = '';
                showNotification(`${title} removed from wishlist!`, 'info');
            }
        });
    });
    
    // Animation for collection showcase sections
    const collectionShowcases = document.querySelectorAll('.collection-showcase');
    const animateOnScroll = () => {
        collectionShowcases.forEach(showcase => {
            const showcaseTop = showcase.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (showcaseTop < windowHeight * 0.8) {
                showcase.classList.add('animate');
            }
        });
    };
    
    // Add initial class for animation
    collectionShowcases.forEach(showcase => {
        showcase.classList.add('fade-in');
    });
    
    // Listen for scroll to trigger animations
    window.addEventListener('scroll', animateOnScroll);
    // Initial check on page load
    animateOnScroll();
    
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
        // Check if notification container exists, create if not
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
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
    
    // Add CSS for notifications and animations
    const style = document.createElement('style');
    style.textContent = `
        .notification-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .notification {
            background-color: white;
            color: var(--primary);
            padding: 1rem 1.5rem;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            transform: translateX(100px);
            opacity: 0;
            transition: all 0.3s ease;
            min-width: 300px;
        }
        
        .notification.success {
            border-left: 4px solid #10B981;
        }
        
        .notification.error {
            border-left: 4px solid #EF4444;
        }
        
        .notification.info {
            border-left: 4px solid #0EA5E9;
        }
        
        .notification.show {
            transform: translateX(0);
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
        
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .animate {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    
    document.head.appendChild(style);
});