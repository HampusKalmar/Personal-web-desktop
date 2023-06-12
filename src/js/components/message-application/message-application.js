const URL = 'wss://courselab.lnu.se/message-app/socket'

const template = document.createElement('template')
template.innerHTML = `
  <div id="message-app">
    <input type="text" id="message-input" placeholder="Type your message"/>
    <button id="send-button">Send</button>
    <ul id="message-list"></ul>
</div>
`

customElements.define('message-application',
  /**
   *
   */
  class extends HTMLElement {
    #messageApp

    #messageInput

    #messageList

    #sendButton

    socket

    apiKey

    username

    messageQueue = []

    /**
     * Initializes properties, attaches shadow DOM, and sets up event listeners.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#messageApp = this.shadowRoot.querySelector('#message-app')
      this.#sendButton = this.shadowRoot.querySelector('#send-button')
      this.#messageList = this.shadowRoot.querySelector('#message-list')
    }

    /**
     * A lifecycle callback that is called when the element is inserted into the DOM.
     */
    connectedCallback () {
      this.initChatApp()
    }

    /**
     * Sends a message via WebSocket.
     */
    async sendMessage () {
      const message = {
        type: 'message',
        data: this.#messageInput.value,
        username: this.username,
        channel: 'Hampus channel',
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message))
        this.messageQueue.unshift(message)
        if (this.messageQueue.length > 20) {
          this.messageQueue.pop()
        }
        this.displayMessages(this.messageQueue)
        this.#messageInput.value = ''
        console.log('Message sent successfully')
      } else {
        console.error('WebSocket is not open. Unable to send message.')
      }
    }

    /**
     * Displays the received messages in the message list.
     *
     * @param {Array} messages - An array of messages to display.
     */
    displayMessages (messages) {
      this.#messageList.innerHTML = ''

      for (const message of messages.reverse()) {
        const listItem = document.createElement('li')
        listItem.textContent = `${message.username}: ${message.data}`
        this.#messageList.appendChild(listItem)
      }
    }

    /**
     * Initializes the chat application.
     */
    initChatApp () {
      this.#messageInput = document.createElement('textarea')
      this.#messageInput.id = 'message-input'
      this.#messageInput.placeholder = 'Type your message'
      this.#messageApp.replaceChild(this.#messageInput, this.shadowRoot.querySelector('#message-input'))

      this.username = localStorage.getItem('username')
      if (!this.username) {
        this.username = prompt('Please enter your username')
        localStorage.setItem('username', this.username)
      }

      this.socket = new WebSocket(URL)
      this.#sendButton.addEventListener('click', () => this.sendMessage())

      /**
       * Parses the received messages and calls `displayMessages` to display them.
       *
       * @param {Event} event - The message event received from WebSocket.
       */
      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if (message.type !== 'heartbeat') {
          this.messageQueue.unshift(message)
          if (this.messageQueue.length > 20) {
            this.messageQueue.pop()
          }
          this.displayMessages(this.messageQueue)
        }
      }
    }
  })
