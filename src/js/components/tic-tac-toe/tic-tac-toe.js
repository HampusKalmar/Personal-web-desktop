const template = document.createElement('template')
template.innerHTML = `
  <div id="ticTacToe-board"></div>
  <div id="status"></div>

  <style>
    
  </style>
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
      this.startGame()
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
        cell.addEventListener('click', () => this.handleCellClick(cell))
        this.#board.appendChild(cell)
      }
    }

    /**
     * Handles a click event on a cell in the game.
     *
     * @param {HTMLElement} cell - The clicked cell element.
     */
    handleCellClick (cell) {
      if (cell.textContent !== '') {
        cell.textContent = this.#currentTurn
        cell.classList.add(this.#currentTurn)
      }
      if (this.checkWin(this.#currentTurn)) {
        this.#status.textContent = 'You Win'
        setTimeout(() => this.startGame(), 2000)
      } else {
        this.#currentTurn = 'o'
        this.computerMove()
      }
    }

    /**
     * The method that handles the computers move in the game.
     */
    computerMove () {
      let cell
      do {
        const randomIndex = Math.floor(Math.random() * 9)
        cell = this.#board.children[randomIndex]
      } while (cell.textContent !== '')

      cell.textContent = this.#currentTurn
      cell.classList.add(this.#currentTurn)
      if (this.checkWin(this.#currentTurn)) {
        this.#status.textContent = 'You lose'
        setTimeout(() => this.startGame(), 2000)
      } else {
        this.#currentTurn = 'x'
      }
    }

    /**
     * Checks if the player has won the game.
     *
     * @param {string} player - The player to check.
     * @returns {boolean} - True if the player has won, false if the computer won.
     */
    checkWin (player) {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ]
      for (const line of lines) {
        if (line.every(index => this.#board.children[index].textContent === player)) {
          return true
        }
      }
      return false
    }
  })
