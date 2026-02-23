import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDF0mFxqyWJWCgqHdtrqrcIbgYSSkykUKA",
  authDomain: "ecommerce-frontend-56454.firebaseapp.com",
  projectId: "ecommerce-frontend-56454",
  storageBucket: "ecommerce-frontend-56454.firebasestorage.app",
  messagingSenderId: "558159811134",
  appId: "1:558159811134:web:b7078bc29373cd3655f76f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("Firebase initialized");

console.log("Auth page JS connected");

// Toast notification
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove("show"), 3000);
}

// Show error message
function showError(id, message) {
    const el = document.getElementById(id);
    el.textContent = message;
    el.style.display = "block";
}

// Clear error message
function clearError(id) {
    const el = document.getElementById(id);
    el.textContent = "";
    el.style.display = "none";
}

// Clear all errors
function clearAllErrors(form) {
    form.querySelectorAll(".error-msg").forEach(el => {
        el.textContent = "";
        el.style.display = "none";
    });
}

// Password visibility toggle
function setupToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);

    if (toggle && input) {
        toggle.addEventListener("click", () => {
            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            toggle.classList.toggle("fa-eye");
            toggle.classList.toggle("fa-eye-slash");
        });
    }
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return strength;
}

// Update strength bar
function updateStrengthBar(password) {
    const fill = document.getElementById("strength-fill");
    const text = document.getElementById("strength-text");
    const strength = checkPasswordStrength(password);

    const levels = [
        { label: "", color: "transparent", width: "0%" },
        { label: "Very Weak", color: "#dc3545", width: "20%" },
        { label: "Weak", color: "#fd7e14", width: "40%" },
        { label: "Fair", color: "#ffc107", width: "60%" },
        { label: "Strong", color: "#0d6efd", width: "80%" },
        { label: "Very Strong", color: "#28a745", width: "100%" },
    ];

    const level = levels[strength] || levels[0];
    fill.style.width = level.width;
    fill.style.background = level.color;
    text.textContent = password ? level.label : "";
    text.style.color = level.color;
}

// Validate email format
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate password requirements
function isValidPassword(password) {
    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password)
    );
}

document.addEventListener("DOMContentLoaded", () => {

    /* ==============================
       TABS - SWITCH BETWEEN FORMS
    ============================== */
    const loginTab = document.getElementById("login-tab");
    const signupTab = document.getElementById("signup-tab");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const goToSignup = document.getElementById("go-to-signup");
    const goToLogin = document.getElementById("go-to-login");

    function showLogin() {
        loginForm.classList.remove("hidden");
        loginForm.classList.add("visible");
        signupForm.classList.add("hidden");
        signupForm.classList.remove("visible");
        loginTab.classList.add("active");
        signupTab.classList.remove("active");
        clearAllErrors(loginForm);
    }

    function showSignup() {
        signupForm.classList.remove("hidden");
        signupForm.classList.add("visible");
        loginForm.classList.add("hidden");
        loginForm.classList.remove("visible");
        signupTab.classList.add("active");
        loginTab.classList.remove("active");
        clearAllErrors(signupForm);
    }

    loginTab.addEventListener("click", showLogin);
    signupTab.addEventListener("click", showSignup);
    goToSignup.addEventListener("click", showSignup);
    goToLogin.addEventListener("click", showLogin);

    /* ==============================
       PASSWORD TOGGLES
    ============================== */
    setupToggle("toggle-login-pass", "login-password");
    setupToggle("toggle-signup-pass", "signup-password");
    setupToggle("toggle-confirm-pass", "signup-confirm");

    /* ==============================
       PASSWORD STRENGTH
    ============================== */
    document.getElementById("signup-password").addEventListener("input", (e) => {
        updateStrengthBar(e.target.value);
    });

    /* ==============================
       REAL-TIME VALIDATION
    ============================== */
    document.getElementById("login-email").addEventListener("input", (e) => {
        if (!isValidEmail(e.target.value)) {
            showError("login-email-error", "Please enter a valid email address");
        } else {
            clearError("login-email-error");
        }
    });

    document.getElementById("signup-email").addEventListener("input", (e) => {
        if (!isValidEmail(e.target.value)) {
            showError("signup-email-error", "Please enter a valid email address");
        } else {
            clearError("signup-email-error");
        }
    });

    document.getElementById("signup-confirm").addEventListener("input", (e) => {
        const password = document.getElementById("signup-password").value;
        if (e.target.value !== password) {
            showError("signup-confirm-error", "Passwords do not match");
        } else {
            clearError("signup-confirm-error");
        }
    });

    /* ==============================
       LOGIN VALIDATION
    ============================== */
    document.getElementById("login-btn").addEventListener("click", () => {
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;
        let isValid = true;

        clearAllErrors(loginForm);

        if (!email) {
            showError("login-email-error", "Email is required");
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError("login-email-error", "Please enter a valid email address");
            isValid = false;
        }

        if (!password) {
            showError("login-password-error", "Password is required");
            isValid = false;
        } else if (password.length < 8) {
            showError("login-password-error", "Password must be at least 8 characters");
            isValid = false;
        }

        if (isValid) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log("User Logged In:", userCredential.user);
                    // Set localStorage flag
                    localStorage.setItem("isLoggedIn", "true");
                    showToast("Login successful! Welcome back 👋", "success");
        
                    setTimeout(() => {
                        const redirectTo = localStorage.getItem("redirectAfterLogin") || "index.html";
                        localStorage.removeItem("redirectAfterLogin");
                        window.location.href = redirectTo;
                    }, 1500);
                })
                .catch((error) => {
                    showToast(error.message, "error");
                });
        }
        
    });

    /* ==============================
       SIGNUP VALIDATION
    ============================== */
    document.getElementById("signup-btn").addEventListener("click", () => {
        const name = document.getElementById("signup-name").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value;
        const confirm = document.getElementById("signup-confirm").value;
        let isValid = true;

        clearAllErrors(signupForm);

        if (!name) {
            showError("signup-name-error", "Full name is required");
            isValid = false;
        }

        if (!email) {
            showError("signup-email-error", "Email is required");
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError("signup-email-error", "Please enter a valid email address");
            isValid = false;
        }

        if (!password) {
            showError("signup-password-error", "Password is required");
            isValid = false;
        } else if (!isValidPassword(password)) {
            showError("signup-password-error", "Password must be 8+ characters with uppercase, lowercase and a number");
            isValid = false;
        }

        if (!confirm) {
            showError("signup-confirm-error", "Please confirm your password");
            isValid = false;
        } else if (confirm !== password) {
            showError("signup-confirm-error", "Passwords do not match");
            isValid = false;
        }

        if (isValid) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log("User Created:", userCredential.user);
                    // Set localStorage flag
                    localStorage.setItem("isLoggedIn", "true");
                    showToast("Account created successfully! 🎉", "success");
        
                    setTimeout(() => {
                        const redirectTo = localStorage.getItem("redirectAfterLogin") || "index.html";
                        localStorage.removeItem("redirectAfterLogin");
                        window.location.href = redirectTo;
                    }, 1500);
                })
                .catch((error) => {
                    showToast(error.message, "error");
                });
        }
    });

});