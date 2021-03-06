const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const passwordConfInput = document.querySelector("#password-conf");
const errorsOutput = document.querySelector(".signup-errors");
const success = document.querySelector(".signup-success");
const submit = document.querySelector("#create-account");
const firstList = document.querySelector("#first-list");
const db = firebase.firestore();


submit.addEventListener('click', createAccount);
function createAccount(){
    errorsOutput.textContent = "";
    if (passwordInput.value == passwordConfInput.value){
        firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value).then(()=>{
            
            success.textContent = "Account Created.";
            db.collection(emailInput.value).doc("movie_lists").set({
                movie_list_array: []
            }).then(() =>{
                firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value).then(()=>{
                    window.location.href = "list.html";
                })
            })
        }).catch(function(error){
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            errorsOutput.textContent = errorMessage;
            // ...
        })
    }
    else{
        errorsOutput.textContent = "Password and Password conf did not match."
    }
}