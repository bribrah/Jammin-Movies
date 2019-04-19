



/////////////////////////////////UTILITY///////////////////////////////////////////////////////////////////////

function generateEventListeners(){
    ratingDropDowns = document.querySelectorAll("#ratings");
    ratingDropDowns.forEach(menu => menu.addEventListener('change', rate));
    unrateButtons = document.querySelectorAll("#unwatch");
    unrateButtons.forEach(button => button.addEventListener('click',unrate))
}

function appendInfo(movie){
    let append = ""
    runTime = movie.runTime;
    //ratings
    const imdb = movie.imdb
    const RT = movie.RT
    const metaCritic = movie.metaCritic;
    if(imdb){
        append += `<div class="rating-append">IMDB: ${imdb}</div>`
    }
    if (RT){
        append += `<div class="rating-append">Rotten Tomatoes: ${RT}</div>`
    }
    if(metaCritic){
        append += `<div class="rating-append">Meatcritic: ${metaCritic}</div>`
    }
    //runtime
    append += `<div class="rating-append">Runtime: ${runTime}</div>`
    //plot
    append += `<div class="plot-append">${movie.plot}</div>`
    return append;
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
    return movieObjArray.find(obj => obj.title == movieTitle);
}

function findMovieObjIndex(movie){
    return movieObjArray.findIndex(obj => obj.title == movie)
    
}


//TEMPORARY FUNCTION TO UPDATE PREEXISTING LISTS.
function updateMovieObjs(){
    movieObjArray.forEach(movieObj =>{
        fetch(`https://www.omdbapi.com/?t=${movieObj.title}&apikey=7b75867a`).then(response => response.json()).then(movie =>{
        movieJSON = movie;
    }).then( () =>{
        console.log(movieJSON)
        const ratings = movieJSON.Ratings;
        const imdb = ratings.find(rating => rating.Source == "Internet Movie Database");
        const RT = ratings.find(rating => rating.Source == "Rotten Tomatoes");
        const metaCritic = ratings.find(rating => rating.Source == "Metacritic");
        imdb ? imdbRating = imdb.Value : imdbRating = "NA";
        RT ? RTRating = RT.Value : RTRating = "NA";
        metaCritic ? metaCriticRating = metaCritic.Value: metaCriticRating = "NA"
        movieObj.imdb = imdbRating;
        movieObj.RT = RTRating;
        movieObj.metaCritic = metaCriticRating;
        movieObj.runTime = movieJSON.Runtime;
        movieObj.plot = movieJSON.Plot;
    })
})
db.collection(currentUserEmail).doc(currentList).update({
    movieObjArray: movieObjArray
})

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
        movieObj.onHulu = true;
    }
    else if (huluTitles.indexOf(movie.toLowerCase()) == -1 && movieObj.onHulu){
        movieObj.onHulu = false;
        
    }
    if (hboTitles.indexOf(movie.toLowerCase()) > -1 && !movieObj.onHbo){
        movieObj.onHbo = true;
    }
    else if (hboTitles.indexOf(movie.toLowerCase()) == -1 && movieObj.onHbo){
        movieObj.onHbo = false;
        
    }
    
    if (amazonTitles.indexOf(movie.toLowerCase()) > -1 && !movieObj.onAmazon){
        movieObj.onAmazon = true;
        
    }
    else if (amazonTitles.indexOf(movie.toLowerCase()) == -1 && movieObj.onAmazon){
        movieObj.onAmazon = false;
    }
    
    if (netflixTitles.indexOf(movie.toLowerCase()) > -1 && !movieObj.onNetflix){
        movieObj.onNetflix = true;
    }
    else if (netflixTitles.indexOf(movie.toLowerCase()) == -1 && movieObj.onNetflix){
        movieObj.onNetflix = false;
    }
    if ((movieObj.onNetflix || movieObj.onHulu || movieObj.onAmazon ||movieObj.onHbo) && (!movieObj.rating || movieObj.rating == "")){
        streamableMovies.push(movieObj.title)
    }
    
}


function appendStreaming(movie){
    let append= "";
    
    if (movie.onNetflix){
        append += " <img src='images/netflix-icon.png' class='stream-icon'>"
    }
    if(movie.onHulu){
        append += "<img src='images/hulu-icon.png' class='stream-icon'>"
    }
    if(movie.onAmazon){
        append += "<img src='images/amazon-icon.png' class='stream-icon'>"
    }
    if(movie.onHbo){
        append += "<img src='images/hbo-icon.png' class='stream-icon'>"
    }
    return append;
}

//////////////////////// RANDOM NUMBER GENERATOR //////////////////////////
const randomNumButton = document.querySelector("#random");
const randomNumDisplay = document.querySelector(".rand-gen-display");
const streamableCheckbox = document.querySelector("#stream-only");
let randomClicks = 0;

function appendRandom(title){
    randomNumDisplay.innerHTML+= `<div class="random-movie"><div class="dropdown"><span class="random-title">${title}</span>${appendStreaming(pullMovieObjOut(title))}
    <div class="dropdown-content">${appendInfo(pullMovieObjOut(title))}</div></div></div>`;
}

function generateRandom(){
    if (randomClicks == 0){
        randomNumDisplay.innerHTML = "";
    }
    if (streamableCheckbox.checked == true){
        const size = streamableMovies.length;
        const randomNum = Math.floor(Math.random() * size);
        const title = streamableMovies[randomNum];
        appendRandom(title)
        streamableMovies.splice(streamableMovies.indexOf(title),1);
    }
    else{
        const size = unwatchedMovies.length;
        const randomNum = Math.floor(Math.random() * size);
        const title = unwatchedMovies[randomNum];
        appendRandom(title);
        unwatchedMovies.splice(unwatchedMovies.indexOf(title),1)
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
const addMovieText = document.querySelector("#add-movie");
const suggestions = document.querySelector(".suggestions");

let lastSuggestionArray = [];

addMovieText.addEventListener('keyup',displayMatches);

function displayMatches(e){
    setTimeout( () =>{
        suggestions.innerHTML = "";
        if (e){
            fetch(`https://www.omdbapi.com/?s=${this.value}&type=movie&apikey=7b75867a`).then(response => response.json()).then(searchResults =>{
                const movies = searchResults.Search;
                console.log(movies);
                movies.forEach(movie =>{
                    suggestions.innerHTML += `<li class="name-suggestion"><img src="${movie.Poster}"> <span>${movie.Title}</span>(${movie.Year})</li>`
                })
                const titleSuggestions = document.querySelectorAll(".name-suggestion");
                titleSuggestions.forEach(suggestion=> suggestion.addEventListener("click", clickedSuggestion));
            })
        }
    },500)
}

function clickedSuggestion(e){
    console.log(this.querySelector("span").textContent)
    addMovieText.value = this.querySelector("span").textContent;
    displayMatches();
}


///////////////////////// ADD MOVIES ///////////////////////////////////////////

function addMovie(){
    let movieTitle = addMovieText.value;
    let searchResponse;
    
    fetch(`https://www.omdbapi.com/?t=${movieTitle}&apikey=7b75867a`).then(response => response.json()).then(movie =>{
    movieJSON = movie;
}).then( () =>{
    const ratings = movieJSON.Ratings;
    const imdb = ratings.find(rating => rating.Source == "Internet Movie Database");
    const RT = ratings.find(rating => rating.Source == "Rotten Tomatoes");
    const metaCritic = ratings.find(rating => rating.Source == "Metacritic");
    imdb ? imdbRating = imdb.Value : imdbRating = "NA";
    RT ? RTRating = RT.Value : RTRating = "NA";
    metaCritic ? metaCriticRating = metaCritic.Value: metaCriticRating = "NA"
    movieObj = {
        title: movieTitle,
        imdb: imdbRating,
        RT: RTRating,
        metaCritic: metaCriticRating || "",
        runTime: movieJSON.Runtime,
        plot: movieJSON.Plot
    };
    unwatchedMovies.push(movieTitle);
    movieObjArray.push(movieObj);
    streamCheck(movieTitle);
    appendUnwatchedMovieList(movieTitle);
    db.collection(currentUserEmail).doc(currentList).update({
        movieObjArray: movieObjArray
    })
    .then(() => console.log("document written"))
    .catch(() => console.error("doc writing error"));
    addMovieText.value = ""
})

}

addMovieButton.addEventListener("click", addMovie);

/////////////////////////// RATING SYSTEM ////////////////////////////////



function rate(e){
    const movie = this.dataset.movie;
    
    
    if (this.value=="remove"){
        movieObjArray.splice(findMovieObjIndex(movie),1);
        db.collection(currentUserEmail).doc(currentList).update({
            movieObjArray: movieObjArray
        });
    }
    else{
        movieObjArray[findMovieObjIndex(movie)].rating = this.value;
        db.collection(currentUserEmail).doc(currentList).update({
            movieObjArray: movieObjArray
        })
    }
    const movieListElement = document.querySelector(`[data-movieUnwatched = "${movie}"]`);
    movieList.removeChild(movieListElement);
    if (this.value != "remove"){
        appendWatchedMovieList(movie, this.value);
    }
    generateEventListeners();
    
}

function unrate(e){
    const movie = this.dataset.movie;
    movieObjArray[findMovieObjIndex(movie)].rating = "";
    db.collection(currentUserEmail).doc(currentList).update({
        movieObjArray: movieObjArray
    });
    const listElement = watchedMovies.querySelector(`[data-moviewatched="${movie}"]`);
    const rating = listElement.classList[0];
    watchedMovies.querySelector(`.${rating}-container`).removeChild(listElement);
    appendUnwatchedMovieList(movie);
}