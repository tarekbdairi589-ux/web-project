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
  newCard.setAttribute("data-size", item.size);
  newCard.setAttribute("data-color", item.color);
  newCard.innerHTML = `
    <div class="ListingImg"><img src="${item.imgSrc}" alt="${item.title}" /></div>
    <div class="ListingContent">
      <h3 class="ListingTitle">${item.title}</h3>
      <p class="ListingDescription">${item.desc}</p>
      <p class="ListingSizeColor">Size: ${item.size}, Color: ${item.color}</p>
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
      price: parseFloat(card.querySelector(".ListingPrice").textContent.replace("$", "")),
      qty: parseInt(card.querySelector(".NumberOfProducts").textContent),
      imgSrc: card.querySelector(".ListingImg img").src,
      size: card.getAttribute("data-size") || "Default",
      color: card.getAttribute("data-color") || "Default"
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


function loadCategoryProducts(filterCategory = "All") {
    let search = $("#searchinput").val()?.trim().toLowerCase() || "";
    let sizeFilter = $("#selectsize").val() || "Any";
    let maxPrice = parseFloat($("#range").val()) || Infinity;
    let sort = $("#pricerange").val();
    let colorFilter = $("#selectcolor").val() || "Any";



    let filtered = products.filter(p => {
        let matchCat = (filterCategory === "All" || p.category === filterCategory);
        let productName = (p.name || p.title || "").toLowerCase();
        let matchSearch = (!search || productName.includes(search));
        let matchSize = (sizeFilter === "Any" || (p.size || []).includes(sizeFilter));
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


  let product = products.find(p => p.name === title);
  if (!product) return alert("Product not found!");

  let productsListing = document.querySelector(".ProductsListing");
  let existingCards = productsListing.querySelectorAll(".ListingCard");


  let size = product.size.length > 1 ? prompt(`Select size: ${product.size.join(", ")}`, product.size[0]) : product.size[0];
  let color = product.color.length > 1 ? prompt(`Select color: ${product.color.join(", ")}`, product.color[0]) : product.color[0];

  // Check if already in cart
  let found = false;
  existingCards.forEach(card => {
    let existingTitle = card.querySelector(".ListingTitle").textContent;
    let existingSize = card.getAttribute("data-size") || "Default";
    let existingColor = card.getAttribute("data-color") || "Default";

    if (existingTitle === title && existingSize === size && existingColor === color) {
      let qtySpan = card.querySelector(".NumberOfProducts");
      let currentQty = parseInt(qtySpan.textContent);
      if (currentQty + 1 > product.quantity) {
        alert(`Cannot add more than ${product.quantity} items.`);
      } else {
        qtySpan.textContent = currentQty + 1;
      }
      found = true;
    }
  });

  if (!found) {
    if (product.quantity < 1) return alert("Product out of stock!");

    let newCard = document.createElement("div");
    newCard.classList.add("ListingCard");
    newCard.setAttribute("data-size", size);
    newCard.setAttribute("data-color", color);
    newCard.innerHTML = `
      <div class="ListingImg"><img src="${product.image || 'https://via.placeholder.com/200'}" alt="${title}" /></div>
      <div class="ListingContent">
        <h3 class="ListingTitle">${title}</h3>
        <p class="ListingDescription">${product.readmore || product.description}</p>
        <p class="ListingSizeColor">Size: ${size}, Color: ${color}</p>
        <div class="ListingBtns">
          <div class="Increment-decrementbtn">
            <button class="PlusMinusBtn minus">-</button>
            <span class="NumberOfProducts">1</span>
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
  CartSideBar.classList.add("open");
  Overlay.classList.add("active");
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

  // 👉 Disable checkout if cart is empty
  let checkoutBtn = document.getElementById("CheckOutBtn");
  if (checkoutBtn) {
    if (totalQty === 0) {
      checkoutBtn.disabled = true;
      checkoutBtn.classList.add("disabled"); // optional styling
      checkoutBtn.textContent = "Cart is empty"; // optional feedback
    } else {
      checkoutBtn.disabled = false;
      checkoutBtn.classList.remove("disabled");
      checkoutBtn.textContent = "Checkout"; // reset text
    }
  }

  saveCartToLocalStorage();
}

// Open modal
$(document).on("click", ".ReadMoreBtn", function() {
    let card = $(this).closest(".Card");
    let productName = card.find(".Title").text();

    // Find product in localStorage by name
    let product = products.find(p => p.name === productName);
    if (!product) return;

    // Set modal info
    $("#ModalTitle").text(product.name);
    $("#ModalDesc").text(product.readmore || product.description || "");
    $("#ModalPrice").text(`$${product.price.toFixed(2)}`);
    $("#ModalImg").attr("src", product.image || "https://via.placeholder.com/200x200");

    // Populate size dropdown dynamically
    let sizeSelect = $("#ModalSize");
    sizeSelect.empty();
    product.size.forEach(s => sizeSelect.append(`<option value="${s}">${s}</option>`));


    let colorSelect = $("#ModalColor");
    colorSelect.empty();
    product.color.forEach(c => colorSelect.append(`<option value="${c}">${c}</option>`));

    // Show max quantity (sum of stock for that product)
    $("#MaxQty").text(product.quantity);

    $("#QtyValue").text(1); // default quantity
    $(".ProductModal").addClass("active");
    $("#Overlay").addClass("active");
});




$(".CloseProduct").click(() => {
  $(".ProductModal").removeClass("active");
  $("#Overlay").removeClass("active");
});

$("#QtyPlus").click(() => {
    let current = parseInt($("#QtyValue").text());
    let productName = $("#ModalTitle").text();
    let product = products.find(p => p.name === productName);
    if(current < product.quantity) {
        $("#QtyValue").text(current + 1);
    } else {
        alert(`Max quantity is ${product.quantity}`);
    }
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
    $(this).closest(".ListingCard").remove();
  }

  updateCartState();
});

$(".ProductsListing").on("click", ".plus", function () {
  let qtySpan = $(this).siblings(".NumberOfProducts");
  let currentQty = parseInt(qtySpan.text());

  // Get product info from card
  let card = $(this).closest(".ListingCard");
  let title = card.find(".ListingTitle").text();
  let size = card.attr("data-size") || "Default";
  let color = card.attr("data-color") || "Default";

  // Find product in products array
  let product = products.find(p => p.name === title);
  if (!product) return;

  // Check stock limit
  if (currentQty + 1 > product.quantity) {
    alert(`Cannot add more than ${product.quantity} items for this product.`);
    return;
  }

  qtySpan.text(currentQty + 1);
  updateCartState();
});

$(".ProductsListing").on("click", ".RemoveProduct", function () {
  $(this).closest(".ListingCard").remove();
  updateCartState();
});
$("#AddToCartModal").click(function() {
    let title = $("#ModalTitle").text();
    let size = $("#ModalSize").val();
    let color = $("#ModalColor").val();
    let qty = parseInt($("#QtyValue").text());

    let product = products.find(p => p.name === title);
    if (!product) return;

    // Check max available
    if (qty > product.quantity) {
        alert(`Cannot add more than ${product.quantity} items for this product!`);
        return;
    }

    let productsListing = document.querySelector(".ProductsListing");
    let existingCards = productsListing.querySelectorAll(".ListingCard");
    let found = false;

    existingCards.forEach(card => {
        let existingTitle = card.querySelector(".ListingTitle").textContent;
        let existingSize = card.getAttribute("data-size") || "Default";
        let existingColor = card.getAttribute("data-color") || "Default";

        if (existingTitle === title && existingSize === size && existingColor === color) {
            let qtySpan = card.querySelector(".NumberOfProducts");
            let currentQty = parseInt(qtySpan.textContent);
            if (currentQty + qty > product.quantity) {
                alert(`Cannot add more than ${product.quantity} items.`);
            } else {
                qtySpan.textContent = currentQty + qty;
            }
            found = true;
        }
    });

    if (!found) {
        let newCard = document.createElement("div");
        newCard.classList.add("ListingCard");
        newCard.setAttribute("data-size", size);
        newCard.setAttribute("data-color", color);
        newCard.innerHTML = `
          <div class="ListingImg"><img src="${product.image || 'https://via.placeholder.com/200'}" alt="${title}" /></div>
          <div class="ListingContent">
            <h3 class="ListingTitle">${title}</h3>
            <p class="ListingDescription">${product.readmore || product.description}</p>
            <p class="ListingSizeColor">Size: ${size}, Color: ${color}</p>
            <div class="ListingBtns">
              <div class="Increment-decrementbtn">
                <button class="PlusMinusBtn minus">-</button>
                <span class="NumberOfProducts">${qty}</span>
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
    $(".ProductModal").removeClass("active");
    $("#Overlay").removeClass("active");
    CartSideBar.classList.add("open");
    Overlay.classList.add("active");
});
function loadSizeFilter() {
    let sizeSelect = $("#selectsize");
    sizeSelect.empty();
    sizeSelect.append('<option value="Any" selected>Any Size</option>');

    // Collect all sizes from products
    let allSizes = products.flatMap(p => p.size || []);
    let uniqueSizes = [...new Set(allSizes)];

    uniqueSizes.forEach(size => {
        sizeSelect.append(`<option value="${size}">${size}</option>`);
    });
}
let AboutUsNav = document.querySelector("#AboutUsNav");
let footer = document.querySelector("#footer");

AboutUsNav.addEventListener("click", () => {
    footer.scrollIntoView({ behavior: "smooth" });
});

let ContactUsNav = document.querySelector("#ContactUsNav");
let footer2 = document.querySelector("#footer");

ContactUsNav.addEventListener("click", () => {
    footer2.scrollIntoView({ behavior: "smooth" });
});
let checkoutBtn = document.getElementById("CheckOutBtn");


    checkoutBtn.addEventListener("click", () => {
        window.location.href = "../checkout/cart.html";
    });

$(document).ready(function () {
    loadCategoryButtons();
    loadCategoryProducts();
    loadCartFromLocalStorage();
    loadSizeFilter();
});


