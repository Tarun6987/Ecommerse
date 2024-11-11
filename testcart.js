// Mock API Endpoint for Products (replace with your actual API)
const apiEndpoint = 'https://api.example.com/products';

// Fetch product data from the API and render to the page
async function fetchProducts() {
    try {
        const response = await fetch(apiEndpoint);
        const products = await response.json();
        
        renderProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Render products to the product list
function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';  // Clear existing products

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';

        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}" />
            <h3>${product.title}</h3>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;

        productList.appendChild(productElement);
    });
}

// Cart functionality
const cart = {};

// Add to Cart function
function addToCart(productId) {
    if (!cart[productId]) {
        cart[productId] = { quantity: 1 };
    } else {
        cart[productId].quantity++;
    }
    updateCartDisplay();
}

// Remove from Cart function
function removeFromCart(productId) {
    if (cart[productId]) {
        cart[productId].quantity--;
        if (cart[productId].quantity <= 0) delete cart[productId];
    }
    updateCartDisplay();
}

// Update cart display
async function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    let totalPrice = 0;

    for (const productId in cart) {
        const product = await fetchProductById(productId);
        const quantity = cart[productId].quantity;
        const itemPrice = product.price * quantity;
        totalPrice += itemPrice;

        const cartItem = document.createElement('li');
        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}" width="50" />
            <span>${product.title} - $${product.price.toFixed(2)} x ${quantity} = $${itemPrice.toFixed(2)}</span>
            <button onclick="removeFromCart(${product.id})">-</button>
            <button onclick="addToCart(${product.id})">+</button>
        `;
        cartItems.appendChild(cartItem);
    }

    document.getElementById('total-price').textContent = `Total: $${totalPrice.toFixed(2)}`;
}

// Fetch individual product by ID (caching for efficiency)
async function fetchProductById(productId) {
    if (!cart[productId].details) {
        const response = await fetch(`${apiEndpoint}/${productId}`);
        cart[productId].details = await response.json();
    }
    return cart[productId].details;
}

// Initialize
fetchProducts();5