console.log("Cart page JS connected");

// Toast notification function
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart count in navbar
function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector("#cart-count");
    
    if (badge) {
        badge.textContent = total;
        badge.style.display = total === 0 ? "none" : "block";
    }
}

// Calculate cart totals
function calculateTotals() {
    const cart = getCart();
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 50 : 0;
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
}

// Update summary section
function updateSummary() {
    const { subtotal, shipping, tax, total } = calculateTotals();
    
    document.getElementById("subtotal").textContent = `Rs. ${subtotal.toFixed(2)}`;
    document.getElementById("shipping").textContent = `Rs. ${shipping.toFixed(2)}`;
    document.getElementById("tax").textContent = `Rs. ${tax.toFixed(2)}`;
    document.getElementById("total").textContent = `Rs. ${total.toFixed(2)}`;
    
    // Enable/disable checkout button
    const checkoutBtn = document.getElementById("checkout-btn");
    const cart = getCart();
    
    if (cart.length === 0) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = "0.5";
        checkoutBtn.style.cursor = "not-allowed";
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = "1";
        checkoutBtn.style.cursor = "pointer";
    }
}

// Remove item from cart
function removeItem(productId, size, color) {
    let cart = getCart();
    
    cart = cart.filter(item => 
        !(item.id === productId && item.size === size && item.color === color)
    );
    
    saveCart(cart);
    updateCartCount();
    renderCart();
    showToast("Item removed from cart", "error");
}

// Update item quantity
function updateQuantity(productId, size, color, newQuantity) {
    if (newQuantity < 1) return;
    
    let cart = getCart();
    
    const item = cart.find(i => 
        i.id === productId && i.size === size && i.color === color
    );
    
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
        updateCartCount();
        renderCart();
    }
}

// Render cart items
function renderCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById("cart-items");
    const emptyCart = document.getElementById("empty-cart");
    
    // Show/hide empty cart message
    if (cart.length === 0) {
        emptyCart.style.display = "flex";
        cartItemsContainer.style.display = "none";
    } else {
        emptyCart.style.display = "none";
        cartItemsContainer.style.display = "block";
        
        // Clear existing items
        cartItemsContainer.innerHTML = "";
        
        // Render each cart item
        cart.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            
            cartItem.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                
                <div class="item-details">
                    <h3>${item.title}</h3>
                    <p class="item-options">
                        Size: <strong>${item.size}</strong> | 
                        Color: <strong>${item.color || 'Default'}</strong>
                    </p>
                    <p class="item-price">Rs. ${item.price}</p>
                </div>
                
                <div class="item-quantity">
                    <button class="qty-btn minus" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
                
                <div class="item-total">
                    <p class="total-price">Rs. ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                
                <button class="remove-btn" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Add event listeners for quantity buttons
        document.querySelectorAll(".qty-btn.plus").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(btn.dataset.id);
                const size = btn.dataset.size;
                const color = btn.dataset.color;
                const item = cart.find(i => i.id === id && i.size === size && i.color === color);
                if (item) {
                    updateQuantity(id, size, color, item.quantity + 1);
                }
            });
        });
        
        document.querySelectorAll(".qty-btn.minus").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(btn.dataset.id);
                const size = btn.dataset.size;
                const color = btn.dataset.color;
                const item = cart.find(i => i.id === id && i.size === size && i.color === color);
                if (item && item.quantity > 1) {
                    updateQuantity(id, size, color, item.quantity - 1);
                }
            });
        });
        
        // Add event listeners for remove buttons
        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.dataset.id);
                const size = btn.dataset.size;
                const color = btn.dataset.color;
                removeItem(id, size, color);
            });
        });
    }
    
    // Update summary
    updateSummary();
}

// Initialize cart page
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    renderCart();
    
    // Checkout button
    document.getElementById("checkout-btn").addEventListener("click", () => {
        const cart = getCart();
        if (cart.length > 0) {
            window.location.href = "checkout.html";
        }
    });
});