// Hard code the value of board size
document.documentElement.style.setProperty("--size", 10)

// HTML Element
let boardDOM = document.querySelector(".board")
let subtextDOM = document.querySelector(".subtext")

// My variables
let tileValue = ["mine", "empty", "number"]




// App Flow

boardSetUp()

tileStatusSetup([...document.querySelectorAll(".board div")], "hidden")



// Function: board setup 
function boardSetUp() {
    for(let i = 0; i < 100; i++) {
        let tile = document.createElement("div")
        // Add real status to tiles 
        tile.dataset.value = tileValue[Math.floor(Math.random() * 3)]
        // Right Click Event
        tile.addEventListener("contextmenu" , e => {
            tileMarkedYellow(e)
        })
        // Left Click Event
        tile.addEventListener("click" , e => {
            if(e.target.dataset.status == "marked") {
                return 
            } else {
                checkTileValue(e.target)
            }
        })
        boardDOM.appendChild(tile)
    }
}




// Function: set up tile status 
function tileStatusSetup(tile, status) {
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
    e.target.dataset.status == "marked" ? tileStatusSetup(e.target, "hidden") : tileStatusSetup(e.target, "marked")
}




// Function: check tile value
function checkTileValue(tile) {
    if(tile.dataset.value == tileValue[0]) {
        processMineTile()
    } else if(tile.dataset.value == tileValue[1]) {
        console.log("tile is empty")
    } else {
        console.log("tile has number")
    }
}




// Function: process mine tile
function processMineTile() {
    subtextDOM.innerText = "You lost !!!"
    document.querySelectorAll(".board div").forEach(tile => {
        tile.dataset.value == tileValue[0] && tileStatusSetup(tile, "mine")
    })
}