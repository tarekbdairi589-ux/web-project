// loginscript.js
// Uses only `let`
/*let showPass = document.getElementById('showPass');
let showPasss = document.getElementById('showPasss');
let passlInput = document.getElementById('loginPassword')
let passsInput = document.getElementById('signupPassword')
document.addEventListener('DOMContentLoaded', function () {
    let card = document.getElementById('log');         // the <div class="login" id="log">
    let toSignup = document.getElementById('toSignup');    // "Create account"
    let toLogin = document.getElementById('toLogin');     // "Back to login"

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
});
showPass.addEventListener('change', function () {
    if (this.checked) {
        passlInput.type = 'text';   // show the password
    } else {
        passlInput.type = 'password'; // hide the password
    }
});

showPasss.addEventListener('change', function () {
    if (this.checked) {
        passsInput.type = 'text';   // show the password
    } else {
        passsInput.type = 'password'; // hide the password
    }
});*/
// loginscript.js

// === PASSWORD TOGGLE ELEMENTS ===
let showPass = document.getElementById('showPass');
let showPasss = document.getElementById('showPasss');
let passlInput = document.getElementById('loginPassword');
let passsInput = document.getElementById('signupPassword');

// === HELPERS FOR USERS IN LOCAL STORAGE ===
function getUsers() {
    let users = localStorage.getItem("users");
    if (!users) {
        return [];
    }
    return JSON.parse(users);
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

document.addEventListener('DOMContentLoaded', function () {
    let card = document.getElementById('log');          // main container
    let toSignup = document.getElementById('toSignup'); // "Create account"
    let toLogin = document.getElementById('toLogin');   // "Back to login"

    let signupForm = document.getElementById('signupForm');
    let loginForm = document.getElementById('loginForm');

    // default: show login form
    card.classList.add('active-login');

    // ----- toggle between login / signup -----
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

    // ===== SIGNUP SUBMIT =====
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

            // check if same username OR email already exists
            let exists = users.find(function (u) {
                return u.username === fullName || u.email === email;
            });

            if (exists) {
                alert("This user already exists. Please login.");
                return;
            }

            // add new user
            users.push({
                username: fullName,
                email: email,
                password: password
            });

            saveUsers(users);

            alert("Account created successfully! Please login now.");

            signupForm.reset();

            // switch to login form
            card.classList.remove('active-signup');
            card.classList.add('active-login');

            // optional: auto-fill login username
            let loginUserInput = document.getElementById('loginUsername');
            if (loginUserInput) {
                loginUserInput.value = fullName;
                loginUserInput.focus();
            }
        });
    }

    // ===== LOGIN SUBMIT =====
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let username = document.getElementById('loginUsername').value.trim();
            let password = document.getElementById('loginPassword').value;

            if (!username || !password) {
                alert("Please enter username and password.");
                return;
            }

            let users = getUsers();

            let found = users.find(function (u) {
                return u.username === username && u.password === password;
            });

            if (!found) {
                alert("Wrong username or password.");
                return;
            }

            // mark as logged in
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("currentUser", found.username);

            alert("Login successful! Redirecting to store...");

            // redirect to client page (based on your folder tree)
            window.location.href = "../client/index.html";
        });
    }
});

// ===== SHOW / HIDE PASSWORDS =====
if (showPass) {
    showPass.addEventListener('change', function () {
        if (this.checked) {
            passlInput.type = 'text';   // show the password
        } else {
            passlInput.type = 'password'; // hide the password
        }
    });
}

if (showPasss) {
    showPasss.addEventListener('change', function () {
        if (this.checked) {
            passsInput.type = 'text';   // show the password
        } else {
            passsInput.type = 'password'; // hide the password
        }
    });
}
