console.log("Product page JS connected");

function updateCartCount() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;
    cart.forEach(item => total += item.quantity);

    const cartCount = document.querySelector("#cart-count");

    if (cartCount) {
        cartCount.textContent = total;
        cartCount.style.display = total === 0 ? "none" : "block";
    }
}

// Show toast notification
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {

    updateCartCount(); 

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    console.log("Product ID:", productId);

    // Function to render product details
    function renderProductDetails(product) {
        if (!product) {
            console.error("Product not found!");
            return;
        }

        const imageDiv = document.querySelector(".product-image");
        const infoDiv = document.querySelector(".product-info");

    // Render product image with zoom container
    imageDiv.innerHTML = `
        <div class="zoom-container">
            <img src="${product.image}" alt="${product.title}" class="product-img" />
        </div>
    `;

    // Render product info
    infoDiv.innerHTML = `
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        <h3 id="base-price">Rs. ${product.price}</h3>
        <h3 id="total-price" style="color: #0d6efd; margin-top: 10px;">Total: Rs. ${product.price}</h3>
        
        <div class="sizes">
            <p class="label">Select Size <span class="required">*</span></p>
            <div class="size-options">
                <button class="size-btn" data-size="XS">XS</button>
                <button class="size-btn" data-size="S">S</button>
                <button class="size-btn" data-size="M">M</button>
                <button class="size-btn" data-size="L">L</button>
                <button class="size-btn" data-size="XL">XL</button>
            </div>
        </div>

        <div class="variation">
            <label>Color: <span class="required">*</span></label>
            <select id="color-select">
                <option value="">Select Color</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Blue">Blue</option>
                <option value="Red">Red</option>
                <option value="Yellow">Yellow</option>
                <option value="Green">Green</option>
            </select>
        </div>

        <div class="quantity">
            <p class="label">Quantity: <span class="required">*</span></p>
            <div class="qty-box">
                <button id="minus">-</button>
                <span id="qty">1</span>
                <button id="plus">+</button>
            </div>
        </div>

        <button class="add-btn">Add to Cart</button>
    `;

    /* IMAGE ZOOM - Desktop hover + Mobile touch */
    const zoomContainer = document.querySelector(".zoom-container");
    const productImg = document.querySelector(".product-img");
    
    if (zoomContainer && productImg) {
        let isZoomed = false;
        
        // Mobile: toggle zoom on touch
        zoomContainer.addEventListener("touchstart", (e) => {
            e.preventDefault();
            isZoomed = !isZoomed;
            
            if (isZoomed) {
                productImg.style.transform = "scale(1.8)";
            } else {
                productImg.style.transform = "scale(1)";
            }
        });
        
        // Also handle click for touch devices that fire click events
        zoomContainer.addEventListener("click", (e) => {
            if (window.innerWidth <= 768) {
                e.stopPropagation();
                isZoomed = !isZoomed;
                
                if (isZoomed) {
                    productImg.style.transform = "scale(1.8)";
                } else {
                    productImg.style.transform = "scale(1)";
                }
            }
        });
    }

    /* SIZE SELECTION */
    const sizeButtons = document.querySelectorAll(".size-btn");

    sizeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            sizeButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });

    /* QUANTITY WITH VALIDATION */
    let quantity = 1;

    const qtyText = document.getElementById("qty");
    const plus = document.getElementById("plus");
    const minus = document.getElementById("minus");
    const totalPriceElement = document.getElementById("total-price");

    function updateTotalPrice() {
        const total = (product.price * quantity).toFixed(2);
        totalPriceElement.textContent = `Total: Rs. ${total}`;
    }

    plus.onclick = () => {
        if (quantity < 99) { // Maximum limit
            quantity++;
            qtyText.textContent = quantity;
            updateTotalPrice();
        }
    };

    minus.onclick = () => {
        if (quantity > 1) {
            quantity--;
            qtyText.textContent = quantity;
            updateTotalPrice();
        }
    };

    /* ADD TO CART WITH VALIDATION */
    const addBtn = document.querySelector(".add-btn");
    
    addBtn.onclick = () => {

        // Validation checks
        const activeSize = document.querySelector(".size-btn.active");
        const colorSelect = document.getElementById("color-select");
        const selectedColor = colorSelect.value;

        // Check if size is selected
        if (!activeSize) {
            showToast("Please select a size!", "error");
            return;
        }

        // Check if color is selected
        if (!selectedColor) {
            showToast("Please select a color!", "error");
            return;
        }

        // Check if quantity is valid
        if (quantity < 1) {
            showToast("Quantity must be at least 1!", "error");
            return;
        }

        // All validations passed - add to cart
        const size = activeSize.getAttribute("data-size");

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find(item =>
            item.id === product.id && item.size === size && item.color === selectedColor
        );

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                size: size,
                color: selectedColor,
                quantity: quantity
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount();

        // Success feedback
        showToast(`Added ${quantity} item(s) to cart!`, "success");
        
        // Button animation
        addBtn.style.transform = "scale(0.95)";
        setTimeout(() => {
            addBtn.style.transform = "scale(1)";
        }, 200);
    };

    }

    // Try to get product from cache first
    const cachedProducts = localStorage.getItem("products");

    if (cachedProducts) {
        const products = JSON.parse(cachedProducts);
        const product = products.find(p => p.id == productId);
        console.log("Selected product from cache:", product);
        renderProductDetails(product);
    } else {
        // If no cache, fetch from API
        console.log("No cached products, fetching from API...");
        fetch("https://fakestoreapi.com/products")
            .then(res => res.json())
            .then(data => {
                localStorage.setItem("products", JSON.stringify(data));
                const product = data.find(p => p.id == productId);
                console.log("Selected product from API:", product);
                renderProductDetails(product);
            })
            .catch(err => {
                console.error("Failed to fetch products:", err);
            });
    }

});