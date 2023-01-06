const IMAGE_URL = (new URL('images/innova.png', import.meta.url)).href

const template = document.createElement('template')
template.innerHTML = `

<div id="main-div">
    <div id="cards"></div>
</div>

<style>

  #main-div {
    background-color: #f2f2f2;
  }

  #cards {
    width: 25%;
    height: 25%;
    background-color: blue;
    display: inline-block;
  }

  #cards.flipped {
    background-color: red;
  }
</style>
`

customElements.define('memory-game',
  /**
   * A main class that extends the html element.
   */
  class extends HTMLElement {
    /**
     * A private member which refers to a div element.
     */
    #div
    /**
     * A private member which refers to multiple div elements.
     */
    #cards

    /**
     * A constructor that instantiates private members.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#div = this.shadowRoot.querySelector('#main-div')
      this.#cards = this.shadowRoot.querySelector('#cards')
    }
  })
