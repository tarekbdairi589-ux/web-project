let products = JSON.parse(localStorage.getItem("products")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [];
window.addEventListener("storage", (event) => {
    if (event.key === "products" || event.key === "categories") {
        products = JSON.parse(localStorage.getItem("products")) || [];
        categories = JSON.parse(localStorage.getItem("categories")) || [];

        loadCategoryButtons();
        loadColorFilter(); 
        loadCategoryProducts();
    }
});

function loadCartFromLocalStorage() {
  let savedCart = JSON.parse(localStorage.getItem("cart")) || [];
  let productsListing = document.querySelector(".ProductsListing");

  productsListing.innerHTML = ""; // Clear existing

  savedCart.forEach(item => {
    let newCard = document.createElement("div");
    newCard.classList.add("ListingCard");
    newCard.innerHTML = `
      <div class="ListingImg"><img src="${item.imgSrc}" alt="${item.title}" /></div>
      <div class="ListingContent">
        <h3 class="ListingTitle">${item.title}</h3>
        <p class="ListingDescription">${item.desc}</p>
        <div class="ListingBtns">
          <div class="Increment-decrementbtn">
            <button class="PlusMinusBtn minus">-</button>
            <span class="NumberOfProducts">${item.qty}</span>
            <button class="PlusMinusBtn plus">+</button>
          </div>
          <button class="RemoveProduct">Remove</button>
        </div>
      </div>
      <div class="ListingPrice">$${item.price.toFixed(2)}</div>
    `;
    productsListing.appendChild(newCard);
  });

  updateCartState(); // Refresh count and subtotal
}
function clearCart() {
  document.querySelector(".ProductsListing").innerHTML = "";
  localStorage.removeItem("cart");
  localStorage.setItem("cartCount", "0");
  updateCartState();
}
function saveCartToLocalStorage() {
  let cartArray = [];

  document.querySelectorAll(".ListingCard").forEach(card => {
    cartArray.push({
      title: card.querySelector(".ListingTitle").textContent,
      desc: card.querySelector(".ListingDescription").textContent,
      price: parseFloat(card.querySelector(".ListingPrice").textContent.replace("$","")),
      qty: parseInt(card.querySelector(".NumberOfProducts").textContent),
      imgSrc: card.querySelector(".ListingImg img").src
    });
  });

  localStorage.setItem("cart", JSON.stringify(cartArray));
}
function updateItemCount(count) {
    $('.shownumitem').text(`${count} item${count !== 1 ? 's' : ''}`);
}
function loadColorFilter() {
    let colorSelect = $("#selectcolor");
    colorSelect.empty();
    colorSelect.append('<option value="Any" selected>Any Color</option>');

    let uniqueColors = [...new Set(products.map(p => p.color).filter(c => c))];

    uniqueColors.forEach(color => {
        colorSelect.append(`<option value="${color}">${color}</option>`);
    });
}

// Load categories into category buttons
function loadCategoryButtons() {
    let box = $("#category-buttons");
    box.empty();

    box.append(`<button class="categorybtn" data-cat="All">All</button>`);

    categories.forEach(cat => {
        box.append(`<button class="categorybtn" data-cat="${cat}">${cat}</button>`);
    });

    $(".categorybtn").on("click", function () {
        let selected = $(this).data("cat");
        loadCategoryProducts(selected);
    });
}

// Load and display filtered products
function loadCategoryProducts(filterCategory = "All") {
    let search = $("#searchinput").val()?.trim().toLowerCase() || "";
    let sizeFilter = $("#selectsize").val() || "Any";
    let maxPrice = parseFloat($("#range").val()) || Infinity;
    let sort = $("#pricerange").val();
    let colorFilter = $("#selectcolor").val() || "Any";


    // Filtering
    let filtered = products.filter(p => {
        let matchCat = (filterCategory === "All" || p.category === filterCategory);
        let matchSearch = (!search || p.name.toLowerCase().includes(search));
        let matchSize = (sizeFilter === "Any" || (p.size || "Any") === sizeFilter);
        let matchPrice = (p.price <= maxPrice);
        let matchColor = (colorFilter === "Any" || (p.color || "Any") === colorFilter);

        return matchCat && matchSearch && matchSize && matchPrice&& matchColor;
    });

  
    filtered.sort((a, b) => {
        if (sort === "Price:High→Low") return b.price - a.price;
        if (sort === "Price:Low→High") return a.price - b.price;
        if (sort === "Newest") return b.id - a.id;
        if (sort === "Oldest") return a.id - b.id;
        return 0;
    });


    updateItemCount(filtered.length);


    let container = $("#category-container");
    container.empty();

    filtered.forEach(p => {
        let img = p.image || "https://via.placeholder.com/200x200?text=No+Image";

        let card = `
        <div class="Card">
            <img class="ProductImg" src="${img}" alt="${p.name}">
            <div class="ProductContent">
                <div class="Title">${p.name}</div>
                <div class="ReadMore">${p.readmore || p.description || ""}</div>
                
                <div class="row">
                    <div class="price">$${p.price.toFixed(2)}</div>
                    <div class="RowBtns">
                        <button class="ReadMoreBtn">Read More</button>
                        <button class="AddItemBtn">Add</button>
                    </div>
                </div>
            </div>
        </div>
        `;

        container.append(card);
    });
}
$("#searchinput, #selectsize, #range, #pricerange, #selectcolor").on("input change", function () {
    loadCategoryProducts();
});
// Read login state
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

// Setup login button behavior
let loginBtn = document.getElementById("LoginBtn");

if (isLoggedIn) {
    loginBtn.textContent = "Logout";
} else {
    loginBtn.textContent = "Login";
}

loginBtn.addEventListener("click", function () {
    if (isLoggedIn) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        alert("Logged out successfully!");
        window.location.reload();
    } else {
        window.location.href = "../signup and login/SandL.html";
    }
});
$(document).on("click", ".AddItemBtn", function () {
  if (!isLoggedIn) {
    alert("Please login first.");
    window.location.href = "../signup and login/SandL.html";
    return;
  }

  let card = $(this).closest(".Card");
  let title = card.find(".Title").text();
  let desc = card.find(".ReadMore").text();
  let price = parseFloat(card.find(".price").text().replace("$", ""));
  let imgSrc = card.find(".ProductImg").attr("src");

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
      <div class="ListingImg"><img src="${imgSrc}" alt="${title}" /></div>
      <div class="ListingContent">
        <h3 class="ListingTitle">${title}</h3>
        <p class="ListingDescription">${desc}</p>
        <div class="ListingBtns">
          <div class="Increment-decrementbtn">
            <button class="PlusMinusBtn minus">-</button>
            <span class="NumberOfProducts">1</span>
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

  // 👉 Open sidebar immediately
  CartSideBar.classList.add("open");
  Overlay.classList.add("active");
  updateCartState();
});
function updateCartState() {
  let totalQty = 0;
  let subtotal = 0;

  document.querySelectorAll(".ListingCard").forEach(card => {
    let qty = parseInt(card.querySelector(".NumberOfProducts").textContent);
    let price = parseFloat(card.querySelector(".ListingPrice").textContent.replace("$", ""));
    totalQty += qty;
    subtotal += qty * price;
  });

  localStorage.setItem("cartCount", totalQty.toString());
  document.getElementById("CartCount").textContent = totalQty;

  let subtotalSpan = document.getElementById("CartSubtotal");
  if (subtotalSpan) {
    subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
  }

  // 👉 Save updated cart
  saveCartToLocalStorage();
}
// Open modal
$(document).on("click", ".ReadMoreBtn", function () {
  let card = $(this).closest(".Card");
  $("#ModalTitle").text(card.find(".Title").text());
  $("#ModalDesc").text(card.find(".ReadMore").text());
  $("#ModalPrice").text(card.find(".price").text());
  $("#ModalImg").attr("src", card.find(".ProductImg").attr("src"));
  $("#QtyValue").text("1");
  $(".ProductModal").addClass("active");
  $("#Overlay").addClass("active");
});

$(".CloseProduct").click(() => {
  $(".ProductModal").removeClass("active");
  $("#Overlay").removeClass("active");
});

$("#QtyPlus").click(() => {
  $("#QtyValue").text(parseInt($("#QtyValue").text()) + 1);
});
$("#QtyMinus").click(() => {
  let current = parseInt($("#QtyValue").text());
  if (current > 1) $("#QtyValue").text(current - 1);
});

// Close modal
$(".CloseProduct").click(function () {
    $(".ProductModal").removeClass("active");
    $("#Overlay").removeClass("active");
});

$("#Overlay").click(function () {
    $(".ProductModal").removeClass("active");
    $("#Overlay").removeClass("active");let CartBtn = document.getElementById("Cart-Btn");
let CartSideBar = document.getElementById("CartSideBar");
let Overlay = document.getElementById("Overlay");
let CloseBtn = document.getElementById("CloseBtn");

CartBtn.addEventListener("click", () => {
    CartSideBar.classList.add("open");
    Overlay.classList.add("active");
});

CloseBtn.addEventListener("click", () => {
    CartSideBar.classList.remove("open");
    Overlay.classList.remove("active");
});

Overlay.addEventListener("click", () => {
    CartSideBar.classList.remove("open");
    Overlay.classList.remove("active");
});
});

let CartBtn = document.getElementById("Cart-Btn");
let CartSideBar = document.getElementById("CartSideBar");
let Overlay = document.getElementById("Overlay");
let CloseBtn = document.getElementById("CloseBtn");

CartBtn.addEventListener("click", () => {
  CartSideBar.classList.add("open");
  Overlay.classList.add("active");
});
CloseBtn.addEventListener("click", () => {
  CartSideBar.classList.remove("open");
  Overlay.classList.remove("active");
});
Overlay.addEventListener("click", () => {
  CartSideBar.classList.remove("open");
  Overlay.classList.remove("active");
  $(".ProductModal").removeClass("active");
});
$(".ProductsListing").on("click", ".minus", function () {
  let qtySpan = $(this).siblings(".NumberOfProducts");
  let current = parseInt(qtySpan.text());

  if (current > 1) {
    qtySpan.text(current - 1);
  } else {
    // 👉 If quantity goes to 0, remove the product
    $(this).closest(".ListingCard").remove();
  }

  updateCartState();
});

$(".ProductsListing").on("click", ".plus", function () {
  let qtySpan = $(this).siblings(".NumberOfProducts");
  qtySpan.text(parseInt(qtySpan.text()) + 1);
  updateCartState();
});

$(".ProductsListing").on("click", ".RemoveProduct", function () {
  $(this).closest(".ListingCard").remove();
  updateCartState();
});
$(document).ready(function () {
    loadCategoryButtons();
    loadCategoryProducts();
    loadCartFromLocalStorage();
});


