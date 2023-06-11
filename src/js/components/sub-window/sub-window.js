import '../message-application/message-application.js'

const template = document.createElement('template')
template.innerHTML = `
  <div id='window-container'>
  </div>
  <style>
    .pop-up-window {
      width: 500px;
      height: 500px;
      position: absolute;
      background-color: #2b2d42;
      color: #000;
      padding: 10px;
      box-sizing: border-box;
      box-shadow: 1px 3px 10px 2px;
    }
  </style>
`
customElements.define('main-window',
/**
 *
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
     * A lifecycle callback that is called when the element is inserted into the DOM.
     */
    connectedCallback () {
      this.createPopUpWindow()
    }

    /**
     * A method that creates pop up windows.
     */
    async createPopUpWindow () {
      const popUpWindow = document.createElement('div')
      popUpWindow.classList.add('pop-up-window')

      const closeButton = document.createElement('button')
      closeButton.innerHTML = '<span>&times;</span>'
      closeButton.classList.add('close-button')
      closeButton.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        popUpWindow.remove()
      })
      popUpWindow.appendChild(closeButton)

      const duplicateButton = document.createElement('button')
      duplicateButton.textContent = 'Duplicate'
      duplicateButton.classList.add('duplicate-button')
      duplicateButton.addEventListener('click', (event) => {
        event.stopPropagation()
        this.#duplicatePopUpWindow(popUpWindow)
      })
      popUpWindow.appendChild(duplicateButton)

      this.#mainWindow.appendChild(popUpWindow)
      this.#addDragEventListeners(popUpWindow)
    }

    /**
     * A method that duplicates the pop up window.
     *
     * @param {HTMLElement} popUpWindow - The Pop-up window element do duplicate.
     */
    async #duplicatePopUpWindow (popUpWindow) {
      const duplicatedPopUpWindow = popUpWindow.cloneNode(true)
      this.#mainWindow.appendChild(duplicatedPopUpWindow)
      this.#addDragEventListeners(duplicatedPopUpWindow)
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
