import '../sub-window/sub-window.js'

const template = document.createElement('template')
template.innerHTML = `
  <div id="dock-container">
    <button class="dock-item">Chat</button>
    <button class="dock-item">Memory</button>
    <button class="dock-item">Tic Tac Toe</button>
  </div>

  <style>
    #dock-container {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 80px;
      background: #2b2d42;
    }

    .dock-item {
      margin: 0 100px;
      color: #edf2f4;
      background: transparent;
      border: none;
      font-family: fantasy;
      font-size: 20px;
    }

  </style>
`
customElements.define('dock-application',

  /**
   *
   */
  class extends HTMLElement {
    #dock

    #items

    /**
     * Initializes properties, attaches shadow DOM, and sets up event listeners.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#dock = this.shadowRoot.querySelector('#dock-container')
      this.#items = this.shadowRoot.querySelectorAll('.dock-item')
    }

    /**
     * A lifecycle callback that is called when the element is inserted into the DOM.
     */
    connectedCallback () {
      this.clickDockItems()
    }

    /**
     * Checks if the items is clicked on in the dock.
     */
    clickDockItems () {
      this.#items.forEach(item => {
        item.addEventListener('click', () => {
          console.log('The button was clicked on')
          const subWindow = document.createElement('sub-window')
          let appType

          switch (item.textContent.trim()) {
            case 'Chat':
              appType = 'message'
              break
            case 'Tic Tac Toe':
              appType = 'tic-tac-toe'
              break
            default:
              console.log('Unknown dock item')
              return
          }
          document.body.appendChild(subWindow)
          subWindow.createPopUpWindow(appType)
        })
      })
    }
  })
