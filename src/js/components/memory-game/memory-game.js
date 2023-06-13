const NUMBER_OF_IMAGES = 9

const IMG_URLS = new Array(NUMBER_OF_IMAGES)
for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
  IMG_URLS[i] = (new URL(`images/${i}.png`, import.meta.url)).href
}

const template = document.createElement('template')
template.innerHTML = `
  <div id="memory-board"></div>

  <style>
    #memory-board {
      border: 1px solid #edf2f4;
      border-radius: 10px;
      padding: 30px;
      width: 400px;
      height: 400px;
      overflow: auto;
      margin-top: 3px;
      margin-left: 8px; 
    }

    .tile {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      border: 1px solid #8d99ae;
      user-select: none;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }

    .tile[data-flipped="true"]:before,
    .tile[data-matched="true"]:before {
      content: attr(data-image)
    }

    .tile[data-flipped="false"],
    .tile[data-matched="false"] {
      background-color: #edf2f4; 
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

    /**
     * A constructor that instantiates the private members.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#memoryBoard = this.shadowRoot.querySelector('#memory-board')
    }

    /**
     * A lifecycle callback that is called when the element is inserted into the DOM.
     */
    connectedCallback () {
      this.#gameSize = '4x4'
      this.#attempts = 0
      this.#flippedTiles = []
      this.#gameOver = false
    }

    /**
     * Starts the game by initializing game-related variables and creating the memory board.
     */
    startTheGame () {
      this.#gameOver = false
      this.#attempts = 0
      this.#flippedTiles = []
      this.#memoryBoard.innerHTML = ''

      let tiles = []
      const totalTiles = 4 * 4
      for (let i = 0; i < totalTiles / 2; i++) {
        const randomImage = Math.floor(Math.random() * NUMBER_OF_IMAGES)
        tiles.push(randomImage)
        tiles.push(randomImage)
      }
      tiles = this.shuffleArray(tiles)

      tiles.forEach((tile, index) => {
        const tileElement = document.createElement('div')
        tileElement.classList.add('tile')
        tileElement.dataset.image = IMG_URLS[tile]
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

    unflipTiles() {
      this.#flippedTiles.forEach(tile => {
        tile.dataset.flipped = 'false'
      })
      this.#flippedTiles = []
    }
  })
