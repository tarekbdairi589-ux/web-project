$(document).ready(function () {

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let list = $("#OrdersList");

    if (orders.length === 0) {
        list.append(`<p>You have no past orders.</p>`);
        return;
    }

    orders.forEach(order => {

        let orderDiv = $(`
            <div class="OrderCard">
                <div class="OrderHeader">
                    <h2>Order #${order.orderId}</h2>
                    <span>${order.date}</span>
                </div>

                <div class="OrderItems"></div>

                <div class="OrderTotal">Total: $${order.total}</div>
            </div>
        `);

        let itemsContainer = orderDiv.find(".OrderItems");

        order.items.forEach(item => {
    itemsContainer.append(`
        <div class="ItemRow">
            <div class="ItemLeft">
                <img class="OrderItemImg" src="${item.image}" alt="${item.name}">
                <div>
                    <p class="ItemName">${item.name}</p>
                    <p class="ItemQty">Qty: ${item.qty}</p>
                </div>
            </div>

            <div class="ItemRight">
                <p class="ItemPrice">$${(item.price * item.qty).toFixed(2)}</p>
            </div>
        </div>
    `);
});


        list.append(orderDiv);
    });

    $("#BackToStoreBtn").click(function () {
    window.location.href = "../../client/index.html"; // adjust path if needed
});


});
