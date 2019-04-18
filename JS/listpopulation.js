/////////////////////// MOVIE LIST GENERATOR //////////////////////////////////////////
let movieList = document.querySelector(".unwatched-movies");
let watchedMovies = document.querySelector(".watched-movies");
let ratingDropDowns;
let movieObjArray = [];
let streamableMovies = [];
let unwatchedMovies = [];
let allMovies = [];

function generateMovieList(selectedList){
    console.log(selectedList);
    document.querySelectorAll(".rating-container").forEach(container => container.innerHTML = "");
    db.collection(currentUserEmail).doc(selectedList).get().then((doc)=>{
        movieObjArray = doc.data().movieObjArray;
        movieObjArray.sort((a,b) =>{
            return a.title>b.title ? 1:-1
        });
        console.log(movieObjArray);
        movieObjArray.forEach(movieObj =>{
            const title = movieObj.title;
            allMovies.push(title);
            streamCheck(title);
            const rating = movieObj.rating || "";
            if (rating != ""){
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
        });
        generateEventListeners();
    })
}

///////////////////////////////////////////////////////////// LIST SELECT STUFF//////////////////////////////////////////////////////////////////////////////////////////

const listSelect = document.querySelector("#list-select");
const listSelectContainer = document.querySelector(".list-select");
let movieListArray = [];
let currentList = listSelect.value;


function populateListSelect(){
    listSelect.innerHTML = "";
    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete List";
    deleteButton.classList = "list-delete-button";
    
    const addButton = document.createElement('button');
    addButton.textContent = "Add List";
    addButton.classList = "list-add-button";
    listSelectContainer.appendChild(addButton);
    document.querySelector(".list-add-button").addEventListener('click',createNewList);
    
    movieListArray = currentUserObject.movie_list_array;
    movieListArray.forEach(list =>{
        let optionNode = document.createElement('option');
        let optionText = document.createTextNode(list);
        optionNode.appendChild(optionText);
        listSelect.appendChild(optionNode);
    });
    if (movieListArray.length == 0){
        console.log("test");
        listSelect.innerHTML = "<option>Please make a new list to add movies!</option>"
    }
    else{
        listSelectContainer.appendChild(deleteButton);
        document.querySelector(".list-delete-button").addEventListener('click',deleteList)
    }
}

function deleteList(){
    const conf = prompt(`Please type ${currentList} to confirm deletion.`);
    if (conf === currentList){
        movieListArray.splice(movieListArray.indexOf(listSelect.value),1);
        db.collection(currentUserEmail).doc("movie_lists").set({
            movie_list_array: movieListArray
        });
        listSelectContainer.removeChild(document.querySelector(".list-delete-button"));
        listSelectContainer.removeChild(document.querySelector(".list-add-button"));
        populateListSelect();
        currentList = movieListArray[0];
        if (movieListArray.length !== 0){
            changeList();
        }
    }
}
function createNewList(){
    const newListName = prompt("What would you like to name your list?");
    if (newListName.length > 30){
        alert("List name can have a max of 30 characters!");
        return;
    }
    const movieObj = {};
    let newMovieObjArray = [];
    db.collection(currentUserEmail).doc(newListName).set({
        listName: newListName,
        movieObjArray: newMovieObjArray
    }).then(() =>{
        movieListArray.push(newListName);
        db.collection(currentUserEmail).doc("movie_lists").set({
            movie_list_array: movieListArray
        }).then(() => {
            if (movieListArray.length !== 1){
                listSelectContainer.removeChild(document.querySelector(".list-delete-button"))
            }
            listSelectContainer.removeChild(document.querySelector(".list-add-button"));
            populateListSelect();
            listSelect.value = newListName;
            currentList = newListName;
            changeList();
            db.collection("list_index").doc(`${newListName}`).set({
                name: newListName,
                subscribers: 1
            })
            
        })
    })
    
}

function changeList(){
    if (movieListArray.length != 0){
        movieObjArray = [];
        movieList.innerHTML = "";
        streamableMovies = [];
        unwatchedMovies = [];
        allMovies = [];
        currentList = listSelect.value;
        generateMovieList(currentList);
    }
}
///////////////////////////////////////////////////////////////////////////APPEND MOVIES//////////////////////////////////////////////////////////////////////////////////////////////
function appendUnwatchedMovieList(movieTitle){
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

function appendWatchedMovieList(title, rating){
    watchedMovies.querySelector(`.${rating}-container`).innerHTML += `<div class="${rating} watched-movie" data-movieWatched="${title}">
    ${title} ${appendStreaming(pullMovieObjOut(title))}<button id="unwatch" data-movie="${title}" >Unwatch/Rate</button></div>`;
    generateEventListeners();
}