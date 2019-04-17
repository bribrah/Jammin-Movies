const errors = document.querySelector(".signup-errors");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const loginButton = document.querySelector("#login-button")

loginButton.addEventListener('click',login);

function login(){
    firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value).then(()=>{
        window.location.replace("list.html");
        sessionStorage.setItem("loggedIn","true");
        errors.textContent = "Logged in Successfully";
        sessionStorage.setItem("email",emailInput.value);
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        errors.textContent = errorMessage;
        
        // ...
    });
}