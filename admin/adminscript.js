let name=$('#name');
let sku=$('#sku');
let price=$('#price');
let quantity=$('#quantity');
let description=$('#description');
let readmore=$('#readmore');
let addcategorr=$('.addbtn-category');//button
let category=$('#addcategory');//input
let categoryy = $('#selectcategory');//categoryy select
let status = $('#Status');
let adminfiltercategory=$('#adminfiltercategory');
let filterStatus=$('#filterStatus');
let currentpage=1;
let rowpage=5;

let categories = JSON.parse(localStorage.getItem('categories')) || ['Hoodies', 'T-Shirts'];

// Function to load categories into both selects
function loadCategories() {
    let select = $('#selectcategory');
    let filterSelect = $('#adminfiltercategory');

    select.empty();
    filterSelect.empty();
    select.append('<option value="" disabled selected hidden>Select a category...</option>');
    filterSelect.append('<option value="All" selected>All</option>');

    categories.forEach(cat => {
        select.append(`<option value="${cat}">${cat}</option>`);
        filterSelect.append(`<option value="${cat}">${cat}</option>`);
    });

    filterSelect.empty();
    filterSelect.append('<option value="All" selected>All</option>');

    categories.forEach(cat => {
        let option1 = $('<option></option>').text(cat).val(cat);
        let option2 = $('<option></option>').text(cat).val(cat);

        select.append(option1);          // product add section
        filterSelect.append(option2);    // filter section
    });
}
loadCategories();


addcategorr.on('click',function(e){
    e.preventDefault();
    let value=category.val().trim();
    if(value==='')return;
    if(categories.includes(value)){
        alert('Category already exists!');
        return;
    }
    let newoption=$('<option></option>').text(value).val(value);
    $('#selectcategory').append(newoption);

    categories.push(value);
    localStorage.setItem('categories',JSON.stringify(categories));
    loadCategories();       
    category.val('');

});


let products=JSON.parse(localStorage.getItem('products')) || [];

function loadProducts(adminfiltercategory = 'All', filterStatus = 'All') {
    let filtered = products.filter(product => {
        let cat = product.category || '';
        let status = product.status || '';

        return (adminfiltercategory === 'All' || cat === adminfiltercategory) &&
               (filterStatus === 'All' || status === filterStatus);
    });

    let start = (currentpage - 1) * rowpage;
    let end = start + rowpage;
    let paginated = filtered.slice(start, end);

    $('#product-table-body').empty();

    paginated.forEach((product, index) => {
        let row = $('<tr></tr>');
        row.append(`<td>${start + index + 1}</td>`);
        row.append(`<td>${product.name}</td>`);
        row.append(`<td>${product.category}</td>`);
        row.append(`<td>${product.price.toFixed(2)}</td>`);
        row.append(`<td>${product.quantity}</td>`);
        row.append(`<td>${product.status}</td>`);
        $('#product-table-body').append(row);
    });


    renderPagination(filtered.length);
}
function renderPagination(totalItems) {
    let totalPages = Math.ceil(totalItems / rowpage);

    $('#pagination').empty();


    let prevBtn = $('<button>Prev</button>');
    if (currentpage === 1) prevBtn.prop('disabled', true);
    prevBtn.click(() => {
        if (currentpage > 1) {
            currentpage--;
            loadProducts($('#adminfiltercategory').val(), $('#filterStatus').val());
        }
    });
    $('#pagination').append(prevBtn);


    for (let i = 1; i <= totalPages; i++) {
        let pageBtn = $(`<button>${i}</button>`);
        if (i === currentpage) pageBtn.css('font-weight', 'bold');

        pageBtn.click(() => {
            currentpage = i;
            loadProducts($('#adminfiltercategory').val(), $('#filterStatus').val());
        });

        $('#pagination').append(pageBtn);
    }


    let nextBtn = $('<button>Next</button>');
    if (currentpage === totalPages) nextBtn.prop('disabled', true);
    nextBtn.click(() => {
        if (currentpage < totalPages) {
            currentpage++;
            loadProducts($('#adminfiltercategory').val(), $('#filterStatus').val());
        }
    });
    $('#pagination').append(nextBtn);
}

loadProducts();
adminfiltercategory.on('change', function() {
    loadProducts(adminfiltercategory.val(), filterStatus.val());
});
filterStatus.on('change', function() {
    loadProducts(adminfiltercategory.val(), filterStatus.val());
});

$('#addbtn').on('click',function(e){
    e.preventDefault();
    if(name.val().trim()==='' || price.val().trim()==='' || quantity.val().trim()==='' || $('#selectcategory').val()===null || $('#Status').val()===null){
        alert('Please fill all required fields!');
        return;
    }
     let index = $('#product-table-body tr').length + 1;
    let tabledata=$('<tr></tr>');
    tabledata.append($('<td></td>').text(index));
    tabledata.append($('<td></td>').text(name.val().trim()));
    tabledata.append($('<td></td>').text($('#selectcategory').val()));
    tabledata.append($('<td></td>').text(parseFloat(price.val().trim()).toFixed(2)));
    tabledata.append($('<td></td>').text(parseInt(quantity.val().trim())));
    tabledata.append($('<td></td>').text($('#Status').val()));
    $('#product-table-body').append(tabledata);
     let newProduct = {
        id: index,
        name: name.val().trim(),
        category: categoryy.val(),
        price: parseFloat(price.val().trim()),
        quantity: parseInt(quantity.val().trim()),
        status: Status.val(),
        size:$('#selectsize').val(),
        description: description.val().trim() || '',
        readmore: readmore.val().trim() || '',
        impage: preview.src || ''


    };

    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));//into json
    name.val('');
    sku.val('');
    price.val('');
    quantity.val('');
    description.val('');
    readmore.val('');
    categoryy.prop('selectedIndex', 0);
   $('#Status').prop('selectedIndex', 0);
   loadProducts(adminfiltercategory.val(), filterStatus.val());
});
$('.delete').on('click', function() {
    let numberToRemove = prompt('Enter the number of the product to remove:');
    if(!numberToRemove) return;

    let index = parseInt(numberToRemove) - 1;  // convert table number to array index
    if(index < 0 || index >= products.length) {
        alert('Invalid number!');
        return;
    }

    // Remove the product from the array
    products.splice(index, 1);

    localStorage.setItem('products', JSON.stringify(products));

    loadProducts(adminfiltercategory.val(), filterStatus.val());
});
$('.btnupdate').on('click', function() {
    let numberToUpdate = prompt('Enter the number of the product to update:');
    if(!numberToUpdate) return;

    let index = parseInt(numberToUpdate) - 1;
    if(index < 0 || index >= products.length) {
        alert('Invalid number!');
        return;
    }
    let product=products[index];
    let newName = prompt('Enter new name:', product.name);
    let newCategory = prompt('Enter new category:', product.category);
    let newPrice = prompt('Enter new price:', product.price);
    let newQuantity = prompt('Enter new quantity:', product.quantity);
    let newStatus = prompt('Enter new status', product.status);
    if(newName) product.name = newName;
    if(newCategory) product.category = newCategory;
    if(newPrice) product.price = parseFloat(newPrice);
    if(newQuantity) product.quantity = parseInt(newQuantity);
    if(newStatus) product.status = newStatus;
    localStorage.setItem('products', JSON.stringify(products));
    loadProducts(adminfiltercategory.val(), filterStatus.val());
});
let container = document.getElementById("image-upload-container");
let input = document.getElementById("image-upload-input");
let preview = document.getElementById("preview-image");

// Click container to open file picker
container.addEventListener("click", () => input.click());

// Handle file selection
input.addEventListener("change", () => {
    let file = input.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

// Drag & Drop
container.addEventListener("dragover", e => {
    e.preventDefault();
    container.classList.add("dragover");
});

container.addEventListener("dragleave", e => {
    e.preventDefault();
    container.classList.remove("dragover");
});

container.addEventListener("drop", e => {
    e.preventDefault();
    container.classList.remove("dragover");
    let file = e.dataTransfer.files[0];
    if (file) {
        input.files = e.dataTransfer.files; // update input so form can submit
        let reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});