(() => {
  "use strict";

  const WIN_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];

  const popup = document.querySelector("#popup");
  const closeButtons = document.querySelectorAll(".close");
  const cells = document.querySelectorAll("#gamerDiv > div");
  const playAgainBtn = document.getElementById("playAgainBtn");

  let currentPlayer;

  const getWinner = () => {
    for (const [a, b, c] of WIN_PATTERNS) {
      const mark = cells[a].textContent;
      if (mark && mark === cells[b].textContent && mark === cells[c].textContent) {
        return mark;
      }
    }
    return null;
  };

  const showPopup = (message) => {
    popup.textContent = message;
    popup.style.display = "block";
  };

  const checkGameEnd = () => {
    const winner = getWinner();
    if (winner) {
      showPopup(`${winner} won the game`);
      return;
    }

    const boardIsFull = [...cells].every((cell) => cell.textContent);
    if (boardIsFull) {
      showPopup("no one won the game");
    }
  };

  const handleCellClick = (e) => {
    const cell = e.target;
    if (cell.textContent) return; // already played

    cell.textContent = currentPlayer;
    currentPlayer = currentPlayer === "x" ? "o" : "x";
    checkGameEnd();
  };

  const newGame = () => {
    currentPlayer = "x";
    cells.forEach((cell) => {
      cell.textContent = "";
    });
    popup.style.display = "none";
  };

  cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
  playAgainBtn.addEventListener("click", newGame);
  closeButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      popup.style.display = "none";
    })
  );

  newGame();
})();
