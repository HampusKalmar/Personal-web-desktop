const EMOJIS = ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓']

const template = document.createElement('template')
template.innerHTML = `
  <div id="status"></div>
  <div id="memory-board"></div>
  <div id="timer"></div>
  

  <style>
    #memory-board {
      border: 3px solid #edf2f4;
      border-radius: 10px;
      padding: 20px;
      width: 380px;
      height: 380px;
      margin-top: 5px;
      margin-left: 25px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 5px;
      justify-items: center;
      position: fixed;

    }

    .tile {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
      border: 1px solid #edf2f4;
      user-select: none;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      font-size: 35px;
    }

    .tile[data-flipped="true"]:before,
    .tile[data-matched="true"]:before {
      content: attr(data-image)
    }

    .tile[data-flipped="false"],
    .tile[data-matched="false"] {
      background-color: #8d99ae; 
    }

    #status {
      font-size: 14px;
      font-family: fantasy;
      color: #edf2f4;
      position: right;
    }

    #timer {
      font-size: 14px;
      font-family: fantasy;
      color: #edf2f4;
      display: flex;
      justify-content: right;
      margin-top: -22px;
    }

  </style>
`

/**
 * Define a custom element.
 */
customElements.define('memory-game',

  /**
   * Represents a memory game.
   */
  class extends HTMLElement {
    #memoryBoard

    #gameSize

    #flippedTiles

    #gameOver

    #attempts

    #status

    #startTime

    #timerInterval

    #clock

    /**
     * A constructor that instantiates the private members.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#memoryBoard = this.shadowRoot.querySelector('#memory-board')
      this.#status = this.shadowRoot.querySelector('#status')
      this.#clock = this.shadowRoot.querySelector('#timer')

      this.#startTime = null
      this.#timerInterval = null

      //
      // SAKER KVAR ATT FIXA I DENNA MOUDUL:
      // 1. Ska finnas tre olika storlekar på memory-brädet!
      // 2. Min egna timer som ska räkna hur länge det tar för en spelare att -
      // - klara memoryt, timerna ska starta efter att användaren trycker på första "tile:n".
    }

    /**
     * A lifecycle callback that is called when the element is inserted into the DOM.
     */
    connectedCallback () {
      this.startTheGame()
    }

    /**
     * Starts the game by initializing game-related variables and creating the memory board.
     */
    startTheGame () {
      this.#gameOver = false
      this.#attempts = 0
      this.#flippedTiles = []
      this.#memoryBoard.innerHTML = ''
      this.#status.textContent = ''

      this.#startTime = null
      if (this.#timerInterval !== null) {
        clearInterval(this.#timerInterval)
        this.#timerInterval = null
      }
      this.#clock.textContent = 'Time: 0s'

      let tiles = []

      for (let i = 0; i < EMOJIS.length; i++) {
        tiles.push(EMOJIS[i])
        tiles.push(EMOJIS[i])
      }
      tiles = this.shuffleArray(tiles)

      tiles.forEach((tile, index) => {
        const tileElement = document.createElement('div')
        tileElement.classList.add('tile')
        tileElement.dataset.image = tile
        tileElement.dataset.flipped = 'false'
        tileElement.dataset.matched = 'false'
        tileElement.addEventListener('click', this.flipTile.bind(this, tileElement))
        this.#memoryBoard.appendChild(tileElement)
      })
    }

    /**
     * Flips a tile on the game board.
     *
     * @param {HTMLElement} tileElement - The HTML element representing the tile to be flipped.
     */
    flipTile (tileElement) {
      if (this.#gameOver || tileElement.dataset.matched === 'true' || this.#flippedTiles.length === 2) return
      tileElement.dataset.flipped = 'true'
      this.#flippedTiles.push(tileElement)
      if (this.#flippedTiles.length === 2) {
        this.#attempts++
        if (this.#flippedTiles[0].dataset.image === this.#flippedTiles[1].dataset.image) {
          this.matchTiles()
        } else {
          setTimeout(() => this.unflipTiles(), 1500)
        }
      }
    }

    /**
     * Unflips all currently flipped tiles by resetting their `dataset.flipped` property to 'false'.
     */
    unflipTiles () {
      this.#flippedTiles.forEach(tile => {
        tile.dataset.flipped = 'false'
      })
      this.#flippedTiles = []
    }

    /**
     * Marks all flipped tiles as matched by setting their `dataset.matched` property to 'true'.
     */
    matchTiles () {
      this.#flippedTiles.forEach(tile => {
        tile.dataset.matched = 'true'
      })
      this.#flippedTiles = []
      if ([...this.#memoryBoard.querySelectorAll('.tile')].every(tile => tile.dataset.matched === 'true')) {
        this.#gameOver = true
        this.#status.textContent = `Game over! You've made ${this.#attempts} attempts😀.`
        setTimeout(() => this.startTheGame(), 3500)
      }
    }

    /**
     * Shuffles the elements in the provided array using the Fisher-Yates algorithm.
     *
     * @param {Array} array - The method takes an array parameter and returns the shuffled array.
     * @returns {Array} - The shuffled array.
     */
    shuffleArray (array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
      }
      return array
    }
  })
