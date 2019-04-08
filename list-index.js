const display = document.querySelector(".list-index");
const db = firebase.firestore();
let allLists = []

populateListIndex();
function populateListIndex(){
    display.innerHTML = ""
    db.collection("list_index").get().then(querySnapshot =>{
        if (allLists.length == 0){

            querySnapshot.forEach(doc =>{
                allLists.push(doc.data());
            })
            allLists.sort((a,b) =>{
                return (a.subscribers < b.subscribers ? 1: -1);
            })
        }
        allLists.forEach(list =>{
            display.innerHTML+= `<div class='list-node'><a class='list-link'>${list.name}</a>: ${list.subscribers} subscribers </div>`
        })
        document.querySelectorAll(".list-link").forEach(link => link.addEventListener('click', ()=>showList(link.textContent)));
    })
}
function showList(listName){
    display.innerHTML = "";
    db.collection(listName).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            const movieObj = doc.data()
            display.innerHTML+= `<div>${movieObj.Title}</div>`
        })
        display.innerHTML += "<div class='back-button'>Back to List Index</div>"
        document.querySelector(".back-button").addEventListener('click', populateListIndex);
    })
}
