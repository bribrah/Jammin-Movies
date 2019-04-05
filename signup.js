const emailInput = document.querySelector("#email")
const passwordInput = document.querySelector("#password");
const passwordConfInput = document.querySelector("#password-conf");
const errorsOutput = document.querySelector(".signup-errors")
const submit = document.querySelector("#create-account");

submit.addEventListener('click', createAccount);
function createAccount(){
    if (passwordInput.value == passwordConfInput.value && passwordInput.value != "" && emailInput.value != ""){
        firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });
        errorsOutput.textContent = "Account Created."
    }
    else{
        errorsOutput.textContent = "Password and Password conf did not match."
    }
}