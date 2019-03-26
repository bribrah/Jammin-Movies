const db = firebase.firestore();

/////////////////////////////////UTILITY///////////////////////////////////////////////////////////////////////
function isMobileDevice() {
    return (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i))
}

function appendUnwatchedMovieList(movieTitle){
    movieList.innerHTML += `<li data-movieUnwatched="${movieTitle}"> ${movieTitle} <select data-movie="${movieTitle}" id="ratings">
    <option value="null" selected>Select Rating</option>
    <option value="bad">Bad</option>
    <option value="meh">Meh</option>
    <option value="pretty-good">Pretty Good</option>
    <option value="great">Great</option>
    <option value="masterpiece">Masterpiece</option>
    <option value="remove">Remove Movie</option>
    </select></li>`;
    
    generateEventListeners();
}

function appendWatchedMovieList(movieTitle, rating){
    watchedMovies.querySelector(`.${rating}-container`).innerHTML += `<div class="${rating} watched-movie" data-movieWatched="${movieTitle}" watched-movie"> ${movieTitle} <button id="unwatch" data-movie="${movieTitle}">Unwatch/Rate</button></div>`;
    generateEventListeners();

}

function generateEventListeners(){
    ratingDropDowns = document.querySelectorAll("#ratings");
    ratingDropDowns.forEach(menu => menu.addEventListener('change', rate));
    unrateButtons = document.querySelectorAll("#unwatch");
    unrateButtons.forEach(button => button.addEventListener('click',unrate))
}


const useButton = document.querySelector(".login");
useButton.addEventListener('click', generate);
function generate(){
    let cat = window.prompt();
    if (cat == "suhdood"){
        addMovieButton.disabled = false;
        document.querySelectorAll("button").forEach(button => button.disabled=false);
        ratingDropDowns.forEach(menu => menu.disabled=false);
    }
}
//////////////////////// RANDOM NUMBER GENERATOR //////////////////////////
const randomNumButton = document.querySelector("#random");
const randomNumDisplay = document.querySelector(".rand-gen-display");
let randomClicks = 0;

function generateRandom(){
    const movieListElements = movieList.querySelectorAll("li");
    const size = movieListElements.length;
    if (randomClicks == 0){
        randomNumDisplay.innerHTML = "";
    }
    
    
    
    randomNumDisplay.innerHTML += `<div class="random-movie">${movieListElements[Math.floor(Math.random() * size)].childNodes[0].textContent}</div>`;
    randomClicks++;
    if (randomClicks > 5){
        alert("JUST PICK A FREAKING MOVIE ALREADY");
        randomNumButton.disabled=true;
    }
}
randomNumButton.addEventListener("click", generateRandom);

/////////////////////// MOVIE LIST GENERATOR //////////////////////////////////////////
const movieList = document.querySelector(".unwatched-movies");
const watchedMovies = document.querySelector(".watched-movies");
let ratingDropDowns = document.querySelectorAll("#ratings");

function generateMovieList(){
    console.log(isMobileDevice);
    const movies = db.collection("Movies").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if (doc.data().watched == true){
                watchedMovies.querySelector(`.${doc.data().rating}-container`).innerHTML += `<div class="${doc.data().rating} watched-movie" data-movieWatched="${doc.data().Title}" watched-movie"> ${doc.data().Title} <button id="unwatch" data-movie="${doc.data().Title}" disabled=true>Unwatch/Rate</button></div>`;
                }
            else{
                movieList.innerHTML += `<li data-movieUnwatched="${doc.data().Title}"> ${doc.data().Title} <select data-movie="${doc.data().Title}" id="ratings" disabled=true>
                <option value="null" selected>Select Rating</option>
                <option value="bad">Bad</option>
                <option value="meh">Meh</option>
                <option value="pretty-good">Pretty Good</option>
                <option value="great">Great</option>
                <option value="masterpiece">Masterpiece</option>
                <option value="remove">Remove Movie</option>
                </select></li>`;
            }
        });
    });
    setTimeout(() =>{
        ratingDropDowns = document.querySelectorAll("#ratings");
        ratingDropDowns.forEach(menu => menu.addEventListener('change', rate));
        unrateButtons = document.querySelectorAll("#unwatch");
        unrateButtons.forEach(button => button.addEventListener('click',unrate));
        useButton.disabled = false;
    },2000);
}
generateMovieList();

///////////////////////// ADD MOVIES ///////////////////////////////////////////
const addMovieButton = document.querySelector("#add-movie-submit");
const addMovieText = document.querySelector("#add-movie")

function addMovie(){
    let movieTitle = addMovieText.value;
    db.collection("Movies").doc(movieTitle).set({
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
        db.collection("Movies").doc(movie).delete();
    }
    else{
        db.collection("Movies").doc(movie).update({
            watched: true,
            rating: `${this.value}`
        })
    }
    const movieListElement = document.querySelector(`[data-movieUnwatched = "${movie}"]`)
    movieList.removeChild(movieListElement);
    if (this.value != "remove"){
        appendWatchedMovieList(movie, this.value);
    }
    
}

function unrate(e){
    console.log("test")
    const movie = this.dataset.movie;
    db.collection("Movies").doc(movie).set({
        Title: movie
    })
    const listElement = watchedMovies.querySelector(`[data-movieWatched="${movie}"]`);
    const rating = listElement.classList[0];
    console.log(listElement);
    watchedMovies.querySelector(`.${rating}-container`).removeChild(listElement);
    appendUnwatchedMovieList(movie);
}