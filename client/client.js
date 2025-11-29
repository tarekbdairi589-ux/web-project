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
let ProfileSideBar = document.getElementById("ProfileSideBar");
let CloseProfileBtn = document.getElementById("CloseProfileBtn");
let userLogo = document.getElementById("userLogo");

function saveCartToLocalStorage() {
  let cartArray = [];

  document.querySelectorAll(".ListingCard").forEach(card => {
    cartArray.push({
      name: card.querySelector(".ListingTitle").textContent,
      qty: parseInt(card.querySelector(".NumberOfProducts").textContent),
      price: parseFloat(card.querySelector(".ListingPrice").textContent.replace("$","")),
      image: card.querySelector(".ListingImg img").src
    });
  });

  localStorage.setItem("cart", JSON.stringify(cartArray));
}
let CheckOutBtn = document.getElementById("CheckOutBtn");

CheckOutBtn.addEventListener("click", () => {
  saveCartToLocalStorage();  // SAVE THE CART FIRST

  // Redirect to checkout page
  window.location.href = "../checkout/cart.html"; 
});


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

    // Get product info
    let card = btn.closest(".Card");
    let title = card.querySelector(".Title").textContent;
    let description = card.querySelector(".ReadMore").textContent;
    let priceText = card.querySelector(".price").textContent.trim();
    let price = parseFloat(priceText.replace("$", ""));
    let img = card.querySelector(".ProductImg img");
    let imgSrc = img ? img.src : "";
    let imgAlt = img ? img.alt : "";

    let productsListing = document.querySelector(".ProductsListing");
    let existingCards = productsListing.querySelectorAll(".ListingCard");

    let found = false;

    existingCards.forEach(card => {
      let existingTitle = card.querySelector(".ListingTitle").textContent;
      if (existingTitle === title) {
        let qtySpan = card.querySelector(".NumberOfProducts");
        qtySpan.textContent = parseInt(qtySpan.textContent) + 1;
        found = true;
      }
    });

    if (!found) {
      let newCard = document.createElement("div");
      newCard.classList.add("ListingCard");
      newCard.innerHTML = `
        <div class="ListingImg">
          <img src="${imgSrc}" alt="${imgAlt}" />
        </div>
        <div class="ListingContent">
          <h3 class="ListingTitle">${title}</h3>
          <p class="ListingDescription">${description}</p>
          <div class="ListingBtns">
            <div class="Increment-decrementbtn">
              <button class="PlusMinusBtn">-</button>
              <span class="NumberOfProducts">1</span>
              <button class="PlusMinusBtn">+</button>
            </div>
            <button class="RemoveProduct">Remove</button>
          </div>
        </div>
        <div class="ListingPrice">$${price.toFixed(2)}</div>
      `;
      productsListing.appendChild(newCard);
    }

    // Update cart count and subtotal
    updateCartState();
  });
});

function updateCartState() {
  let totalQty = 0;
  let subtotal = 0;

  document.querySelectorAll(".ListingCard").forEach(card => {
    let qty = parseInt(card.querySelector(".NumberOfProducts").textContent);
    let priceText = card.querySelector(".ListingPrice").textContent.trim();
    let price = parseFloat(priceText.replace("$", ""));
    totalQty += qty;
    subtotal += qty * price;
  });

  cartCount = totalQty;
  localStorage.setItem("cartCount", cartCount.toString());
  updateCartUI();

  let subtotalSpan = document.getElementById("CartSubtotal");
  if (subtotalSpan) {
    subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
  }
}
let ProductModal = document.querySelector(".ProductModal");
let CloseProductBtn = document.querySelector(".CloseProduct");

// Close with X
CloseProductBtn.addEventListener("click", () => {
  ProductModal.classList.remove("active");
  Overlay.classList.remove("active");
});

// Close when clicking overlay
Overlay.addEventListener("click", () => {
  ProductModal.classList.remove("active");
  Overlay.classList.remove("active");
});

let ReadMoreBtn = document.querySelectorAll(".ReadMoreBtn");
ReadMoreBtn.forEach(btn=>{
    btn.addEventListener('click',()=>{
        let card= btn.closest(".Card");
        let title = card.querySelector(".Title").textContent;
        let desc = card.querySelector(".ReadMore").textContent;
        let price = card.querySelector(".price").textContent;
        let size = card.querySelector(".sizeSelect").value;
        let imgSrc = card.querySelector(".ProductImg img").src;

    document.getElementById("ModalTitle").textContent = title;
    document.getElementById("ModalDesc").textContent = desc;
    document.getElementById("ModalPrice").textContent = price;
    document.getElementById("ModalsizeSelect").value = size;
    document.getElementById("ModalImg").src = imgSrc;

    document.getElementById("QtyValue").textContent='1';

    ProductModal.classList.add("active");
    Overlay.classList.add("active");

    });
});



let qtyValue =  document.getElementById("QtyValue");
let plus = document.getElementById("QtyPlus");
plus.addEventListener('click',()=>{
    qtyValue.textContent=parseInt(qtyValue.textContent)+1;
});
let minus=document.getElementById("QtyMinus");
minus.addEventListener('click',()=>{
    let current = parseInt(qtyValue.textContent);
    if(current>1){
        qtyValue.textContent=current-1;
    }
})

document.querySelector(".ProductModal .AddItemBtn").addEventListener("click", () => {
  if (!isLoggedIn) {
    alert("Please login first.");
    window.location.href = "../signup and login/SandL.html";
    return;
  }

  let product = {
    title: document.getElementById("ModalTitle").textContent,
    desc: document.getElementById("ModalDesc").textContent,
    price: parseFloat(document.getElementById("ModalPrice").textContent.replace("$","")),
    size: document.getElementById("ModalsizeSelect").value,
    qty: parseInt(document.getElementById("QtyValue").textContent),
    imgSrc: document.getElementById("ModalImg").src
  };

  // Add to cart sidebar
  let productsListing = document.querySelector(".ProductsListing");
  let existingCards = productsListing.querySelectorAll(".ListingCard");
  let found = false;

  existingCards.forEach(card => {
    let existingTitle = card.querySelector(".ListingTitle").textContent;
    if (existingTitle === product.title) {
      let qtySpan = card.querySelector(".NumberOfProducts");
      qtySpan.textContent = parseInt(qtySpan.textContent) + product.qty;
      found = true;
    }
  });

  if (!found) {
    let newCard = document.createElement("div");
    newCard.classList.add("ListingCard");
    newCard.innerHTML = `
      <div class="ListingImg">
        <img src="${product.imgSrc}" alt="${product.title}" />
      </div>
      <div class="ListingContent">
        <h3 class="ListingTitle">${product.title}</h3>
        <p class="ListingDescription">${product.desc}</p>
        <p class="ListingSize" >Size: ${product.size}</p>
        <div class="ListingBtns">
          <div class="Increment-decrementbtn">
            <button class="PlusMinusBtn minus">-</button>
            <span class="NumberOfProducts">${product.qty}</span>
            <button class="PlusMinusBtn plus">+</button>
          </div>
          <button class="RemoveProduct">Remove</button>
        </div>
      </div>
      <div class="ListingPrice">$${product.price.toFixed(2)}</div>
    `;
    productsListing.appendChild(newCard);
  }

  updateCartState();

  // Close modal
  document.querySelector(".ProductModal").classList.remove("active");
  document.getElementById("Overlay").classList.remove("active");
});

let backToTopBtn = document.querySelector(".BackToTopBtn");

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
 userLogo.addEventListener("click", () => {
    ProfileSideBar.classList.add("open");
    Overlay.classList.add("active");
});

// Close profile sidebar
CloseProfileBtn.addEventListener("click", () => {
    ProfileSideBar.classList.remove("open");
    Overlay.classList.remove("active");
});

// Close by clicking outside
Overlay.addEventListener("click", () => {
    ProfileSideBar.classList.remove("open");
});

$(document).ready(function () {
    $("#OrdersBtn").click(function () {
        window.location.href = "../profile/orders/orders.html";
    });

    
// Minus button inside cart sidebar
$(".ProductsListing").on("click", ".minus", function(){
  let qtySpan = $(this).siblings(".NumberOfProducts");
  let current = parseInt(qtySpan.text());
  if(current > 1){
    qtySpan.text(current - 1);
  };
  updateCartState();
});

// Plus button inside cart sidebar
$(".ProductsListing").on("click", ".plus", function(){
  let qtySpan = $(this).siblings(".NumberOfProducts");
  let current = parseInt(qtySpan.text());
  qtySpan.text(current + 1);
  updateCartState();
});





$(".ProductsListing").on("click", ".RemoveProduct", function(){
  $(this).closest(".ListingCard").remove();
  updateCartState();

});



// About Us link
document.getElementById("AboutUsNav").addEventListener("click", function(e) {
  e.preventDefault(); // prevent default jump
  document.getElementById("About").scrollIntoView({
    behavior: "smooth"
  });
});

// Contact Us link
document.getElementById("ContactUsNav").addEventListener("click", function(e) {
  e.preventDefault();
  document.getElementById("Contact").scrollIntoView({
    behavior: "smooth"
  });
});







});
$("#AccountInfoBtn").click(function () {
    window.location.href = "../profile/orders/account/account.html"; 
});

