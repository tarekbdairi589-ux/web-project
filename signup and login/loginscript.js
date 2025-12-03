
let passlInput = document.getElementById('loginPassword');
let passsInput = document.getElementById('signupPassword');

function getUsers() {
    let users = localStorage.getItem("users");
    if (!users) return [];
    return JSON.parse(users);
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

document.addEventListener('DOMContentLoaded', function () {

    let card = document.getElementById('log');
    let toSignup = document.getElementById('toSignup');
    let toLogin = document.getElementById('toLogin');
    let signupForm = document.getElementById('signupForm');
    let loginForm = document.getElementById('loginForm');

    card.classList.add('active-login');

    toSignup.onclick = function (e) {
        e.preventDefault();
        card.classList.remove('active-login');
        card.classList.add('active-signup');
    };

    toLogin.onclick = function (e) {
        e.preventDefault();
        card.classList.remove('active-signup');
        card.classList.add('active-login');
    };

    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let fullName = document.getElementById('signupFullName').value.trim();
            let email = document.getElementById('signupEmail').value.trim();
            let password = document.getElementById('signupPassword').value;

            if (!fullName || !email || !password) {
                alert("Please fill all signup fields.");
                return;
            }

            let users = getUsers();

          
            let exists = users.find(u => u.username === fullName || u.email === email);
            if (exists) {
                alert("This user already exists. Please login.");
                return;
            }

           
            users.push({
                username: fullName,
                email: email,
                password: password
            });

            saveUsers(users);

            alert("Account created successfully! Please login now.");
            signupForm.reset();

            card.classList.remove('active-signup');
            card.classList.add('active-login');

           
            let loginUserInput = document.getElementById('loginUsername');
            if (loginUserInput) loginUserInput.value = fullName;
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let username = document.getElementById('loginUsername').value.trim();
            let password = document.getElementById('loginPassword').value;

            if (!username || !password) {
                alert("Please enter username and password.");
                return;
            }
            
            if(username==="admin"&& password==="12345"){
                console.log("✅ Admin credentials matched");
                localStorage.setItem("isAdmin","true");
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("currentUser", "admin");

                 alert("Welcome Admin! Redirecting to admin page...");
            window.location.href = "../admin/admin.html";  
            return;
            }else{
                localStorage.setItem("isAdmin","false");
            }


            let users = getUsers();

            let found = users.find(u => 
                u.username === username && u.password === password
            );

            if (!found) {
                alert("Wrong username or password.");
                return;
            }

           
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("currentUser", found.username);


            let profile = {
                name: found.username,
                email: found.email,
                password: found.password,
                address: "No address saved yet."
            };
            localStorage.setItem("userProfile", JSON.stringify(profile));

            alert("Login successful! Redirecting to store...");
            window.location.href = "../client/index.html";
        });
    }

    let loginToggle = document.getElementById("LoginTogglePass");

    if (loginToggle) {
        loginToggle.addEventListener("click", function () {
            if (passlInput.type === "password") {
                passlInput.type = "text";
                loginToggle.src = "../profile/orders/account/view.png";
            } else {
                passlInput.type = "password";
                loginToggle.src = "../profile/orders/account/hide.png";
            }
        });
    }

    let signupToggle = document.getElementById("SignupTogglePass");

    if (signupToggle) {
        signupToggle.addEventListener("click", function () {
            if (passsInput.type === "password") {
                passsInput.type = "text";
                signupToggle.src = "../profile/orders/account/view.png";
            } else {
                passsInput.type = "password";
                signupToggle.src = "../profile/orders/account/hide.png";
            }
        });
    }

});
