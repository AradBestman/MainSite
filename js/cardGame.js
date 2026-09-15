
const ROUNDS_TO_WIN = 2; // best of 3

let myCard = [];
let myBox = document.querySelectorAll(".box");
let Arr = [
  "./images/img-1.png",
  "./images/img-2.png",
  "./images/img-3.png",
  "./images/img-4.png",
  "./images/img-5.png",
  "./images/img-6.png",
  "./images/img-7.png",
  "./images/img-8.png",
];

let locked = true; // blocks clicks until a match has started
let currentPlayer = 0;
let roundNumber = 1;
let players = [
  { name: "Player 1", roundWins: 0, pairs: 0 },
  { name: "Player 2", roundWins: 0, pairs: 0 },
];

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const el = (id) => document.getElementById(id);

const updateScoreboard = () => {
  el("playerName0").textContent = players[0].name;
  el("playerName1").textContent = players[1].name;
  el("playerRounds0").textContent = `Rounds: ${players[0].roundWins}`;
  el("playerRounds1").textContent = `Rounds: ${players[1].roundWins}`;
  el("roundLabel").textContent = `Round ${roundNumber} of 3`;

  el("playerCard0").classList.toggle("active-turn", currentPlayer === 0);
  el("playerCard1").classList.toggle("active-turn", currentPlayer === 1);
};

const dealBoard = () => {
  let numbersArr = Array.from({ length: myBox.length }, (_, idx) => idx);
  shuffle(numbersArr);

  myCard = [];
  players[0].pairs = 0;
  players[1].pairs = 0;

  myBox.forEach((box) => {
    box.classList.remove("matched");
    box.firstElementChild.style.display = "none";
  });

  let i = 0;
  for (let item of Arr) {
    myBox[numbersArr[i]].firstElementChild.setAttribute("src", item);
    myBox[numbersArr[i + 1]].firstElementChild.setAttribute("src", item);
    i += 2;
  }

  locked = false;
};

const startRound = () => {
  dealBoard();
  updateScoreboard();
  el("roundOverlay").hidden = true;
  el("gameOverOverlay").hidden = true;
};

const startMatch = () => {
  players[0].roundWins = 0;
  players[1].roundWins = 0;
  roundNumber = 1;
  currentPlayer = 0;
  startRound();
};

const allMatched = () =>
  Array.from(myBox).every((box) => box.classList.contains("matched"));

const endRound = () => {
  locked = true;

  if (players[0].pairs === players[1].pairs) {
    el("roundOverlayTitle").textContent = "Round tied!";
    el("roundOverlayText").textContent =
      "Both players found the same number of pairs. Replay this round.";
    el("nextRoundBtn").textContent = "Replay Round";
    el("nextRoundBtn").dataset.replay = "true";
    el("roundOverlay").hidden = false;
    return;
  }

  const winnerIndex = players[0].pairs > players[1].pairs ? 0 : 1;
  players[winnerIndex].roundWins++;

  if (players[winnerIndex].roundWins >= ROUNDS_TO_WIN) {
    el("gameOverText").textContent =
      `${players[winnerIndex].name} wins the match ${players[winnerIndex].roundWins}-${players[winnerIndex === 0 ? 1 : 0].roundWins}!`;
    el("gameOverOverlay").hidden = false;
    return;
  }

  el("roundOverlayTitle").textContent = "Round won!";
  el("roundOverlayText").textContent =
    `${players[winnerIndex].name} wins round ${roundNumber} (${players[winnerIndex].pairs}-${players[winnerIndex === 0 ? 1 : 0].pairs}).`;
  el("nextRoundBtn").textContent = "Next Round";
  delete el("nextRoundBtn").dataset.replay;
  el("roundOverlay").hidden = false;
};

const compareToCard = (card) => {
  myCard.push(card);
  if (myCard.length == 2) {
    locked = true;
    if (
      myCard[0].firstElementChild.getAttribute("src") !=
      myCard[1].firstElementChild.getAttribute("src")
    ) {
      setTimeout(() => {
        myCard[0].firstElementChild.style.display = "none";
        myCard[1].firstElementChild.style.display = "none";
        myCard = [];
        currentPlayer = currentPlayer === 0 ? 1 : 0;
        updateScoreboard();
        locked = false;
      }, 500);
    } else {
      myCard[0].classList.add("matched");
      myCard[1].classList.add("matched");
      players[currentPlayer].pairs++;
      myCard = [];
      locked = false;

      if (allMatched()) {
        endRound();
      }
    }
  }
};

window.addEventListener("load", () => {
  for (let box of myBox) {
    box.addEventListener("click", () => {
      if (locked) return; // wait for the mismatch animation to finish, or match hasn't started
      if (box.classList.contains("matched")) return; // already solved
      if (box.firstElementChild.style.display === "block") return; // already flipped
      if (myCard.includes(box)) return; // same card clicked twice

      box.firstElementChild.style.display = "block";
      compareToCard(box);
    });
  }

  el("setupForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name1 = el("player1Name").value.trim() || "Player 1";
    const name2 = el("player2Name").value.trim() || "Player 2";
    players[0].name = name1;
    players[1].name = name2;

    el("setupScreen").hidden = true;
    el("gameScreen").hidden = false;
    startMatch();
  });

  el("nextRoundBtn").addEventListener("click", () => {
    if (el("nextRoundBtn").dataset.replay !== "true") {
      roundNumber++;
      currentPlayer = currentPlayer === 0 ? 1 : 0; // loser of the previous round starts next
    }
    startRound();
  });

  el("newMatchBtn").addEventListener("click", () => {
    window.location.reload();
  });

  el("NewGamebtn").addEventListener("click", () => {
    window.location.reload();
  });
});
