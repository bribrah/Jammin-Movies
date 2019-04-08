const display = document.querySelector(".list-index");
const db = firebase.firestore();
let allLists = []

populateListIndex();

function appendSubscribe(){
    let append =""
    if (currentUserEmail != ""){
        append =  "<button class='subscribe'>Subscribe to this list</button>"
    }
    return append
}
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
            display.innerHTML+= `<div class='list-node'><a class='list-link'><span>${list.name}</span>: ${list.subscribers} subscribers</a>${appendSubscribe()}</div`
        })
        document.querySelectorAll(".list-link").forEach(link => link.addEventListener('click', ()=>showList(link.querySelector("span").textContent)));
    })
}
function showList(listName){
    display.innerHTML = "";
    db.collection(listName).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            const movieObj = doc.data()
            display.innerHTML+= `<div>${movieObj.Title}</div>`
        })
        display.innerHTML += "<button class='back-button'>Back to List Index</button>"
        document.querySelector(".back-button").addEventListener('click', populateListIndex);
    })
}
