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
      margin-left: 24px;
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
      font-size: 16px;
      font-family: fantasy;
      color: #edf2f4;
      position: right;
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

    /**
     * A constructor that instantiates the private members.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#memoryBoard = this.shadowRoot.querySelector('#memory-board')
      this.#status = this.shadowRoot.querySelector('#status')
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

      let tiles = []
      const totalTiles = 4 * 4
      for (let i = 0; i < totalTiles / 2; i++) {
        const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
        tiles.push(randomEmoji)
        tiles.push(randomEmoji)
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
      if (this.#gameOver || tileElement.dataset.matched === 'true') return
      if (this.#flippedTiles.length === 2) {
        this.unflipTiles()
      }
      tileElement.dataset.flipped = 'true'
      this.#flippedTiles.push(tileElement)
      if (this.#flippedTiles.length === 2) {
        this.#attempts++
        if (this.#flippedTiles[0].dataset.image === this.#flippedTiles[1].dataset.image) {
          this.matchTiles()
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
        setTimeout(() => this.startTheGame(), 3000)
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
