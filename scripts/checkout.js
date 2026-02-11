console.log("Checkout page JS connected");

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Generate random order ID
function generateOrderId() {
    return "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Calculate totals
function calculateTotals(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 50 : 0;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
}

// Show toast notification
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove("show"), 3000);
}

// Render checkout order summary
function renderCheckout() {
    const cart = getCart();
    const itemsList = document.getElementById("checkout-items-list");

    if (cart.length === 0) {
        window.location.href = "cart.html";
        return;
    }

    // Render each item
    itemsList.innerHTML = "";
    cart.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("checkout-item");
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}" />
            <div class="checkout-item-details">
                <h3>${item.title}</h3>
                <p>Size: <strong>${item.size}</strong> | Color: <strong>${item.color || 'Default'}</strong></p>
                <p>Quantity: <strong>${item.quantity}</strong></p>
            </div>
            <div class="checkout-item-price">
                Rs. ${(item.price * item.quantity).toFixed(2)}
            </div>
        `;
        itemsList.appendChild(div);
    });

    // Update totals
    const { subtotal, shipping, tax, total } = calculateTotals(cart);
    document.getElementById("co-subtotal").textContent = `Rs. ${subtotal.toFixed(2)}`;
    document.getElementById("co-shipping").textContent = `Rs. ${shipping.toFixed(2)}`;
    document.getElementById("co-tax").textContent = `Rs. ${tax.toFixed(2)}`;
    document.getElementById("co-total").textContent = `Rs. ${total.toFixed(2)}`;
}

// Show order confirmation
function showConfirmation(cart) {
    const { total } = calculateTotals(cart);
    const orderId = generateOrderId();

    // Hide checkout, show confirmation
    document.getElementById("checkout-section").style.display = "none";
    document.getElementById("confirmation-section").style.display = "block";

    // Set order ID
    document.getElementById("order-id-text").textContent = orderId;

    // Set total paid
    document.getElementById("confirmation-total-amount").textContent = `Rs. ${total.toFixed(2)}`;

    // List ordered items
    const confirmationList = document.getElementById("confirmation-items-list");
    confirmationList.innerHTML = "";
    cart.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("confirmation-item");
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}" />
            <div>
                <p><strong>${item.title}</strong></p>
                <p>Size: ${item.size} | Color: ${item.color || 'Default'} | Qty: ${item.quantity}</p>
            </div>
            <p class="conf-item-price">Rs. ${(item.price * item.quantity).toFixed(2)}</p>
        `;
        confirmationList.appendChild(div);
    });

    // Clear cart after order
    localStorage.removeItem("cart");

    // Update cart count to 0
    const badge = document.querySelector("#cart-count");
    if (badge) {
        badge.textContent = "0";
        badge.style.display = "none";
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    renderCheckout();

    // Place order button
    document.getElementById("place-order-btn").addEventListener("click", () => {
        const cart = getCart();
        if (cart.length > 0) {
            showConfirmation(cart);
        }
    });
});