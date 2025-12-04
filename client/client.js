document.addEventListener("DOMContentLoaded", () => {
  RenderProducts();
  loadCartFromLocalStorage();
  updateCartState();
  if(localStorage.getItem("isAdmin")==="true"){ 
    let arrowDiv = document.createElement("div");
    arrowDiv.classList.add("ArrowRight");
    let arrowImg = document.createElement("img");
    arrowImg.src = "client/iconArrow.png"; 
    arrowImg.alt = "Back To Admin";

    arrowImg.addEventListener("click", () => {
      window.location.href = "admin/admin.html"; 
    });

    
    arrowDiv.appendChild(arrowImg);
    document.body.appendChild(arrowDiv);
 }
 
 let isAdmin = localStorage.getItem("isAdmin") === "true";

if (isAdmin) {
    console.log("Admin mode active — shopping disabled.");
   
    let ordersBtn = document.getElementById("OrdersBtn");
    if (ordersBtn) {
        ordersBtn.style.display = "none";  
    }

    let cartBtn = document.getElementById("Cart-Btn");
    if (cartBtn) {
        cartBtn.onclick = function(e){
    e.preventDefault();
    alert("Admins cannot access the cart.");

    if (CartSideBar) CartSideBar.classList.remove("open");
    if (Overlay) Overlay.classList.remove("active");

    return false;
};

    }
    let checkoutBtn = document.getElementById("CheckOutBtn");
    if (checkoutBtn) {
        checkoutBtn.onclick = function(e){
            e.preventDefault();
            alert("Admins cannot checkout.");
            return false;
        };
    }
    let addBtns = document.querySelectorAll(".AddItemBtn");
    addBtns.forEach(function(btn){
        btn.onclick = function(e){
            e.preventDefault();
            alert("Admins cannot add products to cart.");
            return false;
        };
        btn.disabled = true;
        btn.style.opacity = "0.4";
        btn.style.cursor = "not-allowed";
    });
    let qtyBtns = document.querySelectorAll(".PlusMinusBtn");
    qtyBtns.forEach(function(btn){
        btn.onclick = function(e){
            e.preventDefault();
            return false;
        };
        btn.style.opacity = "0.3";
    });
    localStorage.removeItem("cart");
    document.getElementById("CartCount").innerText = "0";
}

});

let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
let cartCount = parseInt(localStorage.getItem("cartCount") || "0");

let cartCountSpan = document.getElementById("CartCount");
let loginBtn = document.getElementById("LoginBtn");
let CartBtn = document.getElementById("Cart-Btn");
let CartSideBar = document.getElementById("CartSideBar");
let Overlay = document.getElementById("Overlay");
let CloseBtn = document.getElementById("CloseBtn");
let ProfileSideBar = document.getElementById("ProfileSideBar");
let CloseProfileBtn = document.getElementById("CloseProfileBtn");
let userLogo = document.getElementById("userLogo");
let btnsInArrivlas = document.getElementById("BtnsInNewArrivals");
btnsInArrivlas.addEventListener('click',function(){
  window.location.href="category/category.html";
})

function saveCartToLocalStorage() {
  let cartArray = [];

  document.querySelectorAll(".ListingCard").forEach(card => {
    cartArray.push({
      name: card.querySelector(".ListingTitle").textContent,
      qty: parseInt(card.querySelector(".NumberOfProducts").textContent),
      price: parseFloat(card.querySelector(".ListingPrice").textContent.replace("$","")),
      image: card.querySelector(".ListingImg img").src,
      size: card.querySelector(".ListingSize").textContent.replace("Size: ", "")
    });
  });

  localStorage.setItem("cart", JSON.stringify(cartArray));
}
function loadCartFromLocalStorage(){
  let cartArray = JSON.parse(localStorage.getItem("cart"))||[];
  let productsListing = document.querySelector(".ProductsListing")
  productsListing.innerHTML="";
  cartArray.forEach(item=>{
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
      <div class="ListingPrice">$ ${item.price.toFixed(2)}</div>
    `;

    productsListing.appendChild(newCard);
  });

  updateCartState();
}
  

let CheckOutBtn = document.getElementById("CheckOutBtn");

CheckOutBtn.addEventListener("click", () => {
  saveCartToLocalStorage();  

  window.location.href = "checkout/cart.html"; 
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

function updateCartUI(cartCount) {
    if (cartCountSpan) {
        cartCountSpan.textContent = cartCount;
    }
}

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
        window.location.href = "signup and login/SandL.html";
    }
});
function formatSizeLabel(size){
   let s = size.toLowerCase();
  if (s.includes("small")) return "S";
  if (s.includes("medium")) return "M";
  if (s.includes("large")) return "L";
  if (s.includes("x-large")) return "XL";
  return size;
}

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
      card.setAttribute("data-shortDesc",p.description);
      card.setAttribute("data-quantity",p.quantity);
      card.innerHTML=
      `<div class="ProductImg">
        <img src="${p.image}" alt="${p.name} ${p.category}">
      </div>
      <div class="ProductContent">
        <div class="Title">${p.name}</div>
        <div class="ReadMore">${p.description}</div>
        <div class="SizeWrap">
          <label for="sizeSelect">Size:</label>
          <select class="sizeSelect"></select>
        </div>
        <div class="row">
          <span class="price">$${p.price.toFixed(2)}</span>
          <div class="RowBtns">
            <button class="ReadMoreBtn">Read More</button>
            <button class="AddItemBtn">Add To Cart</button>
          </div>
        </div>
      </div>`;
       let sizeSelect = card.querySelector(".sizeSelect");
    sizeSelect.innerHTML = ""; 

let sizes = typeof p.size === "string" ? [p.size] : p.size;

if (sizes && sizes.length > 0) {
  sizes.forEach(s => {
    let option = document.createElement("option");
    option.value = s;
    option.textContent = formatSizeLabel(s);
    sizeSelect.appendChild(option);
  });
} else {
  let option = document.createElement("option");
  option.value = "M";
  option.textContent = "M";
  sizeSelect.appendChild(option);
}
      container.appendChild(card);

     });
     attachCardListeners();
}


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
  updateCartUI(cartCount);

  let subtotalSpan = document.getElementById("CartSubtotal");
  if (subtotalSpan) {
    subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
  }
}
let ProductModal = document.querySelector(".ProductModal");
let CloseProductBtn = document.querySelector(".CloseProduct");

CloseProductBtn.addEventListener("click", () => {
  ProductModal.classList.remove("active");
  Overlay.classList.remove("active");
});

Overlay.addEventListener("click", () => {
  ProductModal.classList.remove("active");
  Overlay.classList.remove("active");
});

function attachCardListeners() {
document.querySelectorAll(".Card .ProductImg img").forEach(img =>{
  img.addEventListener('click',(e)=>{
    let card = e.target.closest(".Card")
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
      category: card.getAttribute("data-category"), 
      quantity: parseInt(card.getAttribute("data-quantity"))


    }
    goToProductPage(product);
  });
});
  
  document.querySelectorAll(".ReadMoreBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      let card = btn.closest(".Card");
      let title = card.querySelector(".Title").textContent;
      let desc = card.getAttribute("data-longDesc");
      let price = card.querySelector(".price").textContent;
      let size = card.querySelector(".sizeSelect").value;
      let imgSrc = card.querySelector(".ProductImg img").src;
      let quantity = parseInt(card.getAttribute("data-quantity"));

      document.getElementById("ModalTitle").textContent = title;
      document.getElementById("ModalDesc").textContent = desc;
      document.getElementById("ModalPrice").textContent = price;
      document.getElementById("ModalImg").src = imgSrc;
      document.getElementById("QtyValue").textContent = "1";

      ProductModal.setAttribute("data-fit",card.dataset.fit);
      ProductModal.setAttribute("data-fabric",card.dataset.fabric);
      ProductModal.setAttribute("data-thickness",card.dataset.thickness);
      ProductModal.setAttribute("data-color",card.dataset.color);
      ProductModal.setAttribute("data-category",card.dataset.category);
      ProductModal.setAttribute("data-shortDesc",card.dataset.shortDesc);
      ProductModal.setAttribute("data-longDesc",desc);
      ProductModal.setAttribute("data-quantity",quantity);

      let modalSizeSelect = document.getElementById("ModalsizeSelect");
    modalSizeSelect.innerHTML = "";

    let cardSizes = card.querySelectorAll(".sizeSelect option");
    cardSizes.forEach(opt => {
      let option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.textContent;
      modalSizeSelect.appendChild(option);
    });

    modalSizeSelect.value = size;
      


      ProductModal.classList.add("active");
      Overlay.classList.add("active");
    });
  });

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
      let availabestock = parseInt(card.getAttribute("data-quantity"));
      let qty = 1;

      let productsListing = document.querySelector(".ProductsListing");
      let existingCards = productsListing.querySelectorAll(".ListingCard");

      let found = false;
      let block = false;
      existingCards.forEach(listCard => {
        let existingTitle = listCard.querySelector(".ListingTitle").textContent;
        let existingSize = listCard.querySelector(".ListingSize").textContent.replace("Size: ", "");
        if (existingTitle === title && existingSize === size) {
          let qtySpan = listCard.querySelector(".NumberOfProducts");
          let currentqty = parseInt(qtySpan.textContent);
          if(currentqty+qty>availabestock){
             alert("Not enough stock available!");
             block=true;
          return;
          }
          qtySpan.textContent = currentqty + qty;
          found = true;
        }
      });

      if(block)
        return;
      if (!found) {
        if (qty > availabestock) {
        alert("Not enough stock available!");
        return;
      }
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
      saveCartToLocalStorage();
      document.getElementById("CartSideBar").classList.add("open");
      document.getElementById("Overlay").classList.add("active");
    });
  });
}

let qtyValue =  document.getElementById("QtyValue");
let Modalplus = document.getElementById("QtyPlus");
let Modalminus = document.getElementById("QtyMinus");
Modalplus.addEventListener('click',()=>{
  let current = parseInt(qtyValue.textContent);
  let availabestock = parseInt(ProductModal.getAttribute("data-quantity"));
  if(availabestock>current){
    qtyValue.textContent = current + 1;
  }
    
});

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
  let availabestock = parseInt(ProductModal.getAttribute("data-quantity"));
  let productsListing = document.querySelector(".ProductsListing");
  let existingCards = productsListing.querySelectorAll(".ListingCard");
  let found = false;
  let block = false;
  if(product.qty>availabestock){
     alert("Not enough stock available!");
    return; 
  }

  existingCards.forEach(card => {
    let existingTitle = card.querySelector(".ListingTitle").textContent;
    let existingSize = card.querySelector(".ListingSize").textContent.replace("Size:","").trim();
    if (existingTitle === product.title && existingSize === product.size) {
      let qtySpan = card.querySelector(".NumberOfProducts");
      let currentqty = parseInt(qtySpan.textContent);
      if(currentqty+product.qty>availabestock){
         alert("Not enough stock available!");
         found=true;
         return;
      }
      qtySpan.textContent = currentqty + product.qty;
      found = true;
    }
  });
  if(!found){
    if(product.qty>availabestock){
      alert(" Not enough stock available!");
      return;

    }
  }

  if (!found) {
    let newCard = document.createElement("div");
    newCard.classList.add("ListingCard");
    newCard.innerHTML = `
      <div class="ListingImg">
        <img src="${product.imgSrc}" alt="${product.title}" />
      </div>
      <div class="ListingContent">
        <h3 class="ListingTitle">${product.title}</h3>
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
  saveCartToLocalStorage();

  document.querySelector(".ProductModal").classList.remove("active");
  document.getElementById("Overlay").classList.remove("active");
});

function goToProductPage(product){
  localStorage.setItem("selectedProduct",JSON.stringify(product));
  window.location.href = "Products-Detailss/Products.html";
} 

document.querySelector(".ProductDetailsLink").addEventListener('click',(e)=>{
  e.preventDefault();
  let product = {
  title: document.getElementById("ModalTitle").textContent,
  desc: ProductModal.getAttribute("data-longDesc"), 
  price: parseFloat(document.getElementById("ModalPrice").textContent.replace("$","")),
  size: document.getElementById("ModalsizeSelect").value,
  imgSrc: document.getElementById("ModalImg").src,
  fit: ProductModal.getAttribute("data-fit"),
  fabric: ProductModal.getAttribute("data-fabric"),
  thickness: ProductModal.getAttribute("data-thickness"),
  color: ProductModal.getAttribute("data-color"),
  category: ProductModal.getAttribute("data-category"),
  quantity:ProductModal.getAttribute("data-quantity")
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

CloseProfileBtn.addEventListener("click", () => {
    ProfileSideBar.classList.remove("open");
    Overlay.classList.remove("active");
});

Overlay.addEventListener("click", () => {
    ProfileSideBar.classList.remove("open");
});
let SearchInput = document.getElementById("SearchInput");
let DropDown = document.getElementById("DropDown");

SearchInput.addEventListener('input',function(){
  let typed = this.value.trim().toLowerCase();
  DropDown.innerHTML="";
  if(!typed){
    DropDown.style.display="none";
    return;
  }
let products = JSON.parse(localStorage.getItem("products"))||[];
let matches = products.filter(p=>
   typeof p.name === "string" && p.name.toLowerCase().includes(typed) ||
  typeof p.category === "string" && p.category.toLowerCase().includes(typed) ||
  typeof p.color === "string" && p.color.toLowerCase().includes(typed)
)

  if (matches.length === 0) { let noResult = document.createElement("div");
    noResult.classList.add("dropdown-content","no-results");
    noResult.innerHTML =`
      <div class="dropdown-text">
       <p class="dropdown-title">No results found</p>
       </div>`;
    DropDown.appendChild(noResult);
    DropDown.style.display = "block";
    return;
  }
   matches.forEach(p => {
    let result = document.createElement("div");
    result.classList.add("dropdown-content");
    let image = p.image;
    result.innerHTML = `
    <div class="ImgWrapSearch">
      <img src="${image}" alt="${p.name}" />
      </div>
      <div class="dropdown-text">
        <p class="dropdown-title">${p.name}</p>
        <p class="dropdown-desc">${p.description}</p>
      </div>
    `;
     result.addEventListener("click", () => {
       let selectee = {
    title: p.name || "Untitled",
    imgSrc: p.image|| "",
    desc: p.readmore,
    price: p.price  ,
    category: p.category ,
    color: p.color|| "",
    fabric: p.fabric ,
    fit: p.selectfit ||"",
    thickness: p.thickness || "",
    quantity:parseInt(p.quantity)
  };

  goToProductPage(selectee);
    });

    DropDown.appendChild(result);
  
});
DropDown.style.display = "block";
})
document.addEventListener("click", function (e) {
  if (!SearchInput.contains(e.target) && !DropDown.contains(e.target)) {
    DropDown.style.display = "none";
  }
});


$(document).ready(function () {
    $("#OrdersBtn").click(function () {
        window.location.href = "../profile/orders/orders.html";
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
console.log("Attaching sidebar plus handler...");
$(".ProductsListing").on("click", ".plus", function(){
  let qtySpan = $(this).siblings(".NumberOfProducts");
  let current = parseInt(qtySpan.text());
  let card = $(this).closest(".ListingCard");
  let title = card.find(".ListingTitle").text();
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let product = products.find(p => p.name === title );
  let availabestock = parseInt(product.quantity);
  if(current<availabestock){
    qtySpan.text(current + 1);
     updateCartState();
  saveCartToLocalStorage();
  }
  else{
    return;
  }
  
  
});

$(".ProductsListing").on("click", ".RemoveProduct", function(){
  $(this).closest(".ListingCard").remove();
  updateCartState();
  saveCartToLocalStorage();

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


});
$("#AccountInfoBtn").click(function () {
    window.location.href = "profile/orders/account/account.html"; 
});

