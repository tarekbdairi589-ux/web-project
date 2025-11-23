let cart = JSON.parse(localStorage.getItem("cart")) || [];

$(document).ready(function () {
    loadSummary();

    $("#ConfirmOrder").click(function () {

    if ($("#FullName").val().trim() === "" ||
        $("#Phone").val().trim() === "" ||
        $("#Address").val().trim() === "") {
        alert("Please fill all required fields.");
        return;
    }

    // Load previous orders
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Calculate total
    let total = 0;
    cart.forEach(i => total += i.price * i.qty);

    // Create new order object
    let newOrder = {
        orderId: Date.now(),
        date: new Date().toLocaleString(),
        items: cart,
        total: total
    };

    // Save the new order
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    alert("Order Confirmed! Thank you ❤️");

    // clear cart data
    localStorage.removeItem("cart");
    localStorage.setItem("cartCount", "0");

    // Redirect to client home
    window.location.href = "../client/index.html";  // adjust path if needed
});

});

function loadSummary() {
    let container = $("#SummaryItems");
    container.html("");

    let total = 0;

    cart.forEach(item => {
        let subtotal = item.price * item.qty;
        total += subtotal;

        container.append(`
            <div class="SummaryItem">
                <p>${item.name} x${item.qty}</p>
                <p>$${subtotal}</p>
            </div>
        `);
    });

    $("#TotalPrice").text(total);
}
