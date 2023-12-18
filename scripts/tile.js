export default class Tile {
  static STATUS_HIDDEN = "hidden";
  static STATUS_NUMBER = "number";
  static STATUS_MARKED = "marked";
  static STATUS_EMPTY = "empty";
  static STATUS_MOLE = "mole";

  #element;
  #status = Tile.STATUS_HIDDEN;
  #type;
  #x;
  #y;

  #value;
  #focused = false;

  constructor(element, x, y) {
    this.#element = element;
    this.#element.dataset.status = this.#status;
    this.#x = x;
    this.#y = y;
    console.log("tile");
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get element() {
    return this.#element;
  }

  get status() {
    return this.#status;
  }

  set status(value) {
    this.#status = value;
    this.#element.dataset.status = this.#status;
  }

  get type() {
    return this.#type;
  }

  set type(value) {
    this.#type = value;
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value;
    this.#element.textContent = this.#value;
  }

  focus() {
    this.#focused = true;
    this.#element.classList.add("selected");
  }

  blur() {
    this.#focused = false;
    this.#element.classList.remove("selected");
  }

  isFocused() {
    return this.#focused;
  }

  hideMole() {
    this.#status = Tile.STATUS_HIDDEN;
    this.#element.dataset.status = this.#status;
  }

  missed() {
    this.#element.classList.add("missed");
    setTimeout(() => {
        this.#element.classList.remove("missed");
    }, 200)
  }

  neighbors(other) {
    return (
      this.#topLeftNeighbor(other) ||
      this.#topNeighbor(other) ||
      this.#topRightNeighbor(other) ||
      this.#leftNeighbor(other) ||
      this.#rightNeighbor(other) ||
      this.#bottomLeftNeighbor(other) ||
      this.#bottomNeighbor(other) ||
      this.#bottomRightNeighbor(other)
    );
  }

  #topLeftNeighbor(other) {
    return other.y === this.#y - 1 && other.x === this.#x - 1;
  }

  #topNeighbor(other) {
    return other.y === this.#y - 1 && other.x === this.#x;
  }

  #topRightNeighbor(other) {
    return other.y === this.#y - 1 && other.x === this.#x + 1;
  }

  #leftNeighbor(other) {
    return other.y === this.#y && other.x === this.#x - 1;
  }

  #rightNeighbor(other) {
    return other.y === this.#y && other.x === this.#x + 1;
  }

  #bottomLeftNeighbor(other) {
    return other.y === this.#y + 1 && other.x === this.#x - 1;
  }

  #bottomNeighbor(other) {
    return other.y === this.#y + 1 && other.x === this.#x;
  }

  #bottomRightNeighbor(other) {
    return other.y === this.#y + 1 && other.x === this.#x + 1;
  }
}
