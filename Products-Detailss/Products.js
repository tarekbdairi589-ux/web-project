$(function(){
  try {
  loadCartFromLocalStorage();
} catch (e) {
  console.warn("Cart load failed:", e);
}

  let product = JSON.parse(localStorage.getItem("selectedProduct"));
  console.log("Selected Product : ", product);

  // Basic details
  $("#ProductTitle").text(product.title);
  $("#ProductDesc").text(product.desc);
  $("#ProductPrice").text(`$${product.price.toFixed(2)}`);
  $("#ProductImg img").attr("src", product.imgSrc);
  $("#ProductSize").text(`Size: ${product.size}`);

  // Table details
  $("#ProductFit").text(product.fit);
  $("#ProductFabric").text(product.fabric);
  $("#ProductThickness").text(product.thickness);
  $("#ProductColor").text(product.color);
  $("#ProductType").text(product.category);

  // Recommendations
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
       data-desc="${p.description}"
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
          desc: p.description,
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
      window.location.href = "../Products-Detailss/Products.html";
      })
      container.append(card);
  })
}


$("#Cart-Btn").on("click", function() {
  $("#CartSideBar").addClass("open");
  $("#Overlay").addClass("active");
});

$("#CloseBtn , #Overlay").on("click", function() {
  $("#CartSideBar").removeClass("open");
  $("#Overlay").removeClass("active");
});



$("#userLogo").on("click", function() {
  $("#ProfileSideBar").addClass("open");
  $("#Overlay").addClass("active");
  // Load previous orders from localStorage or API
});

$("#CloseProfileBtn,#Overlay").on("click", function() {
  $("#ProfileSideBar").removeClass("open");
  $("#Overlay").removeClass("active");
});
let qty = 1;
  $("#QtyPlus").on("click", function(){
    qty++;
    $("#QtyValue").text(qty);
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
  localStorage.setItem("cart", JSON.stringify(cartArray));
}

function loadCartFromLocalStorage() {
  let cartArray = JSON.parse(localStorage.getItem("cart")) || [];
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
  // Get product details
  let title = $("#ProductTitle").text();
  let priceText = $("#ProductPrice").text();
  let price = parseFloat(priceText.replace("$", ""));
  let imgSrc = $(".ImgSide img").attr("src");
  let size = $("#ProductsizeSelect").val();
  let qty = parseInt($("#QtyValue").text());

  let productsListing = $(".ProductsListing"); // your cart sidebar container
  let existingCards = productsListing.find(".ListingCard");

  let found = false;

  // Check if product already exists in cart
  existingCards.each(function () {
    let existingTitle = $(this).find(".ListingTitle").text();
    let existingSize = $(this).find(".ListingSize").text();
    if (existingTitle === title && existingSize === size) {
      let qtySpan = $(this).find(".NumberOfProducts");
      qtySpan.text(parseInt(qtySpan.text()) + qty);
      found = true;
    }
  });

  // If not found, create new card
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

  // Update cart count and subtotal
  updateCartState();
  saveCartToLocalStorage();

  // Open cart sidebar
  $("#CartSideBar").addClass("open");
  $("#Overlay").addClass("active");
});

// Minus button inside cart sidebar
$(".ProductsListing").on("click", ".minus", function(){
  let qtySpan = $(this).siblings(".NumberOfProducts");
  let current = parseInt(qtySpan.text());
  if(current > 1){
    qtySpan.text(current - 1);
  };
  updateCartState();
  saveCartToLocalStorage();
});

// Plus button inside cart sidebar
$(".ProductsListing").on("click", ".plus", function(){
  let qtySpan = $(this).siblings(".NumberOfProducts");
  let current = parseInt(qtySpan.text());
  qtySpan.text(current + 1);
  updateCartState();
  saveCartToLocalStorage();
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
    $("#ProductDesc").html(desc); // use html() for <br> support
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







});