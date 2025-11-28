$(function(){
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