

const db = firebase.firestore();


/////////////////////////////////UTILITY///////////////////////////////////////////////////////////////////////

function generateEventListeners(){
    ratingDropDowns = document.querySelectorAll("#ratings");
    ratingDropDowns.forEach(menu => menu.addEventListener('change', rate));
    unrateButtons = document.querySelectorAll("#unwatch");
    unrateButtons.forEach(button => button.addEventListener('click',unrate))
}
function isMobileDevice() {
    return (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i))
}
function pullMovieObjOut(movieTitle){
    return movieObjArray.find(obj => obj.Title == movieTitle);
}




/////////////////////////////////////////////////////////////// STREAMING STUFFF ////////////////////////////////////////////////////////
function streamCheckAll(){
    allMovies.forEach(movie => {
        streamCheck(movie);
    })
}
function streamCheck(movie){
    movieObj = pullMovieObjOut(movie);
    if (huluTitles.indexOf(movie.toLowerCase()) > -1 && !movieObj.onHulu){
        db.collection(currentList).doc(movie).update({
            onHulu: true
        });
        movieObj.onHulu = true;
    }
    else if (huluTitles.indexOf(movie.toLowerCase()) == -1 && movieObj.onHulu){
        db.collection(currentList).doc(movie).update({
            onHulu: false
        });
        movieObj.onHulu = false;
        
    }
    
    if (amazonTitles.indexOf(movie.toLowerCase()) > -1 && !movieObj.onAmazon){
        db.collection(currentList).doc(movie).update({
            onAmazon: true
        });
        movieObj.onAmazon = true;
        
    }
    else if (amazonTitles.indexOf(movie.toLowerCase()) == -1 && movieObj.onAmazon){
        db.collection(currentList).doc(movie).update({
            onAmazon: false
        });
        movieObj.onAmazon = false;
    }
    
    if (netflixTitles.indexOf(movie.toLowerCase()) > -1 && !movieObj.onNetflix){
        db.collection(currentList).doc(movie).update({
            onNetflix: true
        });
        movieObj.onNetflix = true;
    }
    else if (netflixTitles.indexOf(movie.toLowerCase()) == -1 && movieObj.onNetflix){
        db.collection(currentList).doc(movie).update({
            onNetflix: false
        });
        movieObj.onNetflix = false;
    }
    
}


function appendStreaming(movie){
    let append= "";
    const movieObj= pullMovieObjOut(movie);
    const onNetflix = movie.onNetflix;
    const onHulu = movie.onHulu;
    const onAmazon = movie.onAmazon;
    if ((onNetflix || onHulu || onAmazon) && !movie.watched){
        streamableMovies.push(movie.title)
    }
    if (onNetflix){
        append += " <img src='images/netflix-icon.png' class='stream-icon'>"
    }
    if(onHulu){
        append += "<img src='images/hulu-icon.png' class='stream-icon'>"
    }
    if(onAmazon){
        append += "<img src='images/amazon-icon.png' class='stream-icon'>"
    }
    return append;
}

///////////////////////////////////////////////////////////LOGIN////////////////////////////////////////////////////////////////////////
const loginButton = document.querySelector(".login");
loginButton.addEventListener('click', login);
let currentUserEmail = "";
const loginLinks = document.querySelector("#login-signup");
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      currentUser = firebase.auth().currentUser
      currentUserEmail = currentUser.email 
      createUserObject();
      addMovieButton.disabled = false;


    } else {
      console.log("no user signed in")
    }
  });
  
function login(){
    firebase.auth().signInWithEmailAndPassword(window.prompt("Please enter your email"), window.prompt("Please enter your password")).then(()=>{
        currentUser = firebase.auth().currentUser
        if (currentUser){
                currentUserEmail = currentUser.email
            }
            createUserObject();
            console.log("user logged in")
            addMovieButton.disabled = false;
        }).catch(function(error) {
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
        populateListSelect();
        changeList();
        
        
    })
}

//////////////////////// RANDOM NUMBER GENERATOR //////////////////////////
const randomNumButton = document.querySelector("#random");
const randomNumDisplay = document.querySelector(".rand-gen-display");
const streamableCheckbox = document.querySelector("#stream-only")
let randomClicks = 0;

function generateRandom(){
    if (randomClicks == 0){
        randomNumDisplay.innerHTML = "";
    }
    if (streamableCheckbox.checked == true){
        const size = streamableMovies.length;
        const randomNum = Math.floor(Math.random() * size);
        const title = streamableMovies[randomNum];
        streamableMovies.splice(randomNum,1);
        randomNumDisplay.innerHTML+= `<div class="random-movie">${title}${appendStreaming(pullMovieObjOut(title))}</div>`;
    }
    else{
        const size = unwatchedMovies.length;
        const randomNum = Math.floor(Math.random() * size);
        const title = unwatchedMovies[randomNum];
        unwatchedMovies.splice(randomNum,1);
        randomNumDisplay.innerHTML+= `<div class="random-movie">${title}${appendStreaming(pullMovieObjOut(title))}</div>`;
        
    }
    randomClicks++;
    if (randomClicks > 5){
        alert("JUST PICK A FREAKING MOVIE ALREADY");
        randomNumButton.disabled=true;
        randomNumButton.style.backgroundImage = "url(images/pickone.jpeg)";
        randomNumButton.style.width = "300px";
        randomNumButton.style.height = "168px";
        randomNumButton.textContent = "DISABLED";
    }
}
randomNumButton.addEventListener("click", generateRandom);
/////////////////////// AUTOCOMPLETE //////////////////////////////////////////////////////
const addMovieButton = document.querySelector("#add-movie-submit");
const addMovieText = document.querySelector("#add-movie")
const suggestions = document.querySelector(".suggestions")

let lastSuggestionArray = [];

addMovieText.addEventListener('change',displayMatches)
addMovieText.addEventListener('keyup',displayMatches)


function findMatches(wordToMatch, streamableMovies){
    console.log("test")
    return streamableMovies.filter(movie => {
        const regex = new RegExp(wordToMatch, 'gi');
        return movie.match(regex);
    });
}

function displayMatches(e){
    let matchArray = [];
    if (e.key =="Backspace" || addMovieText.value.length <= 1){
        matchArray = findMatches(this.value,allStreamableMovies);
        
    }
    else{
        matchArray = findMatches(this.value,lastSuggestionArray);
    }
    lastSuggestionArray = matchArray;
    if (matchArray.length < 100){
        
        const html = matchArray.map(movie => {
            const regex = new RegExp(this.value, 'gi');
            const movieName = movie.replace(regex, `${this.value}`);
            
            return `
            <li class="nameSuggestion">
            <span>${movieName}</span>
            </li>
            `;
        }).join('');
        suggestions.innerHTML = html;
        const titleSuggestions = document.querySelectorAll(".nameSuggestion")
        titleSuggestions.forEach(suggestion=> suggestion.addEventListener("click", clickedSuggestion));
    }
}

function clickedSuggestion(e){
    addMovieText.value = this.querySelector("span").textContent;
}


///////////////////////// ADD MOVIES ///////////////////////////////////////////

function addMovie(){
    let movieTitle = addMovieText.value;
    db.collection(currentList).doc(movieTitle).set({
        Title: movieTitle
    })
    .then(() => console.log("document written"))
    .catch(() => console.error("doc writing error"));
    addMovieText.value = ""
    appendUnwatchedMovieList(movieTitle);
}

addMovieButton.addEventListener("click", addMovie);

/////////////////////////// RATING SYSTEM ////////////////////////////////



function rate(e){
    console.log(this.value);
    const movie = this.dataset.movie;
    if (this.value=="remove"){
        db.collection(currentList).doc(movie).delete();
    }
    else{
        db.collection(currentList).doc(movie).update({
            [currentUserEmail.replace(".","")]: this.value
        })
    }
    const movieListElement = document.querySelector(`[data-movieUnwatched = "${movie}"]`)
    movieList.removeChild(movieListElement);
    if (this.value != "remove"){
        appendWatchedMovieList(movie, this.value);
    }
    
}

function unrate(e){
    const movie = this.dataset.movie;
    db.collection(currentList).doc(movie).set({
        [currentUserEmail.replace(".","")]: ""
    })
    const listElement = watchedMovies.querySelector(`[data-moviewatched="${movie}"]`);
    const rating = listElement.classList[0];
    console.log(listElement);
    watchedMovies.querySelector(`.${rating}-container`).removeChild(listElement);
    appendUnwatchedMovieList(movie);
}