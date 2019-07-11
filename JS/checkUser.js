let currentUserEmail = "";
const loginLinks = document.querySelector("#login-signup");
const db = firebase.firestore();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currentUser = firebase.auth().currentUser;
        currentUserEmail = currentUser.email;
        if (sessionStorage.getItem("loggedIn") != "true"){
            sessionStorage.setItem("loggedIn","true");
            sessionStorage.setItem("email",currentUserEmail);
            changeNavBar();
        }
        createUserObject();
        
        
    } else {
        window.sessionStorage.setItem("loggedIn","false");
        console.log("no user signed in")
        console.log
        if (window.location.pathname == "/list.html" || window.location.href == "file:///home/brian/Desktop/bribrah_coding/web-projects/jammin-movies/list.html"){
            window.location.href = "login.html";
        }
    }
});

if (sessionStorage.getItem('loggedIn') == "true"){
    changeNavBar();
}
function changeNavBar(){
    loginLinks.innerHTML = `<li><a href="list.html">My Lists</a></li><li id='logout'><a>Logout</a></li><li class='current-user-display'>Logged in as: ${sessionStorage.getItem("email")}</li>`;
    document.querySelector("#logout").addEventListener('click', logout)
}

function logout(){
    firebase.auth().signOut().then(()=>{
        sessionStorage.setItem("loggedIn",false);
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
        };
        console.log(window.location.pathname);
        
            console.log("test");
            addMovieButton.disabled = false;
            populateListSelect();
            changeList();
        
        
    })
}
