// Hard code the value of board size
document.documentElement.style.setProperty("--size", 10)

// HTML Element
let boardDOM = document.querySelector(".board")




// App Flow

boardSetUp()

tileStatusSetup("hidden", [...document.querySelectorAll(".board div")])



// Function: board setup 
function boardSetUp() {
    for(let i = 0; i < 100; i++) {
        let tile = document.createElement("div")
        tile.addEventListener("contextmenu" , e => {
            tileMarkedYellow(e)
        })
        boardDOM.appendChild(tile)
    }
}




// Function: set up tile status 
function tileStatusSetup(status, tile) {
    // If you want to change multiple tiles
    if(Array.isArray(tile)) {
        tile.forEach(individualTile => {
            individualTile.dataset.status = status
        })
    // If you want to change only one tile
    } else {
        tile.dataset.status = status
    }
}




// Function: tile is marked
function tileMarkedYellow(e) {
    e.preventDefault()
    tileStatusSetup("marked", e.target)
}