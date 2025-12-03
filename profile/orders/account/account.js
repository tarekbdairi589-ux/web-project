$(document).ready(function () {

    // Redirect if not logged in
    if (!localStorage.getItem("isLoggedIn")) {
        window.location.href = "../../../signup and login/SandL.html";
        return;
    }

    let currentUser = localStorage.getItem("currentUser");
    let isAdmin = localStorage.getItem("isAdmin") === "true";

    let userProfile;
    let users = JSON.parse(localStorage.getItem("users") || "[]");

    // If ADMIN is logged in → Show admin identity
    if (isAdmin && currentUser === "admin") {
        userProfile = {
            name: "Admin",
            email: "admin@dripdistrict.com",
            password: "●●●●●●●",
            address: "Admin Control Panel"
        };

        // Disable Edit Button for Admin
        $("#EditAccountBtn").hide();
    } 
    else {
        // Normal registered user
        userProfile = JSON.parse(localStorage.getItem("userProfile"));
        
        if (!userProfile) {
            // fallback if somehow profile not created yet
            userProfile = {
                name: currentUser,
                email: `${currentUser}@example.com`,
                password: "password123",
                address: "No address saved yet."
            };
        }
    }


    //-------------------------------------
    // 🟦 REFRESH VIEW
    //-------------------------------------
    function refreshView() {
        $("#AccNameText").text(userProfile.name);
        $("#AccEmailText").text(userProfile.email);
        $("#AccPasswordText").text("●●●●●●●");
        $("#AccAddressText").text(userProfile.address);

        // Fill form if NORMAL USER
        if (!isAdmin) {
            $("#AccNameInput").val(userProfile.name);
            $("#AccEmailInput").val(userProfile.email);
            $("#AccPasswordInput").val(userProfile.password);
            $("#AccAddressInput").val(userProfile.address);
        }
    }

    refreshView();


    //-------------------------------------
    // 🟦 EDIT MODE (Only For User)
    //-------------------------------------
    if (!isAdmin) {
        $("#EditAccountBtn").on("click", function () {
            $("#AccountView").hide();
            $("#AccountEdit").show();
        });
    }


    //-------------------------------------
    // 🟦 SAVE ACCOUNT INFO (Only For User)
    //-------------------------------------
    $("#SaveAccountBtn").on("click", function () {

        if (isAdmin) return; // Just in case

        userProfile.name = $("#AccNameInput").val().trim();
        userProfile.email = $("#AccEmailInput").val().trim();
        userProfile.password = $("#AccPasswordInput").val().trim();
        userProfile.address = $("#AccAddressInput").val().trim();

        localStorage.setItem("userProfile", JSON.stringify(userProfile));

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

        currentUser = userProfile.name;
        localStorage.setItem("currentUser", currentUser);

        refreshView();
        $("#AccountEdit").hide();
        $("#AccountView").show();

        alert("Account information updated successfully!");
    });


    //-------------------------------------
    // 🟦 CANCEL EDIT
    //-------------------------------------
    $("#CancelAccountBtn").on("click", function () {
        refreshView();
        $("#AccountEdit").hide();
        $("#AccountView").show();
    });


    //-------------------------------------
    // 🟦 BACK TO STORE
    //-------------------------------------
    $("#BackToStoreBtn").on("click", function () {
        window.location.href = "../../../index.html";
    });


    //-------------------------------------
    // 🟦 PASSWORD TOGGLE (USER ONLY)
    //-------------------------------------
    if (!isAdmin) {
        $("#TogglePassIcon").on("click", function () {
            let passInput = $("#AccPasswordInput");
            let icon = $("#TogglePassIcon");

            if (passInput.attr("type") === "password") {
                passInput.attr("type", "text");
                icon.attr("src", "view.png");
            } else {
                passInput.attr("type", "password");
                icon.attr("src", "hide.png");
            }
        });
    }

});
