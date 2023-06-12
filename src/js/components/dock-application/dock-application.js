const template = document.createElement('template')
template.innerHTML = `
  <div id="dock-container">
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
      margin: 0 10px;
    }

  </style>
`
customElements.define('dock-application',

  /**
   *
   */
  class extends HTMLElement {
    #dock

    /**
     * Initializes properties, attaches shadow DOM, and sets up event listeners.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#dock = this.shadowRoot.querySelector('#dock-container')
    }
  })
