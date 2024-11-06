let whoPlayNow; 
let popup = document.querySelector("#popup");
let close = document.querySelectorAll('.close');

const ifEndGame = () => {

    let whoWonTheGame;
 
    let cells = document.querySelectorAll("#gamerDiv > div"); // get all cells
    if (!cells || cells.length !== 9) {
        return;
    }
    //*check vertical
   
    for (let i = 0; i <= 2; i++) {
        if (
            cells[i].innerHTML == cells[i + 3].innerHTML &&
            cells[i + 3].innerHTML == cells[i + 6].innerHTML &&
            cells[i].innerHTML
        ) {
            
            whoWonTheGame = cells[i].innerHTML;
        }
    }
    //*check horizontal
    for (let i = 0; i < 9; i += 3) {
        // i += 3 => i = i + 3
        if (
            cells[i].innerHTML == cells[i + 1].innerHTML &&
            cells[i + 1].innerHTML == cells[i + 2].innerHTML &&
            cells[i].innerHTML
        ) {
            
            whoWonTheGame = cells[i].innerHTML;
        }
    }
    //*check diagonal
    // \
    let i = 0;
    if (
        cells[i].innerHTML == cells[i + 4].innerHTML &&
        cells[i + 4].innerHTML == cells[i + 8].innerHTML &&
        cells[i].innerHTML
    ) {
        
        whoWonTheGame = cells[i].innerHTML;
    }
    i = 2;
    if (
        cells[i].innerHTML == cells[i + 2].innerHTML &&
        cells[i + 2].innerHTML == cells[i + 4].innerHTML &&
        cells[i].innerHTML
    ) {
        
        whoWonTheGame = cells[i].innerHTML;
    }
    //*check if game end and someone won or even

    if (whoWonTheGame) {
        popup.style.display = "block";
        popup.innerHTML = `${whoWonTheGame} won the game`;
    } else {
        for (let cell of cells) {
            if (!cell.innerHTML) {
                return; 
            }
        }
        popup.style.display = "block";
        popup.innerHTML = "no one won the game";
    }
};

const handleClickXO = (myE) => {

    if (myE.target.innerHTML != "") {
        //the div has x or o
        return; // stop here
    }
    
    myE.target.innerHTML = whoPlayNow;
    whoPlayNow == "x" ? (whoPlayNow = "o") : (whoPlayNow = "x");
    ifEndGame();
};

const initPageLoad = () => {
    //set click on every cell
    let cells = document.querySelectorAll("#gamerDiv > div");
    for (let myDiv of cells) {
        myDiv.addEventListener("click", handleClickXO);
    }
};

const newGame = () => {
    whoPlayNow = "x"; 
    let cells = document.querySelectorAll("#gamerDiv > div"); 
    for (let cell of cells) {
        cell.innerHTML = "";
        
    }
    popup.style.display = "none";
};

window.addEventListener("load", () => {
    initPageLoad();
    newGame();
    document.getElementById("playAgainBtn").addEventListener("click", () => {
        newGame();
    });
});

