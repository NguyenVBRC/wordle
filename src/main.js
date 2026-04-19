import "./style.css";

document.querySelector("#app").innerHTML = `
<section class='container'>
  <h1>Wordle</h1>
  <div id="board"></div>
</section>
`;

const board = document.querySelector("#board");
const words = ["APPLE", "GRAPE", "PLANT", "BRICK", "STONE"];
const secretWord = words[Math.floor(Math.random() * words.length)];

let currentRow = 0;
const rows = [];

for (let i = 0; i < 5; i++) {
  const row = document.createElement("div");
  row.classList.add("row");

  const inputs = [];

  for (let j = 0; j < 5; j++) {
    const input = document.createElement("input");
    input.maxLength = 1;

    input.addEventListener("input", (e) => {
      const value = e.target.value.slice(0, 1).toUpperCase();
      e.target.value = value;

      if (value && e.target.nextElementSibling) {
        e.target.nextElementSibling.focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      const isRowActive = i === currentRow;
      if (!isRowActive) return;

      if (
        e.key === "Backspace" &&
        !e.target.value &&
        e.target.previousElementSibling
      ) {
        e.target.previousElementSibling.focus();
      }

      if (e.key === "Enter") {
        submitRow(row, inputs);
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        input.previousElementSibling.focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        input.nextElementSibling.focus();
      }
    });

    inputs.push(input);
    row.appendChild(input);
  }

  rows.push(inputs);
  board.appendChild(row);
}

rows[0][0].focus();

// SUBMIT LOGIC
function submitRow(rowEl, inputs) {
  const guess = inputs
    .map((i) => i.value)
    .join("")
    .toUpperCase();

  if (guess.length < 5) return;

  // Color logic
  const secretArr = secretWord.split("");
  const guessArr = guess.split("");
  const result = Array(5).fill("gray");

  // First pass: greens
  guessArr.forEach((letter, i) => {
    if (letter === secretArr[i]) {
      result[i] = "green";
      secretArr[i] = null;
      guessArr[i] = null;
    }
  });

  // Second pass: yellows
  guessArr.forEach((letter, i) => {
    if (!letter) return;

    const index = secretArr.indexOf(letter);
    if (index !== -1) {
      result[i] = "yellow";
      secretArr[index] = null;
    }
  });

  // APPLY COLORS + LOCK ROW
  inputs.forEach((input, i) => {
    input.classList.add(result[i]);
    input.disabled = true;
  });

  // WIN CHECK
  if (guess === secretWord) {
    setTimeout(() => alert("You won!"), 100);
    return;
  }

  // NEXT ROW
  currentRow++;

  if (currentRow < rows.length) {
    rows[currentRow][0].focus();
  } else {
    setTimeout(() => alert(`Game Over! Word was ${secretWord}`), 100);
  }
}
