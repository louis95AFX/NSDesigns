/* --- CART STATE --- */
let cart = [];
const cartCountElement = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartSubtotalElement = document.getElementById('cart-subtotal');
const cartDrawer = document.getElementById('cart-drawer');
const closeCartBtn = document.getElementById('close-cart');
const cartIcon = document.querySelector('.cart-icon');
const cartOverlay = document.getElementById('cart-overlay');

/* --- INITIALIZE --- */
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    setupEventListeners();
});

function setupEventListeners() {
    // Open/Close Cart
    cartIcon.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // Add to Bag Buttons
    const addBtns = document.querySelectorAll('.add-to-cart-btn');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const product = {
                id: card.querySelector('h3').innerText.toLowerCase().replace(/\s/g, '-'),
                name: card.querySelector('h3').innerText,
                price: parseFloat(card.querySelector('.price').innerText.replace(/[^\d.]/g, '')),
                image: card.querySelector('.product-image').style.backgroundImage.slice(5, -2),
                quantity: 1
            };
            addToCart(product);
        });
    });
}

/* --- CORE FUNCTIONS --- */

function toggleCart() {
    cartDrawer.classList.toggle('active');
    // Prevent background scrolling when cart is open
    document.body.style.overflow = cartDrawer.classList.contains('active') ? 'hidden' : '';
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }

    updateCartUI();
    // Auto-open drawer when adding an item for better UX
    if (!cartDrawer.classList.contains('active')) {
        toggleCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    // 1. Update Count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.innerText = totalItems;

    // 2. Render Items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Your bag is currently empty.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-img" style="background-image: url('${item.image}')"></div>
            
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>R ${item.price.toFixed(2)} x ${item.quantity}</p>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash-can"></i> Remove
                </button>
            </div>
        </div>
    `).join('');
    }

    // 3. Update Subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartSubtotalElement.innerText = `R ${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
}