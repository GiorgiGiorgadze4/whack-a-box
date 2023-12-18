// Board.js
import Tile from "./tile.js";

export default class Board {
  #element;
  #size;
  #tiles;
  #currentX = 0;
  #currentY = 0;
  #gameOver = true;
  #score = 0;
  #highScore = 0;
  #timer;
  #timeLeft = 0;
  #tick;
  #timeout;

  constructor(boardElement, size) {
    this.#element = boardElement;
    this.#size = size;
    this.#tiles = this.createTiles(this.#element, this.#size); 
    this.#timer = document.querySelector(".timer")  
    this.tiles[0,0].focus() 
    console.log("boardi");
  }

  get size() {
    return this.#size;
  }

  get tiles() {
    return this.#tiles;
  }

  get gameOver() {
    return this.#gameOver;
  }

  get score() {
    return this.#score;
  }

  createTiles(boardElement, size) {
    const tiles = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const element = document.createElement("div");
        boardElement.appendChild(element);
        tiles.push(new Tile(element, x, y));
      }
    }
    return tiles;
  }

  setMole() {
    this.#tiles.forEach((tile) => {
      if (tile.status === Tile.STATUS_MOLE) {
        tile.status = Tile.STATUS_HIDDEN;
      }
    });
    const randomX = Math.floor(Math.random() * this.#size);
    const randomY = Math.floor(Math.random() * this.#size);

    if (
      randomX >= 0 &&
      randomX < this.#size &&
      randomY >= 0 &&
      randomY < this.#size
    ) {
      const moleTile = this.#tiles[randomX * this.#size + randomY];
      moleTile.status = Tile.STATUS_MOLE;
    }
  }
  moveFocus(key) {
    if (this.#gameOver) return;

    this.tiles[this.#currentY * this.#size + this.#currentX].blur();

    switch (key) {
      case "w":
        this.#currentY = (this.#currentY - 1 + this.#size) % this.#size;
        break;
      case "s":
        this.#currentY = (this.#currentY + 1) % this.#size;
        break;
      case "a":
        this.#currentX = (this.#currentX - 1 + this.#size) % this.#size;
        break;
      case "d":
        this.#currentX = (this.#currentX + 1) % this.#size;
        break;
    }

    this.tiles[this.#currentY * this.#size + this.#currentX].focus();
  }

  whack() {
    console.log("Whack method called");
    if (this.#gameOver) return;

    const currentTile =
      this.tiles[this.#currentY * this.#size + this.#currentX];
    console.log("Current Tile Status:", currentTile.status);

    if (currentTile.status === Tile.STATUS_MOLE) {
      currentTile.hideMole();
      this.#score += 1;
      this.setMole();

      const scoreElement = document.querySelector(".scoreValue");
      if (scoreElement) {
        scoreElement.textContent = `Score: ${this.#score}`;
      }
      if(this.#score % 5 == 0){
        this.#timeLeft += 2
        this.updateTime()
        this.addTimeChange(false)        
      }
    }
    else{
      this.missedTheMole(currentTile)
    }
  }
  addTimeChange(reduce){
    let label = document.querySelector('.timerContainer > span')
    if(this.#timeout){
      clearTimeout(this.#timeout)
      this.#timeout = null
      label.classList.remove('reduced')
      label.classList.remove('increased')
    }   
    if(reduce){
      label.innerHTML = "-1"
      label.classList.add('reduced')
      this.#timeout = setTimeout(() => {
        label.classList.remove('reduced')
      }, 500)
    }else{
      label.innerHTML = "+2"
      label.classList.add('increased')
      this.#timeout = setTimeout(() => {
        label.classList.remove('increased')
      }, 500)
    }
  }
  missedTheMole(currentTile){
    currentTile.missed()     
    this.#timeLeft--
    this.updateTime()    
    this.addTimeChange(true)
    if(this.#timeLeft <= 0){
      this.endGame()      
      return
    }
  }

  startGame() {
    if(this.#gameOver === false) return
    this.#gameOver = false;
    this.#score = 0;
    this.setMole();
    this.setTimer();    
    document.querySelector('.playButton').classList.add('disabled')
    document.querySelector('.score').classList.remove('gameFinished')
    document.querySelector('.scoreValue').textContent = "Score: 0"
  }

  setTimer(){
    this.#timeLeft = 30;
    this.updateTime()
    this.#tick = setInterval(() => {
      this.#timeLeft--
      this.updateTime()
      if(this.#timeLeft <= 0){
        this.endGame()      
        return
      }
    }, 1000);
  };

  updateTime(){
    if(this.#timeLeft <= 0){
      this.#timeLeft = 0 
    }
    this.#timer.textContent = `Timer: 0:${('0' + this.#timeLeft).slice(-2)}`  
  }

  endGame() {
    clearInterval(this.#tick)
    document.querySelector('.playButton').classList.remove('disabled')
    document.querySelector('.score').classList.add('gameFinished')
    this.#gameOver = true;  
    if(this.#score > this.#highScore){
      this.#highScore = this.#score
      document.querySelector('.highScoreValue').innerHTML = `High Score: ${this.#score}`
    }
  }
}
