import Board from "./board.js";

let board;

document.addEventListener("DOMContentLoaded", () => {
  const boardElement = document.querySelector("[data-board]");
  const boardSize = 3;
  board = new Board(boardElement, boardSize)
});

document.querySelector('.playButton').addEventListener('click', () => {
  board.startGame();
})

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (["w", "a", "s", "d"].includes(key) && board) {
    board.moveFocus(key);
  } else if (key === " " && board) {
    board.whack();
  }
});
