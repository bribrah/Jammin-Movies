const loginButton = document.querySelector(".login");
loginButton.addEventListener('click', login);
let currentUserEmail = "";
const loginLinks = document.querySelector("#login-signup");
const db = firebase.firestore();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currentUser = firebase.auth().currentUser
        currentUserEmail = currentUser.email 
        if (sessionStorage.getItem("loggedIn") != "true"){
            sessionStorage.setItem("loggedIn","true")
            sessionStorage.setItem("email",currentUserEmail);
            changeNavBar();
        }
        createUserObject();
        
        
    } else {
        window.sessionStorage.setItem("loggedIn","false")
        console.log("no user signed in")
    }
});

if (sessionStorage.getItem('loggedIn') == "true"){
    changeNavBar();
}
function changeNavBar(){
    loginLinks.innerHTML = `<li><a href="list.html">My Lists</a></li><li id='logout'><a>Logout</a></li><li class='current-user-display'>Logged in as: ${sessionStorage.getItem("email")}</li>`
    document.querySelector("#logout").addEventListener('click', logout)
}
function login(){
    firebase.auth().signInWithEmailAndPassword(window.prompt("Please enter your email"), window.prompt("Please enter your password")).then(()=>changeNavBar()).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        
        // ...
    });
}
function logout(){
    firebase.auth().signOut().then(()=>{
        sessionStorage.setItem("loggedIn",false)
        sessionStorage.removeItem("email");
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
        console.log(window.location.pathname)
        
            console.log("test")
            addMovieButton.disabled = false;
            populateListSelect();
            changeList();
        
        
    })
}
