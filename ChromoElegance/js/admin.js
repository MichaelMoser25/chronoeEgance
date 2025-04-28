// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // File to Base64 Conversion Utility
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Enhance the existing image upload functionality
    if (uploadBtn && imageInput && imagePreview && removeImgBtn) {
        uploadBtn.addEventListener('click', function() {
            imageInput.click();
        });
        
        imageInput.addEventListener('change', async function() {
            const file = this.files[0];
            if (file) {
                try {
                    // Convert file to base64 for storage
                    const base64Image = await fileToBase64(file);
                    
                    // Store the base64 image temporarily in a data attribute
                    imagePreview.dataset.base64Image = base64Image;
                    
                    // Display preview
                    imagePreview.innerHTML = `<img src="${base64Image}" alt="Product Preview">`;
                    removeImgBtn.style.display = 'block';
                    
                    // Show success message
                    showToast('Image uploaded successfully!', 'success');
                } catch (error) {
                    console.error('Error processing image:', error);
                    showToast('Failed to process image. Please try again.', 'error');
                }
            }
        });
        
        removeImgBtn.addEventListener('click', function() {
            imagePreview.innerHTML = '<i class="fas fa-image" style="font-size: 3rem; color: #cbd5e1;"></i>';
            imageInput.value = '';
            // Clear the stored base64 image
            delete imagePreview.dataset.base64Image;
            this.style.display = 'none';
        });
    }
    
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn && !window.location.href.includes('index.html')) {
        window.location.href = '../pages/index.html';
        return;
    }

    // Sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    const mainContent = document.querySelector('.admin-main');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            
            // Change icon direction
            if (sidebar.classList.contains('collapsed')) {
                sidebarToggle.innerHTML = '<i class="fas fa-chevron-right"></i>';
            } else {
                sidebarToggle.innerHTML = '<i class="fas fa-chevron-left"></i>';
            }
        });
    }
    
    // Tab switching
    const tabs = document.querySelectorAll('.admin-tab');
    const contents = document.querySelectorAll('.admin-content');
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active class to the clicked tab and corresponding content
            tab.classList.add('active');
            contents[index].classList.add('active');
        });
    });
    
    // Sale percentage toggle
    const saleCheckbox = document.getElementById('product-sale');
    const salePercentage = document.getElementById('sale-percentage');
    
    if (saleCheckbox && salePercentage) {
        saleCheckbox.addEventListener('change', function() {
            if (this.checked) {
                salePercentage.classList.add('active');
            } else {
                salePercentage.classList.remove('active');
            }
        });
    }
    
    // Image upload preview
    const uploadBtn = document.getElementById('upload-btn');
    const imageInput = document.getElementById('product-image');
    const imagePreview = document.getElementById('image-preview');
    const removeImgBtn = document.getElementById('remove-img-btn');
    
    if (uploadBtn && imageInput && imagePreview && removeImgBtn) {
        uploadBtn.addEventListener('click', function() {
            imageInput.click();
        });
        
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Product Preview">`;
                    removeImgBtn.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
        
        removeImgBtn.addEventListener('click', function() {
            imagePreview.innerHTML = '<i class="fas fa-image" style="font-size: 3rem; color: #cbd5e1;"></i>';
            imageInput.value = '';
            this.style.display = 'none';
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            showToast('Logging out...', 'info');
            setTimeout(() => {
                localStorage.removeItem('adminLoggedIn');
                window.location.href = 'index.html';
            }, 1500);
        });
    }
    
    // Form submission
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const productData = {};
            
            formData.forEach((value, key) => {
                if (key === 'image') {
                    // Skip the image file input as we'll handle it separately
                    return;
                }
                
                // Convert checkbox values to boolean
                if (key === 'isNew' || key === 'isSale' || key === 'isFeatured') {
                    productData[key] = value === 'on';
                }
                // Convert number inputs to numbers
                else if (key === 'price' || key === 'salePercentage' || key === 'stock') {
                    productData[key] = parseFloat(value);
                }
                else {
                    productData[key] = value;
                }
            });
            
            // Add image URL from preview if available
            if (imagePreview.dataset.base64Image) {
                productData.imageUrl = imagePreview.dataset.base64Image;
            } else {
                productData.imageUrl = 'https://source.unsplash.com/random/300x300/?luxury,watch';
            }
            
            // Calculate original price if on sale
            if (productData.isSale && productData.salePercentage > 0) {
                productData.originalPrice = productData.price * (1 + productData.salePercentage / 100);
            } else {
                productData.originalPrice = null;
            }
            
            // Add features from the specifications field
            if (productData.specs) {
                // Extract features from specs text (assuming comma-separated list)
                productData.features = productData.specs
                    .split(',')
                    .map(item => item.trim().toLowerCase().replace(/\s+/g, '-'))
                    .filter(item => item.length > 0);
            } else {
                productData.features = [];
            }
            
            // Edit mode - check if there's a product ID
            const productId = document.getElementById('product-id')?.value;
            
            if (productId) {
                // Update existing product
                ProductManager.updateProduct(productId, productData);
                showToast('Product updated successfully!', 'success');
            } else {
                // Add new product
                ProductManager.addProduct(productData);
                showToast('Product added successfully!', 'success');
            }
            
            // Reset form
            this.reset();
            imagePreview.innerHTML = '<i class="fas fa-image" style="font-size: 3rem; color: #cbd5e1;"></i>';
            delete imagePreview.dataset.base64Image; // Clear stored base64 image
            if (removeImgBtn) removeImgBtn.style.display = 'none';
            if (salePercentage) salePercentage.classList.remove('active');
            
            // Remove product ID if it exists
            const idInput = document.getElementById('product-id');
            if (idInput) idInput.remove();
            
            // Update form title and submit button
            const formTitle = document.querySelector('.form-title');
            const submitBtn = productForm.querySelector('button[type="submit"]');
            
            if (formTitle) formTitle.textContent = 'Add New Watch';
            if (submitBtn) submitBtn.textContent = 'Add Product';
            
            // Update dashboard stats and product table
            updateDashboardStats();
            updateProductTable();
        });
    }    
    // Category form submission
    const categoryForm = document.querySelector('.admin-content:nth-child(3) .admin-form');
    if (categoryForm) {
        categoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // This would be implemented in a full version
            showToast('Category management is not implemented in this demo', 'info');
            this.reset();
        });
    }
    
    // Product search functionality
    const productSearch = document.querySelector('.search-box input');
    if (productSearch) {
        productSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterProducts(searchTerm);
        });
    }
    
    // Product filters
    const filterSelects = document.querySelectorAll('.filter-select');
    if (filterSelects.length > 0) {
        filterSelects.forEach(select => {
            select.addEventListener('change', function() {
                applyFilters();
            });
        });
    }
    
    // Edit & Delete product buttons
    setupProductTableActions();
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Update product table
    updateProductTable();
    
    // Update category table
    updateCategoryTable();
    
    // Auto-generate slug from category name
    const categoryNameInput = document.getElementById('category-name');
    const categorySlugInput = document.getElementById('category-slug');
    
    if (categoryNameInput && categorySlugInput) {
        categoryNameInput.addEventListener('input', function() {
            categorySlugInput.value = generateSlug(this.value);
        });
    }

    // Show welcome toast
    setTimeout(() => {
        showToast('Welcome to the admin dashboard!', 'info');
    }, 500);

    // Helper Functions
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon;
        switch(type) {
            case 'success': icon = 'fa-check-circle'; break;
            case 'error': icon = 'fa-exclamation-circle'; break;
            case 'warning': icon = 'fa-exclamation-triangle'; break;
            case 'info': 
            default: icon = 'fa-info-circle';
        }
        
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${icon} toast-icon ${type}"></i>
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
        
        // Close button functionality
        toast.querySelector('.toast-close').addEventListener('click', function() {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
    }
    
    function updateProductTable() {
        const productsTableBody = document.querySelector('.products-table tbody');
        if (!productsTableBody) return;
        
        // Get products from ProductManager
        const products = ProductManager.getAllProducts();
        
        if (products.length === 0) {
            productsTableBody.innerHTML = `
                <tr>
                    <td colspan="8">
                        <div class="no-data">
                            <i class="fas fa-box-open"></i>
                            <h3>No products found</h3>
                            <p>Add your first product to get started.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        // Clear existing rows
        productsTableBody.innerHTML = '';
        
        // Add product rows
        products.forEach(product => {
            const row = document.createElement('tr');
            row.dataset.id = product.id;
            
            // Create status badges
            let statusBadges = '';
            if (product.isNew) {
                statusBadges += '<span class="badge new">New</span>';
            }
            if (product.isSale) {
                statusBadges += `<span class="badge sale">${product.salePercentage}% Off</span>`;
            }
            if (!product.isNew && !product.isSale) {
                statusBadges += '<span class="badge active">Active</span>';
            }
            
            // Get category name
            const categories = ProductManager.getAllCategories();
            const category = categories.find(c => c.id === product.category);
            const categoryName = category ? category.name : product.category;
            
            // Get collection name
            const collections = ProductManager.getAllCollections();
            const collection = collections.find(c => c.id === product.collection);
            const collectionName = collection ? collection.name : product.collection;
            
            row.innerHTML = `
                <td><img src="${product.imageUrl}" alt="${product.title}" class="table-img"></td>
                <td>${product.title}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${categoryName}</td>
                <td>${collectionName}</td>
                <td>${product.stock || 0}</td>
                <td>${statusBadges}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn btn-sm edit-product" data-id="${product.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-product" data-id="${product.id}">Delete</button>
                    </div>
                </td>
            `;
            
            productsTableBody.appendChild(row);
        });
        
        // Reattach event listeners
        setupProductTableActions();
    }
    
    function updateCategoryTable() {
        const categoriesTableBody = document.querySelector('.categories-table tbody');
        if (!categoriesTableBody) return;
        
        // Get categories from ProductManager
        const categories = ProductManager.getAllCategories();
        
        if (categories.length === 0) {
            categoriesTableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        <div class="no-data">
                            <i class="fas fa-tags"></i>
                            <h3>No categories found</h3>
                            <p>Add your first category to get started.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        // Clear existing rows
        categoriesTableBody.innerHTML = '';
        
        // Add category rows
        categories.forEach(category => {
            const row = document.createElement('tr');
            row.dataset.id = category.id;
            
            // Get product count for category
            const productCount = ProductManager.countProductsInCategory(category.id);
            
            row.innerHTML = `
                <td>${category.name}</td>
                <td>${category.slug}</td>
                <td>${category.description}</td>
                <td>${productCount}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn btn-sm edit-category" data-id="${category.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-category" data-id="${category.id}">Delete</button>
                    </div>
                </td>
            `;
            
            categoriesTableBody.appendChild(row);
        });
    }
    
    function setupProductTableActions() {
        // Edit product buttons
        const editBtns = document.querySelectorAll('.edit-product');
        editBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.dataset.id;
                editProduct(productId);
            });
        });
        
        // Delete product buttons
        const deleteBtns = document.querySelectorAll('.delete-product');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.dataset.id;
                if (confirm('Are you sure you want to delete this product?')) {
                    ProductManager.deleteProduct(productId);
                    updateProductTable();
                    updateDashboardStats();
                    showToast('Product deleted successfully!', 'success');
                }
            });
        });
    }
    
    function editProduct(productId) {
        // Get product data
        const product = ProductManager.getProductById(productId);
        
        if (!product) return;
        
        // Switch to Add Product tab
        tabs[0].click();
        
        // Populate form with product data
        document.getElementById('product-title').value = product.title;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-collection').value = product.collection;
        document.getElementById('product-new').checked = product.isNew;
        document.getElementById('product-sale').checked = product.isSale;
        document.getElementById('product-featured').checked = product.isFeatured;
        document.getElementById('product-sale-percentage').value = product.salePercentage || 10;
        document.getElementById('product-stock').value = product.stock || 0;
        
        // Populate specs/features
        // Populate specs/features
if (product.features && product.features.length > 0) {
    document.getElementById('product-specs').value = product.features.join(', ');
}

// Show sale percentage if on sale
if (product.isSale && salePercentage) {
    salePercentage.classList.add('active');
}

// Set image preview if available
if (product.imageUrl) {
    imagePreview.innerHTML = `<img src="${product.imageUrl}" alt="Product Preview">`;
    if (removeImgBtn) removeImgBtn.style.display = 'block';
}

// Update form title and submit button
const formTitle = document.querySelector('.form-title');
const submitBtn = productForm.querySelector('button[type="submit"]');

if (formTitle) formTitle.textContent = 'Edit Product';
if (submitBtn) submitBtn.textContent = 'Update Product';

// Add hidden input for product ID
let idInput = document.getElementById('product-id');
if (!idInput) {
    idInput = document.createElement('input');
    idInput.type = 'hidden';
    idInput.id = 'product-id';
    idInput.name = 'id';
    productForm.appendChild(idInput);
}
idInput.value = productId;

// Scroll to form
productForm.scrollIntoView({ behavior: 'smooth' });
}

function filterProducts(searchTerm) {
    const productRows = document.querySelectorAll('.products-table tbody tr');
    if (productRows.length === 0) return;
    
    productRows.forEach(row => {
        const productName = row.children[1].textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function applyFilters() {
    const categoryFilter = document.querySelector('.filter-select:nth-child(1)').value;
    const collectionFilter = document.querySelector('.filter-select:nth-child(2)').value;
    const sortBy = document.querySelector('.filter-select:nth-child(3)').value;
    
    // Get all products
    let products = ProductManager.getAllProducts();
    
    // Apply category filter
    if (categoryFilter) {
        products = products.filter(p => p.category === categoryFilter);
    }
    
    // Apply collection filter
    if (collectionFilter) {
        products = products.filter(p => p.collection === collectionFilter);
    }
    
    // Apply sorting
    if (sortBy) {
        switch(sortBy) {
            case 'price-asc':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                products.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                products.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'stock-asc':
                products.sort((a, b) => (a.stock || 0) - (b.stock || 0));
                break;
        }
    }
    
    // Update product table with filtered products
    updateProductTableWithFiltered(products);
}

function updateProductTableWithFiltered(products) {
    const productsTableBody = document.querySelector('.products-table tbody');
    if (!productsTableBody) return;
    
    if (products.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    <div class="no-data">
                        <i class="fas fa-filter"></i>
                        <h3>No products match your filters</h3>
                        <p>Try changing your filter criteria.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Clear existing rows
    productsTableBody.innerHTML = '';
    
    // Get all categories and collections for name lookup
    const categories = ProductManager.getAllCategories();
    const collections = ProductManager.getAllCollections();
    
    // Add product rows
    products.forEach(product => {
        const row = document.createElement('tr');
        row.dataset.id = product.id;
        
        // Create status badges
        let statusBadges = '';
        if (product.isNew) {
            statusBadges += '<span class="badge new">New</span>';
        }
        if (product.isSale) {
            statusBadges += `<span class="badge sale">${product.salePercentage}% Off</span>`;
        }
        if (!product.isNew && !product.isSale) {
            statusBadges += '<span class="badge active">Active</span>';
        }
        
        // Get category name
        const category = categories.find(c => c.id === product.category);
        const categoryName = category ? category.name : product.category;
        
        // Get collection name
        const collection = collections.find(c => c.id === product.collection);
        const collectionName = collection ? collection.name : product.collection;
        
        row.innerHTML = `
            <td><img src="${product.imageUrl}" alt="${product.title}" class="table-img"></td>
            <td>${product.title}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${categoryName}</td>
            <td>${collectionName}</td>
            <td>${product.stock || 0}</td>
            <td>${statusBadges}</td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-sm edit-product" data-id="${product.id}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-product" data-id="${product.id}">Delete</button>
                </div>
            </td>
        `;
        
        productsTableBody.appendChild(row);
    });
    
    // Reattach event listeners
    setupProductTableActions();
}

function updateDashboardStats() {
    // Get all products
    const products = ProductManager.getAllProducts();
    
    // Update product count
    const productCount = document.querySelector('.admin-card:nth-child(1) h3');
    if (productCount) {
        productCount.textContent = products.length;
    }
    
    // Calculate total sales (in a real app this would come from order data)
    // For demo purposes, we'll just calculate potential sales based on all products
    const totalSales = products.reduce((sum, product) => {
        return sum + (product.price * (product.stock || 1));
    }, 0);
    
    const salesDisplay = document.querySelector('.admin-card:nth-child(2) h3');
    if (salesDisplay) {
        salesDisplay.textContent = '$' + totalSales.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }
}

function generateSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/&/g, '-and-')      // Replace & with 'and'
        .replace(/[^\w\-]+/g, '')    // Remove all non-word characters
        .replace(/\-\-+/g, '-');     // Replace multiple - with single -
}

// Mobile navigation
const mobileWidth = 768;

function checkMobileView() {
    if (window.innerWidth <= mobileWidth) {
        sidebar.classList.add('collapsed');
        if (sidebarToggle) {
            sidebarToggle.innerHTML = '<i class="fas fa-chevron-right"></i>';
        }
    }
}

// Check on page load
checkMobileView();

// Check on window resize
window.addEventListener('resize', checkMobileView);

// Handle mobile menu toggle
if (window.innerWidth <= mobileWidth) {
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= mobileWidth && 
            !e.target.closest('.admin-sidebar') && 
            !e.target.closest('.sidebar-toggle') && 
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            if (sidebarToggle) sidebarToggle.classList.remove('active');
        }
    });
}

// Pagination
const paginationBtns = document.querySelectorAll('.pagination-btn');
if (paginationBtns.length > 0) {
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // In a real app, this would handle pagination
            // For demo purposes, we just update the active class
            paginationBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}
});