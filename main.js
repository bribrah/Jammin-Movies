const db = firebase.firestore();
//////////////////////// RANDOM NUMBER GENERATOR //////////////////////////
const randomNumButton = document.querySelector("#random");
const randomNumDisplay = document.querySelector(".rand-gen-display");

function generateRandom(){
    const size = document.querySelectorAll("li").length;

 
    console.log(size);

    randomNumDisplay.textContent = `${Math.floor(Math.random() * (size )+ 1)}`;
}
randomNumButton.addEventListener("click", generateRandom);

/////////////////////// MOVIE LIST GENERATOR //////////////////////////////////////////
const movieList = document.querySelector(".movie-list");
const watchedMovies = document.querySelector(".watched-movies");

function generateMovieList(){
    const movies = db.collection("Movies").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if (doc.data().watched == true){
                watchedMovies.innerHTML += `<li> ${doc.data().Title} </li>`;
            }
            else{
                movieList.innerHTML += `<li> ${doc.data().Title} </li>`;
            }
            
        });
    });
}

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


generateMovieList();