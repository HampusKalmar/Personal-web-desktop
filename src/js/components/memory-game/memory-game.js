const IMAGES = [
  'images/vildsvin.png',
  'images/radjur.png',
  'images/kronhjort.png',
  'images/alg.png'
]

const template = document.createElement('template')
template.innerHTML = `

<div id="game-container">
   

<style>

  .tile {
    display: inline-block;
    width: 80px;
    height: 80px;
    margin: 5px;
    background-color: #eee;
    border-radius: 5px;
    font-size: 0;
  }

  .tile img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }
</style>
`

customElements.define('memory-game',
  /**
   * A main class that extends the html element.
   */
  class extends HTMLElement {
    /**
     * A private member which refers to a memory game.
     */
    #gameContainer

    #tiles
    #selectedTileOne
    #selectedTileTwo
    #canSelect
    #matches
  
    /**
     * A constructor that instantiates private members.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#gameContainer = this.shadowRoot.querySelector('#game-container')
      this.#tiles = []
      this.#selectedTileOne = null
      this.#selectedTileTwo = null
      this.#canSelect = true
      this.#matches = 0
    }

    connectedCallback() {
      this.#initGame()
    }

    #initGame() {
      const images = IMAGES.concat(IMAGES)

      images.sort(() => Math.random() - 0.5)
      for (const image of images) {
        const tile = document.createElement('div')
        tile.classList.add('tile')
        const img = document.createElement('img')
        img.src = image
        tile.appendChild(img)
        tile.addEventListener('click', () => {
          this.#handleTileClick(tile)
        })
        this.#tiles.push(tile)
        this.#gameContainer.appendChild(tile)
      }
    }

    #handleTileClick(tile) {
      if (tile.classList.contains('matched')) {
        return
      }

      if (this.#selectedTileOne && this.#selectedTileTwo) {
        return
      }

      if (tile === this.#selectedTileOne) {
        return
      }

      if (!this.#canSelect) {
        return
      }
  
      tile.classList.add('selected')
  
      if (!this.#selectedTileOne) {
        this.#selectedTileOne = tile
        return
      }
  
      this.#selectedTileTwo = tile
  
      if (this.#selectedTileOne.firstChild.src === this.#selectedTileTwo.firstChild.src) {
        this.#handleMatch()
      } else {
        this.#handleMismatch()
      }
    }

    #handleMatch() {

    }

    #handleMismatch() {

    }
  })
