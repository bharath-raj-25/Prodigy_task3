let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;

const winningConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

const squares = document.querySelectorAll(".square");
const resetButton = document.getElementById("reset");
const message = document.getElementById("message");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const closePopupBtn = document.getElementById("close-popup");
const confettiContainer = document.querySelector(".confetti-container");

// Initialize
message.textContent = `Player X's turn`;

// Event listeners
squares.forEach(square => {
  square.addEventListener("click", handleClick);
});

resetButton.addEventListener("click", resetGame);
closePopupBtn.addEventListener("click", () => {
  popup.classList.add("hidden");
  clearConfetti();
});

function handleClick(e) {
  const square = e.target;
  const index = parseInt(square.getAttribute("data-index"));

  if (board[index] !== "" || gameOver || currentPlayer !== "X") return;

  makeMove(index, "X");

  if (!gameOver) {
    setTimeout(aiMove, 500); // AI moves after 0.5 seconds
  }
}
function makeMove(index, player) {
  board[index] = player;
  squares[index].classList.add(player);
  squares[index].textContent = player;

  if (checkWinner()) {
    gameOver = true;
    showPopup(`${player} Wins!`);
    return;
  }

  if (board.every(cell => cell !== "")) {
    gameOver = true;
    showPopup(`It's a Draw!`);
    return;
  }

  currentPlayer = player === "X" ? "O" : "X";
  message.innerHTML = `Player <span style="color:#ff1a1a">${currentPlayer}</span>'s turn`;
}

function aiMove() {
  if (gameOver || currentPlayer !== "O") return;

  const emptyIndices = board
    .map((val, idx) => val === "" ? idx : null)
    .filter(idx => idx !== null);

  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

  makeMove(randomIndex, "O");

  console.log(`AI played at index ${randomIndex}`);
}


function checkWinner() {
  for (const condition of winningConditions) {
    const [a,b,c] = condition;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      // Highlight winning squares
      condition.forEach(i => squares[i].classList.add("winner"));
      return true;
    }
  }
  return false;
}

function resetGame() {
  board.fill("");
  gameOver = false;
  currentPlayer = "X";
  squares.forEach(sq => {
    sq.textContent = "";
    sq.classList.remove("X", "O", "winner");
  });
  message.innerHTML = `Player <span style="color:#ff1a1a">X</span>'s turn`;
  popup.classList.add("hidden");
  clearConfetti();
}

function showPopup(text) {
  popupMessage.textContent = text;
  popup.classList.remove("hidden");
  createConfetti();
}

// Confetti logic
function createConfetti() {
  clearConfetti();
  const confettiCount = 50;
  for(let i=0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDuration = `${1 + Math.random() * 2}s`;
    confetti.style.animationDelay = `${Math.random() * 1}s`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiContainer.appendChild(confetti);
  }
}

function clearConfetti() {
  confettiContainer.innerHTML = "";
}


