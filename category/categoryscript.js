
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


$(document).ready(function () {
    loadCategoryButtons();
    loadCategoryProducts();
});


