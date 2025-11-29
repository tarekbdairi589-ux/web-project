$(document).ready(function () {

    // -----------------------------
    //  LOAD PROFILE
    // -----------------------------
    let userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    let currentUser = localStorage.getItem("currentUser");

    // If nothing exists, fallback (should never happen ideally)
    if (!userProfile || !userProfile.name) {
        userProfile = {
            name: "Guest User",
            email: "example@email.com",
            password: "password123",
            address: "No address saved yet."
        };
    }

    // -----------------------------
    //  REFRESH UI
    // -----------------------------
    function refreshView() {
        // Read-only view
        $("#AccNameText").text(userProfile.name);
        $("#AccEmailText").text(userProfile.email);
        $("#AccPasswordText").text("●●●●●●●");
        $("#AccAddressText").text(userProfile.address);

        // Edit fields
        $("#AccNameInput").val(userProfile.name);
        $("#AccEmailInput").val(userProfile.email);
        $("#AccPasswordInput").val(userProfile.password);
        $("#AccAddressInput").val(userProfile.address);
    }

    refreshView();

    // -----------------------------
    //  EDIT MODE
    // -----------------------------
    $("#EditAccountBtn").on("click", function () {
        $("#AccountView").hide();
        $("#AccountEdit").show();
    });

    // -----------------------------
    //  SAVE ACCOUNT INFORMATION
    // -----------------------------
    $("#SaveAccountBtn").on("click", function () {

        // Update userProfile object
        userProfile.name = $("#AccNameInput").val().trim();
        userProfile.email = $("#AccEmailInput").val().trim();
        userProfile.password = $("#AccPasswordInput").val().trim();
        userProfile.address = $("#AccAddressInput").val().trim();

        // Save updated profile
        localStorage.setItem("userProfile", JSON.stringify(userProfile));

        // -----------------------------
        //  UPDATE USERS[] ARRAY ✔ FIX LOGIN ISSUE
        // -----------------------------
        users = users.map(u => {
            if (u.username === currentUser) {
                return {
                    username: userProfile.name,
                    email: userProfile.email,
                    password: userProfile.password
                };
            }
            return u;
        });

        localStorage.setItem("users", JSON.stringify(users));

        // If user changed his name, update currentUser
        currentUser = userProfile.name;
        localStorage.setItem("currentUser", currentUser);

        // Refresh UI
        refreshView();

        $("#AccountEdit").hide();
        $("#AccountView").show();

        alert("Account information updated successfully!");
    });

    // -----------------------------
    //  CANCEL EDIT
    // -----------------------------
    $("#CancelAccountBtn").on("click", function () {
        refreshView();
        $("#AccountEdit").hide();
        $("#AccountView").show();
    });

    // -----------------------------
    //  BACK TO STORE
    // -----------------------------
    $("#BackToStoreBtn").on("click", function () {
        window.location.href = "../../../client/index.html";
    });

    // -----------------------------
    //  SHOW / HIDE PASSWORD ICON
    // -----------------------------
    $("#TogglePassIcon").on("click", function () {
        let passInput = $("#AccPasswordInput");
        let icon = $("#TogglePassIcon");

        if (passInput.attr("type") === "password") {
            passInput.attr("type", "text");
            icon.attr("src", "view.png");   // make sure view.png exists here
        } else {
            passInput.attr("type", "password");
            icon.attr("src", "hide.png");   // make sure hide.png exists here
        }
    });

});
