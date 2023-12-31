const EMOJIS = ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓']

const template = document.createElement('template')
template.innerHTML = `
  <div id="status"></div>
  <div id="memory-board"></div>
  <div id="timer"></div>

  <div id="input-contianer">
    <select id="board-size-select">
      <option value="4x4">4x4</option>
      <option value="4x2">4x2</option>
      <option value="2x2">2x2</option>
    </select>
    <button id="resize-button">Resize</button>
  </div>

  <style>
    #memory-board {
      border: 3px solid #edf2f4;
      border-radius: 10px;
      padding: 30px;
      width: 320px;
      height: 320px;
      margin-top: 20px;
      margin-left: 52px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 5px;
      justify-items: center;
      position: fixed;

    }

    #input-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      margin-top: 10px;
    }

    #board-size-select {
      display: flex;
      margin-top: 26px;
      background-color: #8d99ae;
      border: 1px solid #edf2f4;
      color: #edf2f4;
      width: 46px;
      border-radius: 7%;
    }

    #resize-button {
      display: flex;
      margin-bottom: 60px;
      margin-top: 6px;
      background-color: #8d99ae;
      color: #edf2f4;
      border: 1px solid #edf2f4;
      border-radius: 7%;
      width: 46px;
      height: 20px;
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
 * Defines a custom element representing a memory-game.
 */
customElements.define('memory-game',

  /**
   * Custom element that represents a memory game.
   */
  class extends HTMLElement {
    /**
     * Represents the memory board element.
     *
     * @type {HTMLElement}
     * @private
     */
    #memoryBoard

    /**
     * Represents the size of the memory board.
     *
     * @type {{ rows: number, columns: number }}
     * @private
     */
    #boardSize

    /**
     * Represents the flipped tiles in the game.
     *
     * @type {Array}
     * @private
     */
    #flippedTiles

    /**
     * Indicates whether the game is over or not.
     *
     * @type {boolean}
     * @private
     */
    #gameOver

    /**
     * Represents the number of attempts made in the game.
     *
     * @type {number}
     * @private
     */
    #attempts

    /**
     * Represents the status element.
     *
     * @type {HTMLElement}
     * @private
     */
    #status

    /**
     * Represents the start time of the game.
     *
     * @type {Date}
     * @private
     */
    #startTime

    /**
     * Represents the interval for the game timer.
     *
     * @type {number}
     * @private
     */
    #timerInterval

    /**
     * Represents the clock element.
     *
     * @type {HTMLElement}
     * @private
     */
    #clock

    /**
     * Represents the resize button element.
     *
     * @type {HTMLElement}
     * @private
     */
    #resizeButton

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
      this.#resizeButton = this.shadowRoot.querySelector('resize-button')

      this.#startTime = null
      this.#timerInterval = null

      this.#boardSize = { rows: 4, columns: 4 }
    }

    /**
     * A lifecycle callback that is called when the element is inserted into the DOM.
     */
    connectedCallback () {
      this.startTheGame()

      this.#resizeButton = this.shadowRoot.querySelector('#resize-button')

      this.#resizeButton.addEventListener('click', () => {
        const boardSizeSelect = this.shadowRoot.querySelector('#board-size-select')
        const [rows, columns] = boardSizeSelect.value.split('x').map(Number)
        this.setBoardSize(rows, columns)
      })
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

      for (let i = 0; i < this.#boardSize.rows * this.#boardSize.columns / 2; i++) {
        tiles.push(i % EMOJIS.length)
        tiles.push(i % EMOJIS.length)
      }
      tiles = this.shuffleArray(tiles)

      this.#memoryBoard.style.gridTemplateColumns = `repeat(${this.#boardSize.columns}, 1fr)`
      tiles.forEach((tile, index) => {
        const tileElement = document.createElement('div')
        tileElement.classList.add('tile')
        tileElement.dataset.image = EMOJIS[tile]
        tileElement.dataset.flipped = 'false'
        tileElement.dataset.matched = 'false'

        tileElement.setAttribute('tabindex', '0')

        tileElement.addEventListener('click', this.flipTile.bind(this, tileElement))

        tileElement.addEventListener('keyup', (event) => {
          if (event.key === 'Enter') {
            this.flipTile(tileElement)
          }
        })
        this.#memoryBoard.appendChild(tileElement)
      })
    }

    /**
     * Sets the size of the game board based on the number of rows and columns.
     *
     * @param {number} rows - Number of rows on the board.
     * @param {number} columns - Number of columns on the board.
     */
    setBoardSize (rows, columns) {
      this.#boardSize = { rows, columns }
      this.startTheGame()
    }

    /**
     * Flips a tile on the game board.
     *
     * @param {HTMLElement} tileElement - The HTML element representing the tile to be flipped.
     */
    flipTile (tileElement) {
      // MIN GAMLA LÖSNING:  if (this.#gameOver || tileElement.dataset.matched === 'true' || this.#flippedTiles.length === 2) return

      // MIN NYA LÖSNING ÄR DESSA FYRA IF-SATSER:
      if (this.#gameOver) {
        return
      }

      if (tileElement.dataset.matched === 'true') {
        return
      }

      // Kollar om ett kort har blivit "flipped" och hindrar användaren för att flippa samma kort igen.
      if (this.#flippedTiles.length === 1 && this.#flippedTiles[0] === tileElement) {
        return
      }

      if (this.#flippedTiles.length === 2) {
        return
      }
      tileElement.dataset.flipped = 'true'
      this.#flippedTiles.push(tileElement)

      if (!this.#startTime) {
        this.startTimer()
      }
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
        this.#flippedTiles.forEach(tile => {
          tile.dataset.matched = 'true'
        })
      })
      setTimeout(() => {
        this.#flippedTiles.forEach(tile => {
          tile.style.visibility = 'hidden'
        })
        this.#flippedTiles = []
        if ([...this.#memoryBoard.querySelectorAll('.tile')].every(tile => tile.dataset.matched === 'true')) {
          this.#gameOver = true
          clearInterval(this.#timerInterval)
          const elapsedSeconds = Math.floor((Date.now() - this.#startTime) / 1000)
          this.#status.textContent = `Game over! You've made ${this.#attempts} attempts😀`
          this.#clock.textContent = `You finished in ${elapsedSeconds} seconds`
          setTimeout(() => this.startTheGame(), 4000)
        }
      }, 2000)
    }

    /**
     * A timer that checks how long a player took to finish the memory game.
     */
    startTimer () {
      this.#startTime = Date.now()
      this.#timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - this.#startTime) / 1000)
        this.#clock.textContent = `Time: ${elapsedTime}s `
      }, 1000)
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
