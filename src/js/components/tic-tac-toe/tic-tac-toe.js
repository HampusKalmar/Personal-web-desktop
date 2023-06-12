const template = document.createElement('template')
template.innerHTML = `
  <div id="ticTacToe-board"></div>
  <div id="status"></div>
`
customElements.define('tic-tac-toe',
/**
 *
 */
  class extends HTMLElement {
    #board

    #status

    #currentTurn

    /**
     * A constructor that instantiates the private members.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#board = this.shadowRoot.querySelector('#ticTacToe-board')
      this.#status = this.shadowRoot.querySelector('#status')
    }

    /**
     * A lifecycle callback that is called when the element is inserted into the DOM.
     */
    connectedCallback () {

    }

    /**
     * A method that sets up the game when started.
     */
    startGame () {
      this.#board.innerHTML = ''
      this.#status.textContent = ''
      this.#currentTurn = 'x'
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div')
        // cell.addEventListener('click', () =>)
        this.#board.appendChild(cell)
      }
    }
  })
