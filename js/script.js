let allData = [];
fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data => {
        allData = data;
        displayCards(allData);
    })
    .catch(error => console.error('Error fetching products:', error));
function displayCards(cards) {
    let div = document.getElementById('card-items');
    div.innerHTML = '';
    cards.forEach(card => {
        div.innerHTML += `
         <center>
            <div class='card-wrapper' style='border:1px solid gray;border-radius:8px'>
                <img src='${card.image}' width='200px' height='250'class="mb-3 pt-3">
                <p>${card.title.slice(0, 11)}${card.title.length > 11 ? '...' : ''}</p>
                <p>${card.description.slice(0,80)}${card.description.length > 80 ? '...' : ''}</p>
                <hr>
                <p>$${card.price}</p>
                <hr>
                <button class="btn btn-dark mb-3">Details</button>
                <button class="btn btn-dark mb-3"onclick="addToCart(${card.id}, '${card.title}', ${card.price}, '${card.image}')">Add to Cart</button>
            </div>
         </center>`;
    });
}
function addToCart(id, title, price, image) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(item => item.id === id);
    if (!product) {
        cart.push({ id, title, price, image, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartValue = document.getElementById('cart-value');
    cartValue.textContent = cart.length;
}
function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const checkout = document.getElementById('checkout');
    const emptyCartDiv = document.getElementById('cart');
    const cartValue = document.getElementById('cart-value');
    const cartcheckout = document.getElementById('cart-checkout');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsContainer.innerHTML = "";
    let totalPrice = 0;
    if (cart.length === 0) {
        emptyCartDiv.style.display = 'block';
        cartcheckout.style.display = 'none';
        checkout.style.display = 'none';
        cartValue.textContent = 0;
    } else {
        emptyCartDiv.style.display = 'none';
        checkout.style.display = 'block';
        let h1 = document.createElement('h2');
        h1.textContent = 'Item List';
        h1.style.backgroundColor = 'lightgray'; 
        h1.style.borderTopLeftRadius = '5px'; 
        h1.style.borderTopRightRadius = '5px'; 
        h1.style.width = '103%'; 
        h1.style.padding = '5px 0px 15px 30px';
        h1.style.marginLeft = '-12px';
        cartItemsContainer.appendChild(h1);
        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            const cartItem = document.createElement('div');
            cartItem.setAttribute('id', 'cart-flex');
            cartItem.style.borderBottom = '1px solid black';
            cartItem.style.paddingRight = '100px';
            cartItem.innerHTML = `
                <div class="row border-bottom py-3 align-items-center">
                    <div class="col-3">
                        <img src="${item.image}" alt="${item.title}" class="img-fluid" style="height:100px;width:100px">
                    </div>
                    <div class="col-5">
                        <p class="mb-1">${item.title.slice(0, 30)}${item.title.length > 30 ? '...' : ''}</p>
                    </div>
                    <div class="col-4 text-center">
                        <div class="d-flex justify-content-center align-items-center mb-2">
                            <button class="btn btn-outline-secondary btn-sm me-2 border-0" onclick="changeQuantity(${item.id}, -1)"><i class="fa-solid fa-minus"></i></button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-outline-secondary btn-sm ms-2 border-0" onclick="changeQuantity(${item.id}, 1)"><i class="fa-solid fa-plus"></i></button>
                        </div>
                        <p class="mb-0 text-muted">${item.quantity} x $${item.price.toFixed(2)}</p>
                    </div>
                </div>`;
            cartItemsContainer.appendChild(cartItem);
        });
        const shippingCost = 30;
        const finalTotalPrice = totalPrice + shippingCost;
        checkout.innerHTML = `
            <div class="container border rounded pb-3">
                <div class="row mb-3">
                    <div class="col-12 bg-dark-gray rounded-top">
                        <p class="h4 py-2">Order Summary</p>
                    </div>
                     <hr>
                </div>
                <div class="row mb-2">
                    <div class="col-6">
                        <p>Products (<span>${cart.reduce((acc, item) => acc + item.quantity, 0)}</span>)</p>
                    </div>
                    <div class="col-6 text-end">
                        <p>$${totalPrice.toFixed(2)}</p>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-6">
                        <p>Shipping</p>
                    </div>
                    <div class="col-6 text-end">
                        <p>$${shippingCost.toFixed(2)}</p>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-6">
                        <p><strong>Total Price:</strong></p>
                    </div>
                    <div class="col-6 text-end">
                        <p id="total-price" class="fw-bold">$${finalTotalPrice.toFixed(2)}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 text-center">
                        <button class="btn btn-dark w-100">Go to checkout</button>
                    </div>
                </div>
            </div>`;
    }
}
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
        updateCartCount();
    }
}
function filter(category) {
    const filteredData = category === 'all' ? allData : allData.filter(card => card.category === category);
    displayCards(filteredData);
}
function clearCart() {
    localStorage.clear();
    loadCart();
    updateCartCount();
}
function setActiveLink(linkId) {
    document.querySelectorAll('.nav-link').forEach(item => {
        item.classList.remove('active', 'text-dark');
        item.classList.add('text-secondary');
    });
    const activeLink = document.getElementById(linkId);
    if (activeLink) {
        activeLink.classList.add('active', 'text-dark');
        activeLink.classList.remove('text-secondary');
        localStorage.setItem('activeLink', linkId);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const savedLinkId = localStorage.getItem('activeLink');
    if (savedLinkId) {
        setActiveLink(savedLinkId);
    }
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
            setActiveLink(this.id);
        });
    });
    updateCartCount();
    if (document.getElementById('cart-items')) {
        loadCart();
    }
});
 document.addEventListener('DOMContentLoaded', () => {
     
});