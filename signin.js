const loginButton = document.querySelector(".login");
loginButton.addEventListener('click', login);
let currentUserEmail = "";
const loginLinks = document.querySelector("#login-signup");
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currentUser = firebase.auth().currentUser
        currentUserEmail = currentUser.email 
        createUserObject();
        
        
    } else {
        console.log("no user signed in")
    }
});

function login(){
    firebase.auth().signInWithEmailAndPassword(window.prompt("Please enter your email"), window.prompt("Please enter your password")).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        
        // ...
    });
}
function logout(){
    firebase.auth().signOut().then(()=>{
        location.reload()
    })
}
let currentUserObject;
function createUserObject(){
    db.collection(currentUserEmail).doc("movie_lists").get().then(function(doc){
        currentUserObject = {
            email: currentUserEmail,
            movie_list_array: doc.data().movie_list_array
        }
        loginLinks.innerHTML = `<li id='logout'><a>Logout</a></li><li class='current-user-display'>Logged in as: ${currentUserEmail}</li>`
        document.querySelector("#logout").addEventListener('click', logout)
        console.log(window.location.pathname)
        
        if (window.location.pathname == '/index.html'){
            console.log("test")
            addMovieButton.disabled = false;
            populateListSelect();
            changeList();
        }
        
        
    })
}
