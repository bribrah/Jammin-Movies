const db = firebase.firestore();
//////////////////////// RANDOM NUMBER GENERATOR //////////////////////////
const randomNumButton = document.querySelector("#random");
const randomNumDisplay = document.querySelector(".rand-gen-display");

function generateRandom(){
    const size = movieList.querySelectorAll("li").length;

 
    console.log(size);

    randomNumDisplay.textContent = `${Math.floor(Math.random() * (size )+ 1)}`;
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
    const movies = db.collection("Movies").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if (doc.data().watched == true){
                watchedMovies.innerHTML += `<li class="${doc.data().rating}"> ${doc.data().Title} </li>`;
            }
            else{
                movieList.innerHTML += `<li> ${doc.data().Title} <select data-movie="${doc.data().Title}" id="ratings">
                <option value="null" selected>Select Rating</option>
                <option value="bad">Bad</option>
                <option value="meh">Meh</option>
                <option value="pretty-good">Pretty Good</option>
                <option value="great">Great</option>
                <option value="masterpiece">Masterpiece</option>
                </select></li>`;
            }
        });
    });
    setTimeout(() =>{
        ratingDropDowns = document.querySelectorAll("#ratings");
        ratingDropDowns.forEach(menu => menu.addEventListener('change', rate));
    },750);
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
    const movie = this.dataset.movie;
    db.collection("Movies").doc(movie).update({
        watched: true,
        rating: `${this.value}`
    })
    generateMovieList()
}