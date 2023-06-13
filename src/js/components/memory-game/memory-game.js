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
  })
