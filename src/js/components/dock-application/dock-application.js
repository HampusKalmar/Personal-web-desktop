import '../sub-window/sub-window.js'

const IMG_ONE = (new URL('images/chat.png', import.meta.url)).href
const IMG_TWO = (new URL('images/memory.png', import.meta.url)).href
const IMG_THREE = (new URL('images/game.png', import.meta.url)).href

const template = document.createElement('template')
template.innerHTML = `
  <div id="dock-container">
    <button class="dock-item" data-app="chat">
      <img src="${IMG_ONE}" class="logos"/>
      <span class="toolTip">Chat</span>
    </button>
    <button class="dock-item">
      <img src="${IMG_TWO}" class="logos"/>
      <span class="toolTip">Memory</span>
    </button>
    <button class="dock-item" data-app="tic-tac-toe">
      <img src="${IMG_THREE}" class="logos"/>
      <span class="toolTip">Tic tac toe</span>
    </button>
  </div>

  <style>
    #dock-container {
      display: flex;
      justify-content: center;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 140px;
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

    .logos {
      width: 70px;
      height: 60px;
      color: #000;
      border: 3px solid;
    }

    .toolTip {
      visibility: hidden;
      background-color: #8d99ae;
      color: #edf2f4;
      padding: 5px 3px;
      border-radius: 6px;
      z-index: 1;
      bottom: 20%; /* Position the tooltip above the button */
      left: 50%;
      margin-left: -50px; /* Center the tooltip */
      opacity: 0;
      transition: opacity 0.5s;
    }

    .dock-item:hover .toolTip {
      visibility: visible;
      opacity: 1;
      margin-bottom: 10px;
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

          switch (item.getAttribute('data-app')) {
            case 'chat':
              appType = 'message'
              break
            case 'tic-tac-toe':
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
