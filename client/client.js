// =========================
//   LOGIN & CART LOGIC
// =========================

// Read login and cart state from localStorage
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
let cartCount = parseInt(localStorage.getItem("cartCount") || "0");

// Select elements from the page
let cartCountSpan = document.getElementById("CartCount");
let loginBtn = document.getElementById("LoginBtn");
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

function RenderProducts(){
    let products = JSON.parse(localStorage.getItem("products")) || [];
     let container = document.getElementById("ProductsSection");
     container.innerHTML="";
     products.forEach(p=>{
      let card = document.createElement("div");
      card.classList.add("Card");
      card.setAttribute("data-longDesc", p.readmore);
      card.setAttribute("data-fit", p.selectfit);
      card.setAttribute("data-fabric", p.fabric);
      card.setAttribute("data-thickness", p.thickness);
      card.setAttribute("data-color", p.color);
      card.setAttribute("data-category", p.category);
      card.setAttribute("data-shortDesc",p.description)
      card.innerHTML=
      `<div class="ProductImg">
        <img src="${p.image}" alt="${p.name} ${p.category}">
      </div>
      <div class="ProductContent">
        <div class="Title">${p.name}</div>
        <div class="ReadMore">${p.description}</div>
        <div class="SizeWrap">
          <label for="sizeSelect">Size:</label>
          <select class="sizeSelect">
            <option value="S">S</option>
            <option value="M" selected>M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>
        <div class="row">
          <span class="price">$${p.price.toFixed(2)}</span>
          <div class="RowBtns">
            <button class="ReadMoreBtn">Read More</button>
            <button class="AddItemBtn">Add To Cart</button>
          </div>
        </div>
      </div>`;
      container.appendChild(card);

     });
     attachCardListeners();
}
document.addEventListener("DOMContentLoaded",RenderProducts);

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
});function attachCardListeners() {

// Press on each card to direct to the Products Details Page  
document.querySelectorAll(".Card").forEach(card=>{
  card.addEventListener('click',()=>{
    let product = {
      title:card.querySelector(".Title").textContent,
      desc: card.getAttribute("data-longDesc"),
      price: parseFloat(card.querySelector(".price").textContent.replace("$", "")),
      size: card.querySelector(".sizeSelect").value,
      imgSrc: card.querySelector(".ProductImg img").src,
      fit: card.getAttribute("data-fit"),
      fabric: card.getAttribute("data-fabric"),
      thickness: card.getAttribute("data-thickness"),
      color: card.getAttribute("data-color"),
      sportswearType: card.getAttribute("data-category"), 


    }
    goToProductPage(product);
  });
});
  // READ MORE
  document.querySelectorAll(".ReadMoreBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      let card = btn.closest(".Card");
      let title = card.querySelector(".Title").textContent;
      let desc = card.dataset.longDesc;
      let price = card.querySelector(".price").textContent;
      let size = card.querySelector(".sizeSelect").value;
      let imgSrc = card.querySelector(".ProductImg img").src;

      document.getElementById("ModalTitle").textContent = title;
      document.getElementById("ModalDesc").textContent = desc;
      document.getElementById("ModalPrice").textContent = price;
      document.getElementById("ModalsizeSelect").value = size;
      document.getElementById("ModalImg").src = imgSrc;
      document.getElementById("QtyValue").textContent = "1";

      ProductModal.setAttribute("data-fit",card.dataset.fit);
      ProductModal.setAttribute("data-fabric",card.dataset.fabric);
      ProductModal.setAttribute("data-thickness",card.dataset.thickness);
      ProductModal.setAttribute("data-color",card.dataset.color);
      ProductModal.setAttribute("data-category",card.dataset.category);
      ProductModal.setAttribute("data-shortDesc",card.dataset.shortDesc);
      ProductModal.setAttribute("data-longDesc",desc);
      
      


      ProductModal.classList.add("active");
      Overlay.classList.add("active");
    });
  });

  // ADD TO CART (btn of the card not readmore add to cart)
  document.querySelectorAll(".AddItemBtn").forEach(btn => {
    btn.addEventListener("click", function (e) {
      if (!isLoggedIn) {
        alert("Please login first.");
        window.location.href = "../signup and login/SandL.html";
        return;
      }

      let card = btn.closest(".Card");
      let title = card.querySelector(".Title").textContent;
      let priceText = card.querySelector(".price").textContent.trim();
      let price = parseFloat(priceText.replace("$", ""));
      let imgSrc = card.querySelector(".ProductImg img").src;
      let size = card.querySelector(".sizeSelect").value;
      let qty = 1;

      let productsListing = document.querySelector(".ProductsListing");
      let existingCards = productsListing.querySelectorAll(".ListingCard");

      let found = false;
      existingCards.forEach(listCard => {
        let existingTitle = listCard.querySelector(".ListingTitle").textContent;
        let existingSize = listCard.querySelector(".ListingSize").textContent.replace("Size: ", "");
        if (existingTitle === title && existingSize === size) {
          let qtySpan = listCard.querySelector(".NumberOfProducts");
          qtySpan.textContent = parseInt(qtySpan.textContent) + qty;
          found = true;
        }
      });

      if (!found) {
        let newCard = document.createElement("div");
        newCard.classList.add("ListingCard");
        newCard.innerHTML = `
          <div class="ListingImg">
            <img src="${imgSrc}" alt="${title}" />
          </div>
          <div class="ListingContent">
            <h3 class="ListingTitle">${title}</h3>
            <p class="ListingSize">Size: ${size}</p>
            <div class="ListingBtns">
              <div class="Increment-decrementbtn">
                <button class="PlusMinusBtn minus">-</button>
                <span class="NumberOfProducts">${qty}</span>
                <button class="PlusMinusBtn plus">+</button>
              </div>
              <button class="RemoveProduct">Remove</button>
            </div>
          </div>
          <div class="ListingPrice">$${price.toFixed(2)}</div>
        `;
        productsListing.appendChild(newCard);
      }

      updateCartState();
      document.getElementById("CartSideBar").classList.add("open");
      document.getElementById("Overlay").classList.add("active");
    });
  });
}





let qtyValue =  document.getElementById("QtyValue");
let Modalplus = document.getElementById("QtyPlus");
Modalplus.addEventListener('click',()=>{
    qtyValue.textContent=parseInt(qtyValue.textContent)+1;
});
let Modalminus=document.getElementById("QtyMinus");
Modalminus.addEventListener('click',()=>{
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
    let existingSize = card.querySelector(".ListingSize").textContent.replace("Size:","").trim();
    if (existingTitle === product.title && existingSize === product.size) {
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

function goToProductPage(product){
  localStorage.setItem("selectedProduct",JSON.stringify(product));
  window.location.href = "../Products-Detailss/Products.html";
} 

document.querySelector(".ProductDetailsLink").addEventListener('click',(e)=>{
  e.preventDefault();
  let product = {
  title: document.getElementById("ModalTitle").textContent,
  desc: ProductModal.getAttribute("data-longDesc"), // safer than reading inner text
  price: parseFloat(document.getElementById("ModalPrice").textContent.replace("$","")),
  size: document.getElementById("ModalsizeSelect").value,
  imgSrc: document.getElementById("ModalImg").src,
  fit: ProductModal.getAttribute("data-fit"),
  fabric: ProductModal.getAttribute("data-fabric"),
  thickness: ProductModal.getAttribute("data-thickness"),
  color: ProductModal.getAttribute("data-color"),
  sportswearType: ProductModal.getAttribute("data-category")
};

  goToProductPage(product);
})



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

