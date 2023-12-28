// HTML Element
let boardDOM = document.querySelector(".board")
let subtextDOM = document.querySelector(".subtext")

// My variables
let tileValue = ["mine", "number"]
let gridSize = 10
let mineNumber = gridSize
let lost = false

// Hard code the value of board size
document.documentElement.style.setProperty("--size", gridSize)




// App Flow

subtextDOM.innerText = `Mines Left: ${mineNumber}`

boardSetUp()

tileStatusSetup([...document.querySelectorAll(".board div")], "hidden")

setupTileMineValue(mineNumber)

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
            tile.dataset.value = "number"
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
                    checkWinningCondition()
                }
            })
            // Append tile to the board
            boardDOM.appendChild(tile)
        }
    }
}




// Function: check if the player won 
function checkWinningCondition() {
    let allNumberStatusTiles = [...document.querySelectorAll(".board div")].filter(tile => tile.dataset.valueNumber)
    if(!allNumberStatusTiles.find(tile => tile.dataset.status == "hidden")) {
        subtextDOM.innerText = "You won !!!"
        document.querySelectorAll(".board div").forEach(tile => {
            tile.dataset.value == tileValue[0] && tileStatusSetup(tile, "mine")
        })
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

    let markedTiles = [...document.querySelectorAll(".board div")].filter(tile => tile.dataset.status == "marked")
    subtextDOM.textContent = `Mines Left: ${mineNumber - markedTiles.length}`
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
        emptySpaceExpansion(tile.dataset.col, tile.dataset.row)
    }
}




// Function: show all adjacent tiles when user clicked the tile without any mines surrounding it  
function emptySpaceExpansion(col, row) {
    // Convert col and row to number
    col = parseInt(col);
    row = parseInt(row);
    
    // Get the current tile
    let tile = document.querySelector(`.board div[data-col="${col}"][data-row="${row}"]`);

    // Make sure the tile is in the board
    if (tile) {
        // Reveal Tile
        tileStatusSetup(tile, "number");
        if(tile.dataset.valueNumber != 0) {
            tile.textContent = tile.dataset.valueNumber
        }

        // Check if tile is empty or not 
        if (tile.dataset.valueNumber == 0) {
            // Get adjacent tiles
            let adjacentTiles = getAdjacentTiles(col, row);

            // Recursively call emptySpaceExpansion for each adjacent tile
            adjacentTiles.forEach(adjacentTile => {
                if(adjacentTile.dataset.status == "hidden") {
                    emptySpaceExpansion(adjacentTile.dataset.col, adjacentTile.dataset.row);
                }
            });
        }
    }
}




// Function: choose 10 random tile for mines
function setupTileMineValue(mineNumber) {
    for(let i = 0; i < mineNumber; i++) {
        let randomCol = Math.floor(Math.random() * (mineNumber - 1 + 1)) + 1
        let randomRow = Math.floor(Math.random() * (mineNumber - 1 + 1)) + 1
        document.querySelectorAll(".board div").forEach(tile => {
            if(tile.dataset.col == randomCol && tile.dataset.row == randomRow) {
                tile.dataset.value = "mine"
            }
        })
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