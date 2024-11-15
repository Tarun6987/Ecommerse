let allData = []; 
fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data => {
        allData = data;
        displayCards(allData);
    })
    .catch(error => console.error('Error fetching products:', error));
// Display product cards
function displayCards(cards) {
    let div = document.getElementById('card-items');
    div.innerHTML = ''; 
    cards.forEach(card => {
        div.innerHTML +=`
            <center><div id='cardDiv'>
                <img src='${card.image}' width='200px' height='250'>
                <p>${card.title.slice(0,11)}${card.title.length > 11 ? '...' : ''}</p>
                <p>${card.description.slice(0, 100)}${card.description.length > 100 ? '...' : ''}</p>
                <hr>
                <p>$${card.price}</p>
                <hr>
                <button style='background-color:black;color:white;border-radius:5px;padding:5px 10px'>Details</button>
                <button onclick="addToCart(${card.id}, '${card.title}', ${card.price}, '${card.image}')" style="background-color:black;color:white;border-radius:5px;padding:5px 10px">Add to Cart</button>
            </div></center>`;
    });
}
// Add product to cart, preventing duplicates
function addToCart(id, title, price, image) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(item => item.id === id);
    if (!product) {
        // Add only if the product is not already in the cart
        cart.push({ id, title, price, image, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}
// Update the cart count display in the header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-value').textContent = cart.length;
}
// Load the cart items on the cart page
// Load the cart items on the cart page
function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const checkout = document.getElementById('checkout');
    const emptyCartDiv = document.getElementById('cart');
    const cartValue = document.getElementById('cart-value');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsContainer.innerHTML = "";  // Clear existing cart items
    let totalPrice = 0;

    if (cart.length === 0) {
        // Show empty cart message if cart is empty
        emptyCartDiv.style.display = 'block';
        checkout.style.display = 'none';
        document.querySelectorAll('.cart-main')[0].style.display = 'none';
    } else {
        // Hide empty cart message and show cart items
        emptyCartDiv.style.display = 'none';
        checkout.style.display = 'block';
        // Display each item in the cart
        let h1 = document.createElement('h1');
        h1.textContent = 'Item List';
        h1.style.padding = '0px 0px 20px 50px';
        h1.style.borderBottom = '1px solid black';
        cartItemsContainer.appendChild(h1);

        cart.forEach((item) => { 
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.setAttribute('id', 'cart-flex');
            cartItem.style.borderBottom = '1px solid black';
            cartItem.style.paddingRight = '100px';

            cartItem.innerHTML = `
                <div>
                    <img src="${item.image}" alt="${item.title}" width="120" height="120">
                </div>
                <p>${item.title.slice(0, 30)}</p>
                <div>
                    <button onclick="changeQuantity(${item.id}, -1)" style='border:none;background-color:white;font-size:30px'>-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)" style='border:none;background-color:white;font-size:30px'>+</button>
                    <p>${item.quantity} x $${item.price}</p>
                </div>`;
            cartItemsContainer.appendChild(cartItem);
        });

        // Add shipping cost only if the cart is not empty
        const shippingCost = 30;
        const finalTotalPrice = totalPrice + shippingCost;

        checkout.innerHTML = `
            <p style='font-size:1.4em'><strong>Order Summary</strong></p><hr>
            <p>Products (<span>${cart.reduce((acc, item) => acc + item.quantity, 0)}</span>) <span style="padding-left:150px">$${totalPrice.toFixed(2)}</span></p>
            <p>Shipping <span style="padding-left:200px">$${shippingCost}</span></p>
            <p>Total Price: <span id="total-price" style="padding-left:150px">$${finalTotalPrice.toFixed(2)}</span></p>
            <button>Go to checkout</button>`;
    }
    cartValue.textContent = cart.length;
}
// Change the quantity of an item in the cart
function changeQuantity(id, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex >= 0) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}
// Filter products by category
function filter(category) {
    const filteredData = category === 'all' ? allData : allData.filter(card => card.category === category);
    displayCards(filteredData);
}
// Initialize the cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('cart-items')) {
        loadCart();
    }
}); 