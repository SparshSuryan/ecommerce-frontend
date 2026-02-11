console.log("JS Connected");

document.addEventListener("DOMContentLoaded", () => {

    /* ==============================
       NAVBAR (hamburger)
    ============================== */
    const hamburger = document.querySelector(".hamburger");
    const navbar = document.querySelector(".navbar");

    if (hamburger && navbar) {
        hamburger.addEventListener("click", (e) => {
            e.stopPropagation();
            navbar.classList.toggle("active");
            hamburger.classList.toggle("active");
        });

        document.addEventListener("click", (e) => {
            if (!navbar.contains(e.target) && !hamburger.contains(e.target)) {
                navbar.classList.remove("active");
                hamburger.classList.remove("active");
            }
        });
    }

    /* ==============================
       CART UTILITIES (GLOBAL LOGIC)
       Single source of truth
    ============================== */

    function getCart() {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }

    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function updateCartCount() {
        const cart = getCart();

        const total = cart.reduce((sum, item) => sum + item.quantity, 0);

        const badge = document.querySelector("#cart-count");

        if (!badge) return;

        badge.textContent = total;

        // hide badge when 0 (cleaner look)
        badge.style.display = total === 0 ? "none" : "block";
    }

    updateCartCount();

    /* ==============================
       CART ICON CLICK
    ============================== */
    const cartContainer = document.querySelector(".cart-container");
    if (cartContainer) {
        cartContainer.addEventListener("click", () => {
            window.location.href = "cart.html";
        });
    }

    /* ==============================
       ADD TO CART FUNCTION
    ============================== */
    function addToCart(product, qty = 1, size = "Default") {

        const cart = getCart();

        const existing = cart.find(
            item => item.id === product.id && item.size === size
        );

        if (existing) {
            existing.quantity += qty;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                size: size,
                quantity: qty
            });
        }

        saveCart(cart);
        updateCartCount();
    }

    /* ==============================
       RENDER PRODUCTS
    ============================== */
    function renderProducts(data) {
        const grid = document.querySelector(".grid-cards");
        const loading = document.querySelector("#loading");

        if (!grid) return; // Exit if grid doesn't exist

        if (loading) loading.remove();

        data.forEach(product => {

            const card = document.createElement("div");
            card.classList.add("card");

            // click card → product page
            card.addEventListener("click", () => {
                window.location.href = `product.html?id=${product.id}`;
            });


            /* image */
            const img = document.createElement("img");
            img.src = product.image;
            img.loading = "lazy";


            /* title */
            const title = document.createElement("h4");
            title.textContent = product.title;


            /* description */
            const desc = document.createElement("p");
            desc.textContent = product.description;
            desc.classList.add("desc");


            /* price */
            const price = document.createElement("p");
            price.textContent = "Rs. " + product.price;


            /* add to cart button */
            const button = document.createElement("button");
            button.textContent = "Add to Cart";
            button.classList.add("add-to-cart");


            button.addEventListener("click", (e) => {

                e.stopPropagation(); // prevent redirect

                addToCart(product, 1);

                // small UX feedback
                button.textContent = "Added ✓";

                setTimeout(() => {
                    button.textContent = "Add to Cart";
                }, 800);
            });


            /* layout */
            const priceRow = document.createElement("div");
            priceRow.classList.add("price-row");

            priceRow.appendChild(price);
            priceRow.appendChild(button);

            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(desc);
            card.appendChild(priceRow);

            grid.appendChild(card);
        });
    }

    /* ==============================
       PRODUCT GRID - FETCH / CACHE PRODUCTS
       Only runs if .grid-cards exists on the page
    ============================== */

    const grid = document.querySelector(".grid-cards");
    
    if (grid) {
        const cachedProducts = localStorage.getItem("products");

        if (cachedProducts) {
            console.log("Products loaded from cache");
            renderProducts(JSON.parse(cachedProducts));
        } else {
            console.log("Fetching products from API...");

            fetch("https://fakestoreapi.com/products")
                .then(res => res.json())
                .then(data => {
                    localStorage.setItem("products", JSON.stringify(data));
                    renderProducts(data);
                })
                .catch(() => {
                    const loading = document.querySelector("#loading");
                    if (loading) {
                        loading.textContent = "Failed to load products.";
                    }
                });
        }
    }

});