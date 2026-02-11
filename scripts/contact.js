console.log("Contact page JS connected");

function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove("show"), 3000);
}

document.addEventListener("DOMContentLoaded", () => {

    const sendBtn = document.getElementById("send-btn");
    const sendAnotherBtn = document.getElementById("send-another-btn");
    const contactForm = document.getElementById("contact-form");
    const formSuccess = document.getElementById("form-success");

    sendBtn.addEventListener("click", () => {

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        // Validation
        if (!name) {
            showToast("Please enter your name!", "error");
            return;
        }

        if (!email || !email.includes("@")) {
            showToast("Please enter a valid email!", "error");
            return;
        }

        if (!subject) {
            showToast("Please enter a subject!", "error");
            return;
        }

        if (!message) {
            showToast("Please enter a message!", "error");
            return;
        }

        // Show success state
        contactForm.style.display = "none";
        formSuccess.style.display = "flex";
    });

    // Reset form
    sendAnotherBtn.addEventListener("click", () => {
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("subject").value = "";
        document.getElementById("message").value = "";

        contactForm.style.display = "block";
        formSuccess.style.display = "none";
    });
});