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

const modal = document.getElementById('quick-view-modal');
const closeBtn = document.querySelector('.qv-close');

// Open Modal logic
document.querySelectorAll('.quick-view-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        
        // Extract data
        const title = card.querySelector('h3').innerText;
        const price = card.querySelector('.price').innerText;
        const category = card.querySelector('.category-label').innerText;
        // Get background image URL and clean it up
        const imgStyle = card.querySelector('.product-image').style.backgroundImage;
        const imgUrl = imgStyle.slice(5, -2).replace(/"/g, "");

        // Inject into Modal
        document.getElementById('qv-title').innerText = title;
        document.getElementById('qv-price').innerText = price;
        document.getElementById('qv-category').innerText = category;
        document.getElementById('qv-img').src = imgUrl;

        modal.style.display = 'flex';
    });
});

// Close Modal logic
closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = 'none';
};

// Quick View Add to Cart
// Quick View Add to Cart
document.getElementById('qv-add-btn').addEventListener('click', () => {
    // 1. Extract data from the modal elements
    const title = document.getElementById('qv-title').innerText;
    const priceText = document.getElementById('qv-price').innerText;
    const imgUrl = document.getElementById('qv-img').src;

    // 2. Create the product object to match your addToCart requirements
    const product = {
        id: title.toLowerCase().replace(/\s/g, '-'),
        name: title,
        // Convert "R 850.00" to 850.00
        price: parseFloat(priceText.replace(/[^\d.]/g, '')),
        image: imgUrl,
        quantity: 1
    };
    
    // 3. Call your core function
    addToCart(product);
    
    // 4. Close modal and give feedback
    modal.style.display = 'none';
    console.log(`Added ${title} to cart from Quick View`);
});