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

function loadProducts(adminfiltercategory = 'All', filterStatus = 'All'){
    $('#product-table-body').empty();
    products.forEach((product, index) => {
        let prodCat = product.category || '';
        let prodStatus = product.Status || '';
        if((adminfiltercategory === 'All' || prodCat === adminfiltercategory) &&
           (filterStatus === 'All' || prodStatus === filterStatus)) {
        let tabledata = $('<tr></tr>');
        tabledata.append($('<td></td>').text(index + 1));
        tabledata.append($('<td></td>').text(product.name));
        tabledata.append($('<td></td>').text(product.category));
        tabledata.append($('<td></td>').text(product.price.toFixed(2)));
        tabledata.append($('<td></td>').text(product.quantity));
        tabledata.append($('<td></td>').text(product.status));
        $('#product-table-body').append(tabledata);
        }
    })
};
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
        status: status.val()
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

    // Update localStorage
    localStorage.setItem('products', JSON.stringify(products));

    // Reload table with current filters
    loadProducts(adminfiltercategory.val(), filterStatus.val());
});
