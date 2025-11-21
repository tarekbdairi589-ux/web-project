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

        alert("Order Confirmed! Thank you ❤️");

        localStorage.removeItem("cart");

        window.location.href = "../clientHome.html"; // change based on your structure
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
