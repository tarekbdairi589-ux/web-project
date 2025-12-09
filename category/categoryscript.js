let isAdmin = localStorage.getItem("isAdmin") === "true";
function normalizeSize(size) {
    if (!size) return "M";
    let s = size.toLowerCase();
    if (s.includes("small")) return "S";
    if (s.includes("medium")) return "M";
    if (s.includes("large")) return "L";
    if (s.includes("x")) return "XL";
    return size.toUpperCase();
}

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
  let currentUser = localStorage.getItem("currentUser");
  let savedCart = currentUser ? JSON.parse(localStorage.getItem(`cart_${currentUser}`)) || [] : [];

  let productsListing = document.querySelector(".ProductsListing");
  productsListing.innerHTML = ""; 

  savedCart.forEach(item => {
    let newCard = document.createElement("div");
    newCard.classList.add("ListingCard");

    newCard.innerHTML = `
      <div class="ListingImg">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="ListingContent">
        <h3 class="ListingTitle">${item.name}</h3>
        <p class="ListingSize">Size: ${item.size}</p>
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

  updateCartState();
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
      name: card.querySelector(".ListingTitle").textContent,
      qty: parseInt(card.querySelector(".NumberOfProducts").textContent),
      price: parseFloat(card.querySelector(".ListingPrice").textContent.replace("$", "")),
      image: card.querySelector(".ListingImg img").src,
      size: card.getAttribute("data-size") || "M"
    });
  });

  let currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    localStorage.setItem(`cart_${currentUser}`, JSON.stringify(cartArray));
  }
}



function updateItemCount(count) {
    $('.shownumitem').text(`${count} item${count !== 1 ? 's' : ''}`);
}function loadColorFilter() {
    let colorSelect = $("#selectcolor");
    colorSelect.empty();
    colorSelect.append(`<option value="Any" selected>Any Color</option>`);

    let allColors = [];

    products.forEach(p => {
        if (!p.color) return;

        if (Array.isArray(p.color)) {
            p.color.forEach(c => allColors.push(c.trim()));
        } else if (typeof p.color === "string") {
            allColors.push(p.color.trim());
        }
    });

    let uniqueColors = [...new Set(allColors)];

    uniqueColors.forEach(color => {
        colorSelect.append(`<option value="${color}">${color}</option>`);
    });
}

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
        let colors = Array.isArray(p.color) ? p.color : [p.color];
        let matchColor = (colorFilter === "Any" || colors.includes(colorFilter));


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
        let img = p.image ;

        let card = `
        <div class="Card">
            <img class="ProductImg" src="${img}" alt="${p.name}">
            <div class="ProductContent">
                <div class="Title">${p.name}</div>
                <div class="ReadMore">${p.description || ""}</div>
                <div class="SizeWrap">
                    <label>Size:</label>
                      <select class="sizeSelect"></select>
                </div>
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
        let lastCard = container.children().last();
let sizeSelect = lastCard.find(".sizeSelect");
sizeSelect.empty();

let sizes = Array.isArray(p.size) ? p.size : [p.size || "M"];
sizes.forEach(s => {
    let n = normalizeSize(s);
    sizeSelect.append(`<option value="${n}">${n}</option>`);

});

    });
}
$("#searchinput, #selectsize, #range, #pricerange, #selectcolor").on("input change", function () {
    loadCategoryProducts();
});

let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

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
  if(isAdmin){
    return;
  }

  let card = $(this).closest(".Card");
  let title = card.find(".Title").text();
  let product = products.find(p => p.name === title);
  

  let size = normalizeSize(card.find(".sizeSelect").val());
  let color = Array.isArray(product.color) ? product.color[0] : (product.color || "");

  let productsListing = document.querySelector(".ProductsListing");
  let existingCards = productsListing.querySelectorAll(".ListingCard");
  let found = false;

  existingCards.forEach(existing => {
    let existingTitle = existing.querySelector(".ListingTitle").textContent;
    let existingSize = normalizeSize(existing.querySelector(".ListingSize").textContent.replace("Size: ", ""));
    size = normalizeSize(size);


    if (existingTitle === title && existingSize === size) {
      let qtySpan = existing.querySelector(".NumberOfProducts");
      let currentQty = parseInt(qtySpan.textContent);
      if (currentQty + 1 > product.quantity) {
        alert("Not enough stock!");
      } else {
        qtySpan.textContent = currentQty + 1;
      }
      found = true;
    }
  });

  if (!found) {
    let newCard = document.createElement("div");
    newCard.classList.add("ListingCard");
    newCard.innerHTML = `
      <div class="ListingImg"><img src="${product.image || 'https://via.placeholder.com/200'}"></div>
      <div class="ListingContent">
        <h3 class="ListingTitle">${title}</h3>
        <p class="ListingSize">Size: ${size}</p>
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
    newCard.setAttribute("data-size", size);
    productsListing.appendChild(newCard);
  }

  updateCartState();
  saveCartToLocalStorage();
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

  let currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    localStorage.setItem(`cartCount_${currentUser}`, totalQty.toString());
  }

  document.getElementById("CartCount").textContent = totalQty;

  let subtotalSpan = document.getElementById("CartSubtotal");
  if (subtotalSpan) {
    subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
  }

  let checkoutBtn = document.getElementById("CheckOutBtn");
  if (checkoutBtn) {
    if (totalQty === 0) {
      checkoutBtn.disabled = true;
      checkoutBtn.classList.add("disabled"); 
      checkoutBtn.textContent = "Cart is empty"; 
    } else {
      checkoutBtn.disabled = false;
      checkoutBtn.classList.remove("disabled");
      checkoutBtn.textContent = "Checkout"; 
    }
  }

  saveCartToLocalStorage();
}


$(document).on("click", ".ReadMoreBtn", function() {
    let card = $(this).closest(".Card");
    let productName = card.find(".Title").text();

    let product = products.find(p => p.name === productName);
    if (!product) return;

    
    $("#ModalTitle").text(product.name);
    $("#ModalDesc").text(product.readmore );
    $("#ModalPrice").text(`$${product.price.toFixed(2)}`);
    $("#ModalImg").attr("src", product.image || "");


    
    let sizeSelect = $("#ModalSize");
    sizeSelect.empty();
    (Array.isArray(product.size) ? product.size : [product.size || "M"]).forEach(size => {
        sizeSelect.append(`<option value="${size}">${size}</option>`);
    });

    
    $(".ProductModal")
        .attr("data-color", product.color)
        .attr("data-fit", product.fit)
        .attr("data-fabric", product.fabric)
        .attr("data-thickness", product.thickness)
        .attr("data-category", product.category)
        .attr("data-quantity", product.quantity);

    $("#MaxQty").text(product.quantity);
    $("#QtyValue").text("1");

    $(".ProductModal").addClass("active");
    $("#Overlay").addClass("active");
});
$("#SeeProductDetails").click(function(e) {
    e.preventDefault();

    let product = {
        title: $("#ModalTitle").text(),
        desc: $("#ModalDesc").text(), 
        price: parseFloat($("#ModalPrice").text().replace("$","")),
        imgSrc: $("#ModalImg").attr("src"),
        size: normalizeSize($("#ModalSize").val()),
        color: $(".ProductModal").attr("data-color"),
        fit: $(".ProductModal").attr("data-fit"),
        fabric: $(".ProductModal").attr("data-fabric"),
        thickness: $(".ProductModal").attr("data-thickness"),
        category: $(".ProductModal").attr("data-category"),
        quantity: parseInt($(".ProductModal").attr("data-quantity"))
    };

    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "../Products-Detailss/Products.html";
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

$(".CloseProduct").click(function () {
    $(".ProductModal").removeClass("active");
    $("#Overlay").removeClass("active");
});

$("#Overlay").click(function () {
    $(".ProductModal").removeClass("active");
    $("#Overlay").removeClass("active");
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
  let card = $(this).closest(".ListingCard");
  let title = card.find(".ListingTitle").text();
  let size = card.attr("data-size") || "Default";
  let color = card.attr("data-color") || "Default";
  let product = products.find(p => p.name === title);
  if (!product) return;
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
});$("#AddToCartModal").click(function() {

  if(isAdmin || !isLoggedIn){
    return;
  }
    let title = $("#ModalTitle").text();
    let size = normalizeSize($("#ModalSize").val());
    let qty = parseInt($("#QtyValue").text());
    let imgSrc = $("#ModalImg").attr("src");

    let product = products.find(p => p.name === title);
    if (!product) return;

    if (qty > product.quantity) {
        alert("Not enough stock available!");
        return;
    }

    let productsListing = document.querySelector(".ProductsListing");
    let existingCards = productsListing.querySelectorAll(".ListingCard");
    let found = false;

    existingCards.forEach(card => {
        let existingTitle = card.querySelector(".ListingTitle").textContent;
        let existingSize = card.querySelector(".ListingSize").textContent.replace("Size: ", "");

        if (existingTitle === title && existingSize === size) {
            let qtySpan = card.querySelector(".NumberOfProducts");
            let currentQty = parseInt(qtySpan.textContent);

            if (currentQty + qty > product.quantity) {
                alert("Not enough stock available!");
                found = true;
                return;
            }

            qtySpan.textContent = currentQty + qty;
            found = true;
        }
    });

    if (!found) {
        let newCard = document.createElement("div");
        newCard.classList.add("ListingCard");

        newCard.innerHTML = `
          <div class="ListingImg">
            <img src="${imgSrc}" alt="${title}">
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
          <div class="ListingPrice">$${product.price.toFixed(2)}</div>
        `;

        productsListing.appendChild(newCard);
    }

    updateCartState();
    saveCartToLocalStorage();

    $(".ProductModal").removeClass("active");
    Overlay.classList.remove("active");
    CartSideBar.classList.add("open");
});


function loadSizeFilter() {
    let sizeSelect = $("#selectsize");
    sizeSelect.empty();
    sizeSelect.append('<option value="Any" selected>Any Size</option>');
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
let CheckOutBtn = document.getElementById("CheckOutBtn");
CheckOutBtn.addEventListener("click", () => {
  if(isAdmin){
    return;
  }
  saveCartToLocalStorage();  
  window.location.href = "../checkout/cart.html"; 
});

$(document).ready(function () {
    loadCategoryButtons();
    loadCategoryProducts();
    loadColorFilter();
    loadSizeFilter();
    loadCartFromLocalStorage();
});

