// HTML Element
let boardDOM = document.querySelector(".board")
let subtextDOM = document.querySelector(".subtext")

// My variables
let tileValue = ["mine", "number"]
let gridSize = 10
let lost = false

// Hard code the value of board size
document.documentElement.style.setProperty("--size", gridSize)




// App Flow

boardSetUp()

tileStatusSetup([...document.querySelectorAll(".board div")], "hidden")

setupTileNumberValue()



// Function: board setup 
function boardSetUp() {
    for(let row = 0; row < gridSize; row++) {
        for(let col = 0; col < gridSize; col++) {
            // Create an empty tile
            let tile = document.createElement("div")
            // Add position to tile
            tile.dataset.col = col + 1
            tile.dataset.row = row + 1
            // Add value to tiles 
            tile.dataset.value = tileValue[Math.floor(Math.random() * tileValue.length)]
            // Right Click Event
            tile.addEventListener("contextmenu" , e => {
                tileMarkedYellow(e)
            })
            // Left Click Event
            tile.addEventListener("click" , e => {
                if(e.target.dataset.status == "marked" || lost) {
                    return 
                } else {
                    checkTileValue(e.target)
                }
            })
            // Append tile to the board
            boardDOM.appendChild(tile)
        }
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
        processNumberTile(tile)
    } 
}




// Function: process mine tile
function processMineTile() {
    subtextDOM.innerText = "You lost !!!"
    document.querySelectorAll(".board div").forEach(tile => {
        tile.dataset.value == tileValue[0] && tileStatusSetup(tile, "mine")
    })
    lost = true
}




// Function: process tile with number status 
function processNumberTile(tile) {
    if(parseInt(tile.dataset.valueNumber) > 0) {
        tileStatusSetup(tile, "number")
        tile.textContent = tile.dataset.valueNumber
    } else {
        console.log("not having number")
    }
}




// Function: set up number of mines surrounding a tile
function setupTileNumberValue() {
    document.querySelectorAll(".board div").forEach(tile => {
        if(tile.dataset.value == "number") {
            // Get adjacent tiles
            let adjacentTiles = getAdjacentTiles(tile.dataset.col, tile.dataset.row)
            // Check mine number
            let mineNumber = 0
            adjacentTiles.forEach(adjacentTile => adjacentTile.dataset.value == "mine" && ++mineNumber)
            tile.dataset.valueNumber = mineNumber
        }
    })
}




// Function: get adjacent tiles
function getAdjacentTiles(col, row) {
    // Convert col and row to number
    col = parseInt(col)
    row = parseInt(row)
    // Get all tiles
    let tiles = document.querySelectorAll(".board div")
    // Create adjacent tile array
    let adjacentTiles = []
    // Get above tile
    if(row > 1) {
        tiles.forEach(tile => (tile.dataset.col == col && tile.dataset.row == row-1) && adjacentTiles.push(tile))
    }
    // Get left tile
    if(col > 1) {
        tiles.forEach(tile => (tile.dataset.col == col-1 && tile.dataset.row == row) && adjacentTiles.push(tile))
    }
    // Get right tile
    if(col < gridSize) {
        tiles.forEach(tile => (tile.dataset.col == col+1 && tile.dataset.row == row) && adjacentTiles.push(tile))
    }
    // Get bottom tile
    if(row < gridSize) {
        tiles.forEach(tile => (tile.dataset.col == col && tile.dataset.row == row+1) && adjacentTiles.push(tile))
    }
    // Get top left tile
    if(col > 1 && row > 1) {
        tiles.forEach(tile => (tile.dataset.col == col-1 && tile.dataset.row == row-1) && adjacentTiles.push(tile))
    }
    // Get bottom left tile
    if(col > 1 && row < gridSize) {
        tiles.forEach(tile => (tile.dataset.col == col-1 && tile.dataset.row == row+1) && adjacentTiles.push(tile))
    }
    // Get top right tile
    if(col < gridSize && row > 1) {
        tiles.forEach(tile => (tile.dataset.col == col+1 && tile.dataset.row == row-1) && adjacentTiles.push(tile))
    }
    // Get bottom right tile
    if(col < gridSize && row < gridSize) {
        tiles.forEach(tile => (tile.dataset.col == col+1 && tile.dataset.row == row+1) && adjacentTiles.push(tile))
    }
    // Return adjacent tiles
    return adjacentTiles
}