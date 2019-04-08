const emailInput = document.querySelector("#email")
const passwordInput = document.querySelector("#password");
const passwordConfInput = document.querySelector("#password-conf");
const errorsOutput = document.querySelector(".signup-errors")
const submit = document.querySelector("#create-account");
const firstList = document.querySelector("#first-list");
const db = firebase.firestore();


submit.addEventListener('click', createAccount);
function createAccount(){
    if (passwordInput.value == passwordConfInput.value){
        firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value).then(()=>{
            
            errorsOutput.textContent = "Account Created."
            db.collection(emailInput.value).doc("movie_lists").set({
                movie_list_array: [firstList.value]
            }).then(() =>{
                db.collection(newListName).doc("Movie Filler you can Remove").set({
                    Title: "Movie Filler you can Remove"
                }).then(() =>{
                    db.collection(newListName).doc("Movie Filler you can Remove").delete().then(()=> {
                        
                        movieListArray.push(newListName);
                        db.collection(currentUserEmail).doc("movie_lists").set({
                            movie_list_array: movieListArray
                        }).then(() => {
                            let optionNode = document.createElement('option');
                            let optionText = document.createTextNode(newListName);
                            optionNode.appendChild(optionText);
                            listSelect.appendChild(optionNode);
                            listSelect.value = newListName;
                            let addNewNode = document.createElement('option');
                            let addNewText = document.createTextNode("Create new List")
                            addNewNode.appendChild(addNewText);
                            listSelect.appendChild(addNewNode);
                            generateMovieList(newListName);
                            db.collection("list_index").doc(`${newListName}`).set({
                                name: newListName,
                                subscribers: 1
                            })
                                    firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value).then(()=>{
                                        window.location.href = "index.html";
                            })
                        })
                    })
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