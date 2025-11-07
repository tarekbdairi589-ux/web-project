// loginscript.js
// Uses only `let`
let showPass = document.getElementById('showPass');
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
});
