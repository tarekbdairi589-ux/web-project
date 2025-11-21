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

let CartBtn = document.getElementById("Cart-Btn");
let CartSideBar = document.getElementById("CartSideBar");
let Overlay = document.getElementById("Overlay");
let CloseBtn = document.getElementById("CloseBtn");


CartBtn.addEventListener('click',()=>{
    CartSideBar.classList.add("open");
    Overlay.classList.add('active');
})

CloseBtn.addEventListener('click',()=>{
    Overlay.classList.remove('active');
    CartSideBar.classList.remove('open');
})

Overlay.addEventListener('click',()=>{
    CartSideBar.classList.remove('open');
    Overlay.classList.remove('active');
})

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

