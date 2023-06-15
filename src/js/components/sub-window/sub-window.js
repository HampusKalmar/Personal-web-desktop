import '../message-application/message-application.js'
import '../tic-tac-toe/tic-tac-toe.js'
import '../memory-game/memory-game.js'

const template = document.createElement('template')
template.innerHTML = `
  <div id="window-container">
  </div>
  <style>
    .pop-up-window {
      width: 500px;
      height: 500px;
      position: absolute;
      background-color: #2b2d42;
      color: #000;
      padding: 11px;
      box-sizing: border-box;
      box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
      border-radius: 18px;
    }

    .close-button {
      background-color: #8d99ae;
      color: #edf2f4;
      border: 1px solid #edf2f4;
      border-radius: 25%;
      width: 25px;
      height: 25px;
    }
  </style>
`
let highestZIndex = 1

customElements.define('sub-window',

  /**
   * Custom element representing a sub-window.
   */
  class extends HTMLElement {
    #mainWindow

    /**
     * A constructor that instantiates the private members.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#mainWindow = this.shadowRoot.querySelector('#window-container')
    }

    /**
     * Creates a close button and attaches an event listener to it.
     *
     * @param {HTMLElement} popUpWindow - The pop-up window element to attach the button to.
     * @returns {HTMLElement} closeButton - The created close button element.
     */
    createCloseButton (popUpWindow) {
      const closeButton = document.createElement('button')
      closeButton.innerHTML = '<span>&times;</span>'
      closeButton.classList.add('close-button')
      closeButton.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        popUpWindow.remove()
      })
      return closeButton
    }

    /**
     * A method that creates pop up windows.
     *
     * @param {string} appType - The type of application to include in the window.
     */
    async createPopUpWindow (appType) {
      const popUpWindow = document.createElement('div')
      popUpWindow.classList.add('pop-up-window')

      const closeButton = this.createCloseButton(popUpWindow)
      popUpWindow.appendChild(closeButton)

      if (appType === 'message') {
        const messageApp = document.createElement('message-application')
        popUpWindow.appendChild(messageApp)
      } else if (appType === 'tic-tac-toe') {
        const ticTacToeGame = document.createElement('tic-tac-toe')
        popUpWindow.appendChild(ticTacToeGame)
      } else if (appType === 'memory') {
        const memoryGame = document.createElement('memory-game')
        popUpWindow.appendChild(memoryGame)
      }

      this.#mainWindow.appendChild(popUpWindow)
      this.#addDragEventListeners(popUpWindow)
    }

    /**
     * Adds a drag event listener to the pop-up window to enable the window to move.
     *
     * @param {HTMLElement} popUpWindow - the pop-up window element to attach the event listeners to.
     */
    #addDragEventListeners (popUpWindow) {
      let isDragging = false
      let offsetX = 0
      let offsetY = 0

      popUpWindow.addEventListener('mousedown', (event) => {
        isDragging = true
        offsetX = event.clientX - popUpWindow.getBoundingClientRect().left
        offsetY = event.clientY - popUpWindow.getBoundingClientRect().top
        highestZIndex += 1
        popUpWindow.style.zIndex = highestZIndex
      })

      popUpWindow.addEventListener('mousemove', (event) => {
        if (isDragging) {
          const x = event.clientX - offsetX
          const y = event.clientY - offsetY
          popUpWindow.style.left = `${x}px`
          popUpWindow.style.top = `${y}px`
        }
      })

      popUpWindow.addEventListener('mouseup', () => {
        isDragging = false
      })
    }
  })
