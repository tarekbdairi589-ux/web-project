$(document).ready(function () {

    if (!localStorage.getItem("isLoggedIn")) {
        window.location.href = "../../signup and login/SandL.html";
        return;
    }

    let currentUser = localStorage.getItem("currentUser");
    let isAdmin = localStorage.getItem("isAdmin") === "true";

    let userProfile = JSON.parse(localStorage.getItem("userProfile"));

    if (isAdmin) {
        userProfile = {
            name: "Admin",
            email: "admin@dripdistrict.com",
            password: "●●●●●●●",
            address: "Admin Panel"
        };
        $("#EditAccountBtn").hide();
    }

    function refreshView() {
        $("#AccNameText").text(userProfile.name);
        $("#AccEmailText").text(userProfile.email);
        $("#AccPasswordText").text("●●●●●●●");
        $("#AccAddressText").text(userProfile.address);

        if (!isAdmin) {
            $("#AccNameInput").val(userProfile.name);
            $("#AccEmailInput").val(userProfile.email);
            $("#AccPasswordInput").val(userProfile.password);
            $("#AccAddressInput").val(userProfile.address);
        }
    }

    refreshView();

    $("#EditAccountBtn").on("click", function () {
        $("#AccountView").hide();
        $("#AccountEdit").show();
    });

    $("#SaveAccountBtn").on("click", function () {
        if (isAdmin) return;

        userProfile.name = $("#AccNameInput").val().trim();
        userProfile.email = $("#AccEmailInput").val().trim();
        userProfile.password = $("#AccPasswordInput").val().trim();
        userProfile.address = $("#AccAddressInput").val().trim();

        localStorage.setItem("userProfile", JSON.stringify(userProfile));

        refreshView();
        $("#AccountEdit").hide();
        $("#AccountView").show();
        alert("Updated Successfully!");
    });

    $("#CancelAccountBtn").on("click", function () {
        refreshView();
        $("#AccountEdit").hide();
        $("#AccountView").show();
    });

    $("#BackToStoreBtn").on("click", function () {
        window.location.href = "index.html";
    });

    $("#TogglePassIcon").on("click", function () {
        let passInput = $("#AccPasswordInput");
        if (passInput.attr("type") === "password") {
            passInput.attr("type", "text");
            $(this).attr("src", "view.png");
        } else {
            passInput.attr("type", "password");
            $(this).attr("src", "hide.png");
        }
    });
});
