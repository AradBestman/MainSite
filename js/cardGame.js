(() => {
  "use strict";

  const ROUNDS_TO_WIN = 2; // best of 3

  const CARD_IMAGES = [
    "./images/img-1.png",
    "./images/img-2.png",
    "./images/img-3.png",
    "./images/img-4.png",
    "./images/img-5.png",
    "./images/img-6.png",
    "./images/img-7.png",
    "./images/img-8.png",
  ];

  const el = (id) => document.getElementById(id);
  const boxes = document.querySelectorAll(".box");

  let flippedCards = [];
  let locked = true; // blocks clicks until a match has started
  let currentPlayer = 0;
  let roundNumber = 1;

  const players = [
    { name: "Player 1", roundWins: 0, pairs: 0 },
    { name: "Player 2", roundWins: 0, pairs: 0 },
  ];

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

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
    const positions = shuffle(Array.from({ length: boxes.length }, (_, idx) => idx));

    flippedCards = [];
    players[0].pairs = 0;
    players[1].pairs = 0;

    boxes.forEach((box) => {
      box.classList.remove("matched");
      box.firstElementChild.style.display = "none";
    });

    CARD_IMAGES.forEach((image, index) => {
      boxes[positions[index * 2]].firstElementChild.setAttribute("src", image);
      boxes[positions[index * 2 + 1]].firstElementChild.setAttribute("src", image);
    });

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

  const allMatched = () => [...boxes].every((box) => box.classList.contains("matched"));

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
    const loserIndex = winnerIndex === 0 ? 1 : 0;
    players[winnerIndex].roundWins++;

    if (players[winnerIndex].roundWins >= ROUNDS_TO_WIN) {
      el("gameOverText").textContent =
        `${players[winnerIndex].name} wins the match ${players[winnerIndex].roundWins}-${players[loserIndex].roundWins}!`;
      el("gameOverOverlay").hidden = false;
      return;
    }

    el("roundOverlayTitle").textContent = "Round won!";
    el("roundOverlayText").textContent =
      `${players[winnerIndex].name} wins round ${roundNumber} (${players[winnerIndex].pairs}-${players[loserIndex].pairs}).`;
    el("nextRoundBtn").textContent = "Next Round";
    delete el("nextRoundBtn").dataset.replay;
    el("roundOverlay").hidden = false;
  };

  const compareCards = () => {
    locked = true;
    const [first, second] = flippedCards;
    const isMatch =
      first.firstElementChild.getAttribute("src") === second.firstElementChild.getAttribute("src");

    if (isMatch) {
      first.classList.add("matched");
      second.classList.add("matched");
      players[currentPlayer].pairs++;
      flippedCards = [];
      locked = false;

      if (allMatched()) endRound();
    } else {
      setTimeout(() => {
        first.firstElementChild.style.display = "none";
        second.firstElementChild.style.display = "none";
        flippedCards = [];
        currentPlayer = currentPlayer === 0 ? 1 : 0;
        updateScoreboard();
        locked = false;
      }, 500);
    }
  };

  const handleBoxClick = (box) => {
    if (locked) return; // wait for the mismatch animation to finish, or match hasn't started
    if (box.classList.contains("matched")) return; // already solved
    if (box.firstElementChild.style.display === "block") return; // already flipped
    if (flippedCards.includes(box)) return; // same card clicked twice

    box.firstElementChild.style.display = "block";
    flippedCards.push(box);

    if (flippedCards.length === 2) compareCards();
  };

  boxes.forEach((box) => box.addEventListener("click", () => handleBoxClick(box)));

  el("setupForm").addEventListener("submit", (e) => {
    e.preventDefault();
    players[0].name = el("player1Name").value.trim() || "Player 1";
    players[1].name = el("player2Name").value.trim() || "Player 2";

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

  el("newMatchBtn").addEventListener("click", () => window.location.reload());
  el("NewGamebtn").addEventListener("click", () => window.location.reload());
})();
