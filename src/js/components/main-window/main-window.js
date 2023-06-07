const template = document.createElement('template')
template.innerHTML = `
  <div id='window-container'>
  </div>
  <style>
    #window-container {
      background-color: #edf2f4;
      width: 600px;
      height: 600px;
      box-shadow: 1px 3px 10px 2px;
    }

    .pop-up-window {
      width: 50px;
      height: 50px;
    }

    .frame {
      width: 600px;
      background-color: #2b2d42;
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

      let isDragging = false
      let offsetX = 0
      let offsetY = 0
      let popUpWindow

      this.#mainWindow.addEventListener('mousedown', (event) => {
        isDragging = true
        popUpWindow = event.currentTarget
        offsetX = event.clientX - popUpWindow.offsetLeft
        offsetY = event.clientY - popUpWindow.offsetTop
      })
      document.addEventListener('mousemove', (event) => {
        if (isDragging) {
          const x = event.clientX - offsetX
          const y = event.clientY - offsetY
          popUpWindow.style.left = `${x}px`
          popUpWindow.style.top = `${y}px`
        }
      })
      document.addEventListener('mouseup', () => {
        isDragging = false
        popUpWindow = null
      })
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

      const frame = document.createElement('div')
      frame.classList.add('frame')
      popUpWindow.appendChild(frame)

      const closeButton = document.createElement('button')
      closeButton.innerHTML = '<span>&times;</span>'
      closeButton.classList.add('close-button')
      closeButton.addEventListener('click', (event) => {
        event.preventDefault()
        popUpWindow.remove()
        this.#mainWindow.remove()
      })
      frame.appendChild(closeButton)

      const duplicateButton = document.createElement('button')
      duplicateButton.textContent = 'Duplicate'
      duplicateButton.classList.add('duplicate-button')
      duplicateButton.addEventListener('click', () => {
        this.#duplicatePopUpWindow(popUpWindow)
      })
      frame.appendChild(duplicateButton)

      this.#mainWindow.appendChild(popUpWindow)
    }

    /**
     * A method that duplicates the pop up window.
     *
     * @param popUpWindow
     */
    async #duplicatePopUpWindow (popUpWindow) {
      const duplicatedPopUpWindow = popUpWindow.cloneNode(true)
      this.#mainWindow.appendChild(duplicatedPopUpWindow)
    }
  })
