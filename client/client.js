// =========================
//   LOGIN & CART LOGIC
// =========================

// Read login and cart state from localStorage
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
let cartCount = parseInt(localStorage.getItem("cartCount") || "0");

// Select elements from the page
let cartCountSpan = document.getElementById("CartCount");
let loginBtn = document.getElementById("LoginBtn");
let addButtons = document.querySelectorAll(".AddItemBtn");
let cartBtn = document.getElementById("Cart-Btn");

// Update the cart number on page load
function updateCartUI() {
    if (cartCountSpan) {
        cartCountSpan.textContent = cartCount;
    }
}
updateCartUI();

// =========================
//   LOGIN / LOGOUT BUTTON
// =========================

if (isLoggedIn) {
    loginBtn.textContent = "Logout";   // change button to Logout
} else {
    loginBtn.textContent = "Login";    // default state
}

loginBtn.addEventListener("click", function () {
    if (isLoggedIn) {
        // LOGOUT LOGIC
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        alert("Logged out successfully!");
        window.location.reload();  // refresh UI
    } else {
        // GO TO LOGIN PAGE
        window.location.href = "../signup and login/SandL.html";
    }
});

// =========================
//   ADD TO CART LOGIC
// =========================

addButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        if (!isLoggedIn) {
            alert("Please login first.");
            window.location.href = "../signup and login/SandL.html";
            return;
        }

        // User is logged in → increase cart
        cartCount++;
        localStorage.setItem("cartCount", cartCount.toString());
        updateCartUI();
    });
});

// Optional: open cart page if cart button clicked
if (cartBtn) {
    cartBtn.addEventListener("click", function () {
        // You can change this when you create cart.html
        alert("Cart page not created yet!");
    });
}
