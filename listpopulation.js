/////////////////////// MOVIE LIST GENERATOR //////////////////////////////////////////
let movieList = document.querySelector(".unwatched-movies");
let watchedMovies = document.querySelector(".watched-movies");
let ratingDropDowns;
let movieObjArray = []
let streamableMovies = [];
let unwatchedMovies = [];
let allMovies = [];

function generateMovieList(selectedList){
    
    document.querySelectorAll(".rating-container").forEach(container => container.innerHTML = "")
    const movies = db.collection(selectedList).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            movieObj ={
                title: doc.data().Title,
                watched: doc.data().watched,
                rating: doc.data().rating,
                onHulu: doc.data().onHulu,
                onAmazon: doc.data().onAmazon,
                onNetflix: doc.data().onNetflix
            };
            movieObjArray.push(movieObj);
            const title = movieObj.title;
            allMovies.push(title);
            if (movieObj.watched == true){
                const rating = movieObj.rating;
                watchedMovies.querySelector(`.${rating}-container`).innerHTML += `<div class="${rating} watched-movie" data-movieWatched="${title}">
                ${title} ${appendStreaming(movieObj)}<button id="unwatch" data-movie="${title}" >Unwatch/Rate</button></div>`;
            }
            else{
                unwatchedMovies.push(title);
                movieList.innerHTML += `<li data-movieUnwatched="${title}"> ${title} ${appendStreaming(movieObj)} <select data-movie="${title}" id="ratings" >
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
        generateEventListeners();
    })
    
}

///////////////////////////////////////////////////////////// LIST SELECT STUFF//////////////////////////////////////////////////////////////////////////////////////////

const listSelect = document.querySelector("#list-select")
let movieListArray = []
let currentList;


function populateListSelect(){
    listSelect.innerHTML = "";
    movieListArray = currentUserObject.movie_list_array
    movieListArray.forEach(list =>{
        let optionNode = document.createElement('option');
        let optionText = document.createTextNode(list);
        optionNode.appendChild(optionText);
        listSelect.appendChild(optionNode);
    })
    let addNewNode = document.createElement('option');
    let addNewText = document.createTextNode("Create new List")
    addNewNode.appendChild(addNewText);
    listSelect.appendChild(addNewNode);
}

function createNewList(){
    const newListName = prompt("What would you like to name your list?")
    listSelect.removeChild(listSelect.lastChild);
    db.collection(newListName).doc("Movie Filler you can Remove").set({
        Title: "Movie Filler you can Remove"
    }).then(() =>{
        db.collection(newListName).doc("Movie Filler you can Remove").delete().then(()=> {
            
            movieListArray.push(newListName);
            db.collection(currentUserEmail).doc("movie_lists").set({
                movie_list_array: movieListArray
            }).then(() => {
                let optionNode = document.createElement('option');
                let optionText = document.createTextNode(newListName);
                optionNode.appendChild(optionText);
                listSelect.appendChild(optionNode);
                listSelect.value = newListName;
                let addNewNode = document.createElement('option');
                let addNewText = document.createTextNode("Create new List")
                addNewNode.appendChild(addNewText);
                listSelect.appendChild(addNewNode);
                generateMovieList(newListName);
            })
        })
    })
    
}

function changeList(){
    if (listSelect.value != "Create new List"){
        movieObjArray = []
        movieList.innerHTML = "";
        streamableMovies = [];
        unwatchedMovies = [];
        allMovies = [];
        currentList = listSelect.value;
        generateMovieList(currentList);
    }
    else{
        createNewList();
    }
}
///////////////////////////////////////////////////////////////////////////APPEND MOVIES//////////////////////////////////////////////////////////////////////////////////////////////
function appendUnwatchedMovieList(movieTitle){
    movieObj = {
        title: movieTitle
    }
    movieObjArray.push(movieObj);
    streamCheck(movieTitle);
    movieList.innerHTML += `<li data-movieUnwatched="${movieTitle}"> ${movieTitle} <select data-movie="${movieTitle}" id="ratings">
    <option value="null" selected>Select Rating</option>
    <option value="bad">Bad</option>
    <option value="meh">Meh</option>
    <option value="pretty-good">Pretty Good</option>
    <option value="great">Great</option>
    <option value="masterpiece">Masterpiece</option>
    <option value="remove">Remove Movie</option>
    </select>${appendStreaming(pullMovieObjOut(movieTitle))}</li>`;
    
    
    generateEventListeners();
}

function appendWatchedMovieList(movieTitle, rating){
    watchedMovies.querySelector(`.${rating}-container`).innerHTML += `<div class="${rating} watched-movie" data-movieWatched="${movieTitle}
    " watched-movie"> ${movieTitle} <button id="unwatch" data-movie="${movieTitle}">Unwatch/Rate</button></div>`;
    generateEventListeners();
}