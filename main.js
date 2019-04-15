



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
    return movieObjArray.find(obj => obj.title == movieTitle);
}

function findMovieObjIndex(movie){
    return movieObjArray.findIndex(obj => obj.title == movie)

}

function updateMoviesList(){
    let movieObjs = [];
    db.collection("Movies").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let obj;
            if (doc.data().rating){
                obj = {
                    title: doc.data().Title,
                    rating: doc.data().rating
                }
            }
            else{
                obj = {
                    title: doc.data().Title,
                }
            }
            movieObjs.push(obj)
        })
        db.collection("cheesemas46@gmail.com").doc("Movies").update({
            movieObjArray: movieObjs
        })
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
        console.log(title)
        streamableMovies.splice(randomNum,1);
        randomNumDisplay.innerHTML+= `<div class="random-movie"><a href="https://www.rottentomatoes.com/search/?search=${title}" target="_blank">${title}</a>${appendStreaming(pullMovieObjOut(title))}</div>`;
    }
    else{
        const size = unwatchedMovies.length;
        const randomNum = Math.floor(Math.random() * size);
        const title = unwatchedMovies[randomNum];
        unwatchedMovies.splice(randomNum,1);
        randomNumDisplay.innerHTML+= `<div class="random-movie"><a href="https://www.rottentomatoes.com/search/?search=${title}" target="_blank">${title}</a>${appendStreaming(pullMovieObjOut(title))}</div>`;
        
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
    return streamableMovies.filter(movie => {
        const regex = new RegExp(wordToMatch, 'gi');
        return movie.match(regex);
    });
}

function displayMatches(e){
    let matchArray = [];
    if (e){

        if (e.key =="Backspace" || addMovieText.value.length <= 1){
            matchArray = findMatches(this.value,allStreamableMovies);
            
        }
        else{
            matchArray = findMatches(this.value,lastSuggestionArray);
        }
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
    displayMatches();
}


///////////////////////// ADD MOVIES ///////////////////////////////////////////

function addMovie(){
    let movieTitle = addMovieText.value;
    movieObj = {
        title: movieTitle
    }
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
}

addMovieButton.addEventListener("click", addMovie);

/////////////////////////// RATING SYSTEM ////////////////////////////////



function rate(e){
    const movie = this.dataset.movie;
    
    
    if (this.value=="remove"){
        movieObjArray.splice(findMovieObjIndex(movie),1)
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
    const movieListElement = document.querySelector(`[data-movieUnwatched = "${movie}"]`)
    movieList.removeChild(movieListElement);
    if (this.value != "remove"){
        appendWatchedMovieList(movie, this.value);
    }
    generateEventListeners();
    
}

function unrate(e){
    const movie = this.dataset.movie;
    console.log(movie)
    movieObjArray[findMovieObjIndex(movie)].rating = "";
    db.collection(currentUserEmail).doc(currentList).update({
        movieObjArray: movieObjArray
    })
    const listElement = watchedMovies.querySelector(`[data-moviewatched="${movie}"]`);
    const rating = listElement.classList[0];
    console.log(listElement);
    watchedMovies.querySelector(`.${rating}-container`).removeChild(listElement);
    appendUnwatchedMovieList(movie);
}