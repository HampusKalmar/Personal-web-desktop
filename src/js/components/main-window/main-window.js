const template = document.createElement('template')
template.innerHTML = `
  <div id='window-container'>
  </div>
  <style>
    #window-container {
      background-color: #edf2f4;
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

      const frame = document.createElement('div')
      frame.classList.add('frame')
      popUpWindow.appendChild(frame)

      const content = document.createElement('div')
      content.textContent = 'Window'
      popUpWindow.appendChild(content)

      const minimizeButton = document.createElement('button')
      minimizeButton.innerHTML = '<span>&#8211;</span>'
      minimizeButton.classList.add('minimize-button')
      minimizeButton.addEventListener('click', () => {
        frame.classList.toggle('minimized')
      })
      frame.appendChild(minimizeButton)

      const expandButton = document.createElement('button')
      expandButton.innerHTML = '<span>&#9635;</span>'
      expandButton.classList.add('expand-button')
      expandButton.addEventListener('click', () => {
        frame.classList.toggle('expanded')
      })
      frame.appendChild(expandButton)

      const closeButton = document.createElement('button')
      closeButton.innerHTML = '<span>&times;</span>'
      closeButton.classList.add('close-button')
      closeButton.addEventListener('click', () => {
        this.#mainWindow.removeChild(popUpWindow)
      })
      frame.appendChild(closeButton)

      this.#mainWindow.appendChild(popUpWindow)
    }
  })
