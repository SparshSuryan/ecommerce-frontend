document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navbar = document.querySelector(".navbar");

    hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        navbar.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
        if (!navbar.contains(e.target) && !hamburger.contains(e.target)) {
            navbar.classList.remove("active");
        }
    });
});
