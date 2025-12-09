$(function(){
  try {
  loadCartFromLocalStorage();
} catch (e) {
  console.warn("Cart load failed:", e);
}
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

if (!isLoggedIn) {
  $(".AddItemBtn").prop("disabled", true)
    .addClass("disabled-btn")
    .css({
      "opacity": "0.4",
      "cursor": "not-allowed",
      "pointer-events": "none"
    });

  $("#CheckOutBtn").prop("disabled", true)
    .css({
      "opacity": "0.4",
      "cursor": "not-allowed",
      "pointer-events": "none"
    });
}

function normalizeSize(size) {
    if (!size) return "M";
    let s = size.toLowerCase();
    if (s.includes("small")) return "S";
    if (s.includes("medium")) return "M";
    if (s.includes("large")) return "L";
    if (s.includes("x")) return "XL";
    return size.toUpperCase();
}


  let product = JSON.parse(localStorage.getItem("selectedProduct"));
  console.log("Selected Product : ", product);


  $("#ProductTitle").text(product.title);
  $("#ProductDesc").text(product.desc);
  $("#ProductPrice").text(`$${product.price.toFixed(2)}`);
  $("#ProductImg img").attr("src", product.imgSrc);
 
let sizeSelect = $("#ProductsizeSelect");
sizeSelect.empty(); 

let sizes = typeof product.size === "string" ? [product.size] : product.size;

if (sizes && sizes.length > 0) {
  sizes.forEach(s => {
    let format = formatSizeLabel(s);
    sizeSelect.append(`<option value="${s}">${format}</option>`);
  });
} else {
  sizeSelect.append('<option value="M">M</option>');
}

  
  $("#ProductFit").text(product.fit);
  $("#ProductFabric").text(product.fabric);
  $("#ProductThickness").text(product.thickness);
  $("#ProductColor").text(product.color);
  $("#ProductType").text(product.category);
  function formatSizeLabel(size){
     let s = size.toLowerCase();
  if (s.includes("small")) return "S";
  if (s.includes("medium")) return "M";
  if (s.includes("large")) return "L";
  if (s.includes("x-large")) return "XL";
  return size;
  }

 
  loadRecommendations(product.category, product.title);

function loadRecommendations(category,CurrentTitle){
  let products = JSON.parse(localStorage.getItem("products"))|| [];
  let recommendations = products.filter(p=> p.category === category && p.name !== CurrentTitle);
  recommendations = recommendations.sort(() => 0.5 - Math.random());
  recommendations = recommendations.slice(0, 5);
  let container = $(".RecommendationSection");
  container.empty();
  recommendations.forEach(p=>{
    let card = $(` 
      <div class="RecommendedCard"
       data-title="${p.name}"
       data-desc="${p.readmore}"
       data-price="${p.price}"
       data-img="${p.image}"
       data-fit="${p.selectfit}"
       data-thickness="${p.thickness}"
       data-fabric="${p.fabric}"
       data-disclaimer="Product color may slightly vary due to photographic lighting sources or your monitor settings."
       data-color="${p.color}"
       data-type="${p.category}">
    <div class="RecommendedImg">
      <img src="${p.image}" alt="${p.name}">
    </div>
    <div class="RecommendedContent">
      <div class="RecommendedProductName">
        <h3>${p.name}</h3>
      </div>
      <div class="RecommendedDescPrice">
        <p class="RecommendedDesc">${p.description}</p>
        <span class="RecommendedProductPrice">$${p.price.toFixed(2)}</span>
      </div>
    </div>
  </div>
      `);
      card.on('click',function(){
         let selected = {
          title: p.name,
          desc: p.readmore,
          price: p.price,
          imgSrc: p.image,
          size: p.size || "M",
          fit: p.selectfit,
          fabric: p.fabric,
          thickness: p.thickness,
          color: p.color,
          category: p.category
          };
       
      localStorage.setItem("selectedProduct", JSON.stringify(selected));
      window.location.href = "Products.html";
      })
      container.append(card);
  })
}
$(document).ready(function () {
  let $searchInput = $("#SearchInput");
  let $dropDown = $("#DropDown");

  $searchInput.on("input", function () {
    let typed = $(this).val().trim().toLowerCase();
    $dropDown.empty();

    if (!typed) {
      $dropDown.hide();
      return;
    }

    let products = JSON.parse(localStorage.getItem("products")) || [];

    let matches = products.filter(p =>
      (typeof p.name === "string" && p.name.toLowerCase().includes(typed)) ||
      (typeof p.category === "string" && p.category.toLowerCase().includes(typed)) ||
      (typeof p.color === "string" && p.color.toLowerCase().includes(typed))
    );

    if (matches.length === 0) {
      let $noResult = $("<div>")
        .addClass("dropdown-content no-results")
        .html(`
          <div class="dropdown-text">
            <p class="dropdown-title">No results found</p>
          </div>
        `);
      $dropDown.append($noResult).show();
      return;
    }

    matches.forEach(p => {
      let image = p.image || p.imgSrc;

      let results = $("<div>")
        .addClass("dropdown-content")
        .html(`
          <div class="ImgWrapSearch">
            <img src="${image}" alt="${p.name}" />
          </div>
          <div class="dropdown-text">
            <p class="dropdown-title">${p.name}</p>
            <p class="dropdown-desc">${p.description}</p>
          </div>
        `);

      results.on("click", function () {
        let selectee = {
          title: p.name || "Untitled",
          imgSrc: p.image || "",
          desc: p.readmore,
          price: p.price,
          category: p.category || "",
          color: p.color,
          fabric: p.fabric || "",
          fit: p.selectfit || "",
          thickness: p.thickness || ""
        };
         localStorage.setItem("selectedProduct", JSON.stringify(selectee));
         window.location.href = "Products.html";
        
      });

      $dropDown.append(results);
    });

    $dropDown.show();
  });

  $(document).on("click", function (e) {
    if (!$searchInput.is(e.target) && !$dropDown.is(e.target) && $dropDown.has(e.target).length === 0) {
      $dropDown.hide();
    }
  });
});


$("#Cart-Btn").on("click", function() {
  $("#CartSideBar").addClass("open");
  $("#Overlay").addClass("active");
});

$("#CloseBtn , #Overlay").on("click", function() {
  $("#CartSideBar").removeClass("open");
  $("#Overlay").removeClass("active");
});



$("#userLogo").on("click", function () {
    let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
        window.location.href = "../signup and login/SandL.html";
        return;
    }

    $("#ProfileSideBar").addClass("open");
    $("#Overlay").addClass("active");
});


$("#CloseProfileBtn,#Overlay").on("click", function() {
  $("#ProfileSideBar").removeClass("open");
  $("#Overlay").removeClass("active");
});
let qty = 1;
  $("#QtyPlus").on("click", function(){
     let product = JSON.parse(localStorage.getItem("selectedProduct"));
     let availabestock = parseInt(product.quantity);
     if(qty<availabestock){
      qty++;
      $("#QtyValue").text(qty);
     }
    
  });
  $("#QtyMinus").on("click", function(){
    if(qty > 1) qty--;
    $("#QtyValue").text(qty);
  });

function updateCartState() {
  let totalQty = 0;
  let subtotal = 0;

  $(".ListingCard").each(function () {
    let qty = parseInt($(this).find(".NumberOfProducts").text());
    let priceText = $(this).find(".ListingPrice").text();
    let price = parseFloat(priceText.replace("$", ""));
    totalQty += qty;
    subtotal += qty * price;
  });

  let currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    localStorage.setItem(`cartCount_${currentUser}`, totalQty.toString());
  }

  $("#CartCount").text(totalQty);
  $("#CartSubtotal").text(`$ ${subtotal.toFixed(2)}`);
}


  function saveCartToLocalStorage() {
  let cartArray = [];
  $(".ListingCard").each(function () {
    cartArray.push({
      name: $(this).find(".ListingTitle").text(),
      size: $(this).find(".ListingSize").text().replace("Size: ", ""),
      qty: parseInt($(this).find(".NumberOfProducts").text()),
      price: parseFloat($(this).find(".ListingPrice").text().replace("$", "")),
      image: $(this).find(".ListingImg img").attr("src")
    });
  });

  let currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    localStorage.setItem(`cart_${currentUser}`, JSON.stringify(cartArray));
  }
}

function loadCartFromLocalStorage() {
  let currentUser = localStorage.getItem("currentUser");
  let cartArray = currentUser ? JSON.parse(localStorage.getItem(`cart_${currentUser}`)) || [] : [];

  let productsListing = $(".ProductsListing");
  productsListing.empty();

  cartArray.forEach(item => {
    let newCard = $(`
      <div class="ListingCard">
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
        <div class="ListingPrice">$ ${item.price.toFixed(2)}</div>
      </div>
    `);
    productsListing.append(newCard);
  });

  updateCartState();
}


$(".AddItemBtn").on("click", function () {
 
  let title = $("#ProductTitle").text();
  let priceText = $("#ProductPrice").text();
  let price = parseFloat(priceText.replace("$", ""));
  let imgSrc = $(".ImgSide img").attr("src");
  let size = $("#ProductsizeSelect").val();
  let qty = parseInt($("#QtyValue").text());

  let productsListing = $(".ProductsListing"); 
  let existingCards = productsListing.find(".ListingCard");

  let found = false;

  existingCards.each(function () {
    let existingTitle = $(this).find(".ListingTitle").text();
    let existingSize = $(this).find(".ListingSize").text().replace("Size: ", "").trim();
    if (existingTitle === title && existingSize === size) {
      let qtySpan = $(this).find(".NumberOfProducts");
      qtySpan.text(parseInt(qtySpan.text()) + qty);
      found = true;
    }
  });

  if (!found) {
    let newCard = $(`
      <div class="ListingCard">
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
        <div class="ListingPrice">$ ${price.toFixed(2)}</div>
      </div>
    `);
    productsListing.append(newCard);
  }

  updateCartState();
  saveCartToLocalStorage();

  $("#CartSideBar").addClass("open");
  $("#Overlay").addClass("active");
});

$(".ProductsListing").on("click", ".minus", function(){
  let qtySpan = $(this).siblings(".NumberOfProducts");
  let current = parseInt(qtySpan.text());
  if(current > 1){
    qtySpan.text(current - 1);
  };
  updateCartState();
  saveCartToLocalStorage();
});

$(".ProductsListing").on("click", ".plus", function(){
  let qtySpan = $(this).siblings(".NumberOfProducts");
  let current = parseInt(qtySpan.text());
   let card = $(this).closest(".ListingCard");
  let title = card.find(".ListingTitle").text().trim();
   let products = JSON.parse(localStorage.getItem("products")) || [];
  let product = products.find(p =>
    p.name.trim() === title)
    let availableStock = parseInt(product.quantity)
   if (current < availableStock) {
    qtySpan.text(current + 1);
    updateCartState();
    saveCartToLocalStorage();
  }
});

$(".ProductsListing").on("click", ".RemoveProduct", function(){
  $(this).closest(".ListingCard").remove();
  updateCartState();
  saveCartToLocalStorage();
});

let backToTopBtn = document.querySelector(".BackToTopBtn");
backToTopBtn.addEventListener("click", () => { 
    window.scrollTo({ top: 0, behavior: "smooth" 

    }); 
});

document.getElementById("AboutUsNav").addEventListener("click", function(e) {
  e.preventDefault(); 
  document.getElementById("About").scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById("ContactUsNav").addEventListener("click", function(e) {
  e.preventDefault();
  document.getElementById("Contact").scrollIntoView({
    behavior: "smooth"
  });
});

$(".RecommendationSection").on('click','.RecommendedCard',function(){
    let Title = $(this).data('title');
    let desc = $(this).data("desc");
    let price = $(this).data("price");
    let img = $(this).data("img");
    let fit = $(this).data("fit");
    let thickness = $(this).data("thickness");
    let fabric = $(this).data("fabric");
    let disclaimer = $(this).data("disclaimer");
    let color = $(this).data("color");
    let type = $(this).data("type");

    $(".ImgSide img").attr("src",img);
    $("#ProductTitle").text(Title);
    $("#ProductDesc").html(desc); 
    $("#ProductPrice").text("$ "+parseFloat(price).toFixed(2));

    $(".DetailTable").html(`
         <tr>
         <th>Fit</th>
         <td>${fit}</td>
         </tr>
         <tr>
        <th>Thickness</th>
        <td>${thickness}</td>
        </tr>
        <tr>
        <th>Fabric</th>
        <td>${fabric}</td>
        </tr>
        <tr>
        <th>Disclaimer</th>
        <td>${disclaimer}</td>
        </tr>
        <tr>
        <th>Color Family</th>
        <td>${color}</td>
        </tr>
        <tr>
        <th>Sportswear Type</th>
        <td>${type}</td>
        </tr>`)
})

document.getElementById("CheckOutBtn").addEventListener("click", () => {
    window.location.href = "../checkout/cart.html";
});


$("#CloseProfileBtn").on("click", function() {
    $("#ProfileSideBar").removeClass("open");
    $("#Overlay").removeClass("active");
});

$("#Overlay").on("click", function() {
    $("#ProfileSideBar").removeClass("open");
    $("#Overlay").removeClass("active");
});

$(".ProfileBtn:eq(0)").on("click", function () {
    window.location.href = "../profile/orders/account/account.html";
});




$("#OrdersBtn").on("click", function () {
    window.location.href = "../profile/orders/orders.html";
});

let isAdmin = localStorage.getItem("isAdmin") === "true";

if (isAdmin) {
    console.log("Admin mode active — Storefront disabled.");

    $("#LoginBtn").hide();

    $(".AddItemBtn")
        .prop("disabled", true)
        .css({
            "opacity": "0.4",
            "cursor": "not-allowed"
        })
        .off("click")
        .on("click", function(e){
            e.preventDefault();
            alert("Admins cannot buy products.");
        });

    $("#Cart-Btn")
        .off("click")
        .css("cursor", "not-allowed")
        .on("click", function(e){
            e.preventDefault();
            alert("Admin cannot access cart.");
        });

  
    $("#CloseBtn, #Overlay").off("click");

   
    $("#CheckOutBtn")
        .off("click")
        .css("cursor", "not-allowed")
        .on("click", function(e){
            e.preventDefault();
            alert("Admin cannot checkout.");
        });

    
    $("#OrdersBtn").hide();
}

});
