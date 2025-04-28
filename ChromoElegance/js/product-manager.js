// ProductManager.js - A utility for managing products in the watch store

// Define the ProductManager as an immediately invoked function expression (IIFE)
const ProductManager = (function() {
    // Private storage keys
    const KEYS = {
        PRODUCTS: 'chronoElegance_products',
        CATEGORIES: 'chronoElegance_categories',
        COLLECTIONS: 'chronoElegance_collections',
        LAST_ID: 'chronoElegance_lastProductId',
        INITIALIZED: 'chronoElegance_initialized'
    };

    // Default products data
    const DEFAULT_PRODUCTS = [
        {
            id: 'P1001',
            title: "Celestial Chronograph",
            description: "Stainless steel case with black leather strap",
            price: 1250.00,
            originalPrice: null,
            imageUrl: "https://source.unsplash.com/random/300x300/?luxury,watch,1",
            isNew: true,
            isSale: false,
            salePercentage: 0,
            category: "men",
            collection: "luxury",
            features: ["chronograph", "leather-strap", "sapphire-crystal"],
            stock: 15,
            createdAt: new Date().toISOString()
        },
        {
            id: 'P1002',
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
            stock: 8,
            createdAt: new Date().toISOString()
        },
        {
            id: 'P1003',
            title: "Oceanic Diver",
            description: "Blue ceramic bezel with stainless steel bracelet",
            price: 2850.00,
            originalPrice: null,
            imageUrl: "https://source.unsplash.com/random/300x300/?diving,watch",
            isNew: false,
            isSale: false,
            salePercentage: 0,
            category: "men",
            collection: "sport",
            features: ["diving", "ceramic-bezel", "water-resistant-300m"],
            stock: 12,
            createdAt: new Date().toISOString()
        },
        {
            id: 'P1004',
            title: "Alpine Reserve",
            description: "Titanium case with integrated rubber strap",
            price: 3450.00,
            originalPrice: null,
            imageUrl: "https://source.unsplash.com/random/300x300/?luxury,watch,4",
            isNew: true,
            isSale: false,
            salePercentage: 0,
            category: "men",
            collection: "sport",
            features: ["chronograph", "titanium", "rubber-strap"],
            stock: 6,
            createdAt: new Date().toISOString()
        },
        {
            id: 'P1005',
            title: "Vintage Heritage",
            description: "Bronze case with aged leather strap",
            price: 2250.00,
            originalPrice: null,
            imageUrl: "https://source.unsplash.com/random/300x300/?vintage,watch",
            isNew: false,
            isSale: false,
            salePercentage: 0,
            category: "men",
            collection: "vintage",
            features: ["automatic", "leather-strap", "bronze"],
            stock: 10,
            createdAt: new Date().toISOString()
        },
        {
            id: 'P1006',
            title: "Executive Quartz",
            description: "Slim stainless steel case with mesh bracelet",
            price: 950.00,
            originalPrice: null,
            imageUrl: "https://source.unsplash.com/random/300x300/?silver,watch",
            isNew: false,
            isSale: false,
            salePercentage: 0,
            category: "men",
            collection: "casual",
            features: ["quartz", "mesh-bracelet", "date-display"],
            stock: 18,
            createdAt: new Date().toISOString()
        },
        {
            id: 'P1007',
            title: "Rose Gold Petit",
            description: "Rose gold case with burgundy leather strap",
            price: 1650.00,
            originalPrice: null,
            imageUrl: "https://source.unsplash.com/random/300x300/?womens,watch,1",
            isNew: true,
            isSale: false,
            salePercentage: 0,
            category: "women",
            collection: "luxury",
            features: ["quartz", "leather-strap", "rose-gold"],
            stock: 14,
            createdAt: new Date().toISOString()
        },
        {
            id: 'P1008',
            title: "Diamond Constellation",
            description: "White gold case with diamond bezel",
            price: 4750.00,
            originalPrice: 5500.00,
            imageUrl: "https://source.unsplash.com/random/300x300/?luxury,watch,diamond",
            isNew: false,
            isSale: true,
            salePercentage: 14,
            category: "women",
            collection: "luxury",
            features: ["automatic", "diamond-bezel", "white-gold"],
            stock: 5,
            createdAt: new Date().toISOString()
        },
        {
            id: 'P1009',
            title: "Midnight Elegance",
            description: "Black PVD case with matching bracelet",
            price: 1850.00,
            originalPrice: 2100.00,
            imageUrl: "https://source.unsplash.com/random/300x300/?black,watch",
            isNew: false,
            isSale: true,
            salePercentage: 12,
            category: "women",
            collection: "luxury",
            features: ["quartz", "pvd-coating", "sapphire-crystal"],
            stock: 9,
            createdAt: new Date().toISOString()
        },
        {
            id: 'P1010',
            title: "Smart Chrono",
            description: "Hybrid smartwatch with classic styling",
            price: 850.00,
            originalPrice: null,
            imageUrl: "https://source.unsplash.com/random/300x300/?smart,watch",
            isNew: true,
            isSale: false,
            salePercentage: 0,
            category: "smart",
            collection: "sport",
            features: ["step-tracking", "notifications", "heart-rate"],
            stock: 22,
            createdAt: new Date().toISOString()
        }
    ];

    // Default categories
    const DEFAULT_CATEGORIES = [
        {
            id: 'men',
            name: "Men's Watches",
            slug: "mens-watches",
            description: "Premium watches for men",
            parent: "",
            createdAt: new Date().toISOString()
        },
        {
            id: 'women',
            name: "Women's Watches",
            slug: "womens-watches",
            description: "Elegant watches for women",
            parent: "",
            createdAt: new Date().toISOString()
        },
        {
            id: 'smart',
            name: "Smart Watches",
            slug: "smart-watches",
            description: "Modern watches with smart features",
            parent: "",
            createdAt: new Date().toISOString()
        },
        {
            id: 'accessories',
            name: "Accessories",
            slug: "accessories",
            description: "Watch straps, cases, and other accessories",
            parent: "",
            createdAt: new Date().toISOString()
        }
    ];

    // Default collections
    const DEFAULT_COLLECTIONS = [
        {
            id: 'luxury',
            name: "Luxury Collection",
            description: "Exquisite timepieces for the discerning individual"
        },
        {
            id: 'sport',
            name: "Sport Collection",
            description: "Durable and reliable watches for active lifestyles"
        },
        {
            id: 'vintage',
            name: "Vintage Collection",
            description: "Classic designs inspired by watchmaking heritage"
        },
        {
            id: 'casual',
            name: "Casual Collection",
            description: "Versatile everyday watches with modern appeal"
        }
    ];

    // Initialize the store if needed
    function initialize() {
        const initialized = localStorage.getItem(KEYS.INITIALIZED);
        
        if (!initialized) {
            // Set initial products
            localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
            
            // Set initial categories
            localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
            
            // Set initial collections
            localStorage.setItem(KEYS.COLLECTIONS, JSON.stringify(DEFAULT_COLLECTIONS));
            
            // Set last product ID
            localStorage.setItem(KEYS.LAST_ID, 'P1010');
            
            // Mark as initialized
            localStorage.setItem(KEYS.INITIALIZED, 'true');
            
            console.log("Product Manager initialized with default data");
        }
    }

    // Generate a new unique product ID
    function generateProductId() {
        const lastId = localStorage.getItem(KEYS.LAST_ID) || 'P1000';
        const numPart = parseInt(lastId.substring(1));
        const newId = 'P' + (numPart + 1);
        localStorage.setItem(KEYS.LAST_ID, newId);
        return newId;
    }

    // Get all products
    function getAllProducts() {
        const productsJson = localStorage.getItem(KEYS.PRODUCTS);
        return productsJson ? JSON.parse(productsJson) : [];
    }

    // Get products by category
    function getProductsByCategory(categoryId) {
        const products = getAllProducts();
        return products.filter(product => product.category === categoryId);
    }

    // Get products by collection
    function getProductsByCollection(collectionId) {
        const products = getAllProducts();
        return products.filter(product => product.collection === collectionId);
    }

    // Get a single product by ID
    function getProductById(productId) {
        const products = getAllProducts();
        return products.find(product => product.id.toString() === productId.toString());
    }

    // Add a new product
    function addProduct(productData) {
        // Get existing products
        const products = getAllProducts();
        
        // Generate a new ID if not provided
        if (!productData.id) {
            productData.id = generateProductId();
        }
        
        // Add creation timestamp
        if (!productData.createdAt) {
            productData.createdAt = new Date().toISOString();
        }
        
        // Add the new product
        products.push(productData);
        
        // Save back to storage
        localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
        
        return productData;
    }

    // Update an existing product
    function updateProduct(productId, productData) {
        // Get existing products
        const products = getAllProducts();
        
        // Find the product index
        const index = products.findIndex(p => p.id.toString() === productId.toString());
        
        if (index !== -1) {
            // Update the product
            products[index] = { 
                ...products[index], 
                ...productData,
                id: products[index].id, // Ensure ID doesn't change
                updatedAt: new Date().toISOString()
            };
            
            // Save back to storage
            localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
            
            return products[index];
        }
        
        return null;
    }

    // Delete a product
    function deleteProduct(productId) {
        // Get existing products
        const products = getAllProducts();
        
        // Filter out the product to delete
        const filteredProducts = products.filter(p => p.id.toString() !== productId.toString());
        
        // Save back to storage
        localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(filteredProducts));
        
        return filteredProducts.length < products.length;
    }

    // Get all categories
    function getAllCategories() {
        const categoriesJson = localStorage.getItem(KEYS.CATEGORIES);
        return categoriesJson ? JSON.parse(categoriesJson) : [];
    }

    // Get all collections
    function getAllCollections() {
        const collectionsJson = localStorage.getItem(KEYS.COLLECTIONS);
        return collectionsJson ? JSON.parse(collectionsJson) : [];
    }

    // Count products in category
    function countProductsInCategory(categoryId) {
        const products = getAllProducts();
        return products.filter(p => p.category === categoryId).length;
    }

    // Count products in collection
    function countProductsInCollection(collectionId) {
        const products = getAllProducts();
        return products.filter(p => p.collection === collectionId).length;
    }

    // Save base64 image to localStorage
    function saveImage(base64Image) {
        const imageId = generateImageId();
        localStorage.setItem(`chronoElegance_image_${imageId}`, base64Image);
        return imageId;
    }

    // Generate a unique image ID
    function generateImageId() {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        return `img_${timestamp}_${random}`;
    }

    // Get image by ID
    function getImage(imageId) {
        return localStorage.getItem(`chronoElegance_image_${imageId}`);
    }



    // Public API
    return {
        initialize,
        getAllProducts,
        getProductsByCategory,
        getProductsByCollection,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        getAllCategories,
        getAllCollections,
        countProductsInCategory,
        saveImage,
        getImage,
        countProductsInCollection
    };
})();

// Initialize the product manager when the script loads
ProductManager.initialize();