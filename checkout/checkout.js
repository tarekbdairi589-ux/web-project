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

                let orders = JSON.parse(localStorage.getItem("orders")) || [];

        
        let total = 0;
        cart.forEach(i => total += i.price * i.qty);

        
        let newOrder = {
            orderId: Date.now(),
            date: new Date().toLocaleString(),
            items: cart,
            total: total
        };

        
        orders.push(newOrder);
        localStorage.setItem("orders", JSON.stringify(orders));

        alert("Order Confirmed! Thank you ❤️");

       
        localStorage.removeItem("cart");
        localStorage.setItem("cartCount", "0");

        
        window.location.href = "../client/index.html";
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

