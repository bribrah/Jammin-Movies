const db = firebase.firestore();

//UTILITY
function isMobileDevice() {
    return (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i))
}

//////////////////////// RANDOM NUMBER GENERATOR //////////////////////////
const randomNumButton = document.querySelector("#random");
const randomNumDisplay = document.querySelector(".rand-gen-display");

function generateRandom(){
    const movieListElements = movieList.querySelectorAll("li");
    const size = movieListElements.length;

 

    randomNumDisplay.textContent = `${movieListElements[Math.floor(Math.random() * size)].childNodes[0].textContent}`;
}
randomNumButton.addEventListener("click", generateRandom);

/////////////////////// MOVIE LIST GENERATOR //////////////////////////////////////////
const movieList = document.querySelector(".unwatched-movies");
const watchedMovies = document.querySelector(".watched-movies");
let ratingSubmit = document.querySelectorAll("#rate");
let ratingDropDowns = document.querySelectorAll("#ratings");

function generateMovieList(){
    movieList.innerHTML= "";
    watchedMovies.innerHTML = ""
    console.log(isMobileDevice);
    const movies = db.collection("Movies").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if (doc.data().watched == true){
                if (isMobileDevice){
                watchedMovies.innerHTML += `<li class="${doc.data().rating}"> ${doc.data().Title} <button id="unwatch" data-movie="${doc.data().Title}" style="float:none">Unwatch/Rate</button></li>`;
                }
                else{
                    watchedMovies.innerHTML += `<li class="${doc.data().rating}"> ${doc.data().Title} <button id="unwatch" data-movie="${doc.data().Title}">Unwatch/Rate</button></li>`;
                }
            }
            else{
                movieList.innerHTML += `<li> ${doc.data().Title} <select data-movie="${doc.data().Title}" id="ratings">
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
        unrateButtons.forEach(button => button.addEventListener('click',unrate))
        console.log(ratingDropDowns);
        console.log(unrateButtons)
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
    generateMovieList();
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
    generateMovieList()
}

function unrate(e){
    console.log("test")
    const movie = this.dataset.movie;
    db.collection("Movies").doc(movie).set({
        Title: movie
    })
    generateMovieList();
}