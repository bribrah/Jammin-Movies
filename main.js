//  TODO BROKE STREAMING INTEGRATION, NOT APPENDING LISTS!!!!


const db = firebase.firestore();
let streamableMovies = []
let allMovies = [];

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

function streamCheckAll(){
    allMovies.forEach(movie => {
        streamCheck(movie);
    })
}



/////////////////////////////////////////////////////////////// STREAMING STUFFF ////////////////////////////////////////////////////////
function streamCheck(movie){
    if (huluTitles.indexOf(movie.toLowerCase()) > -1){
        db.collection("Movies").doc(movie).update({
            onHulu: true
        });
    }
    else{
        db.collection("Movies").doc(movie).update({
            onHulu: false
        });
    }
    
    if (amazonTitles.indexOf(movie.toLowerCase()) > -1){
        console.log("TEST");
        db.collection("Movies").doc(movie).update({
            onAmazon: true
        });
    }
    else{
        db.collection("Movies").doc(movie).update({
            onAmazon: false
        });
    }
    
    if (netflixTitles.indexOf(movie.toLowerCase()) > -1){
        db.collection("Movies").doc(movie).update({
            onNetflix: true
        });
    }
    else{
        db.collection("Movies").doc(movie).update({
            onNetflix: false
        });
    }
}


function appendStreaming(movie){
    let append= "";
    const onNetflix = movie.data().onNetflix
    const onHulu = movie.data().onHulu
    const onAmazon = movie.data().onAmazon
    if ((onNetflix || onHulu || onAmazon) && !movie.data().watched){
        streamableMovies.push(movie.data().Title)
    }
    if (onNetflix){
        append += " <img src='netflix-icon.png' class='stream-icon'>"
    }
    if(onHulu){
        append += "<img src='hulu-icon.png' class='stream-icon'>"
    }
    if(onAmazon){
        append += "<img src='amazon-icon.png' class='stream-icon'>"
    }
    return append;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function appendUnwatchedMovieList(movieTitle){
    streamCheck(movieTitle)
    const docRef = db.collection("Movies").doc(movieTitle);
    docRef.get().then(doc=>{
        console.log(doc.data())
        movieList.innerHTML += `<li data-movieUnwatched="${movieTitle}"> ${movieTitle} <select data-movie="${movieTitle}" id="ratings">
        <option value="null" selected>Select Rating</option>
        <option value="bad">Bad</option>
        <option value="meh">Meh</option>
        <option value="pretty-good">Pretty Good</option>
        <option value="great">Great</option>
        <option value="masterpiece">Masterpiece</option>
        <option value="remove">Remove Movie</option>
        </select>${appendStreaming(doc)}</li>`;
        
        
        generateEventListeners();
    })
}

function appendWatchedMovieList(movieTitle, rating){
    watchedMovies.querySelector(`.${rating}-container`).innerHTML += `<div class="${rating} watched-movie" data-movieWatched="${movieTitle}
    " watched-movie"> ${movieTitle} <button id="unwatch" data-movie="${movieTitle}">Unwatch/Rate</button></div>`;
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
        generateEventListeners();
        addMovieButton.disabled = false;
        document.querySelectorAll("button").forEach(button => button.disabled=false);
        ratingDropDowns.forEach(menu => menu.disabled=false);
    }
}
//////////////////////// RANDOM NUMBER GENERATOR //////////////////////////
const randomNumButton = document.querySelector("#random");
const randomNumDisplay = document.querySelector(".rand-gen-display");
const streamableCheckbox = document.querySelector("#stream-only")
let randomClicks = 0;

function generateRandom(){
    const movieListElements = movieList.querySelectorAll("li");
    if (randomClicks == 0){
        randomNumDisplay.innerHTML = "";
    }
    if (streamableCheckbox.checked == true){
        const size = streamableMovies.length;
        randomNumDisplay.innerHTML+= `<div class="random-movie">${streamableMovies[Math.floor(Math.random() * size)]}</div>`;
    }
    else{
        const size = movieListElements.length;
        randomNumDisplay.innerHTML += `<div class="random-movie">${movieListElements[Math.floor(Math.random() * size)].childNodes[0].textContent}</div>`;
    }
    randomClicks++;
    if (randomClicks > 5){
        alert("JUST PICK A FREAKING MOVIE ALREADY");
        randomNumButton.disabled=true;
        randomNumButton.style.backgroundImage = "url(pickone.jpeg)";
        randomNumButton.style.width = "300px";
        randomNumButton.style.height = "168px";
        randomNumButton.textContent = "DISABLED";
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
            const title = doc.data().Title;
            allMovies.push(title);
            if (doc.data().watched == true){
                const rating = doc.data().rating;
                watchedMovies.querySelector(`.${rating}-container`).innerHTML += `<div class="${rating} watched-movie" data-movieWatched="${title}
                " watched-movie"> ${title} ${appendStreaming(doc)}<button id="unwatch" data-movie="${title}" disabled=true>Unwatch/Rate</button></div>`;
            }
            else{
                movieList.innerHTML += `<li data-movieUnwatched="${title}"> ${title} ${appendStreaming(doc )} <select data-movie="${title}" id="ratings" disabled=true>
                <option value="null" selected>Select Rating</option>
                <option value="bad">Bad</option>
                <option value="meh">Meh</option>
                <option value="pretty-good">Pretty Good</option>
                <option value="great">Great</option>
                <option value="masterpiece">Masterpiece</option>
                <option value="remove">Remove Movie</option>
                </select>
                </li>`;
            }
        })
    })
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