const URL = 'wss://courselab.lnu.se/message-app/socket'

const template = document.createElement('template')
template.innerHTML = `
  <div id="message-app">
    <input type="text" id="username-input" placeholder="Enter username"/>
    <button id="username-button">Enter Username</button>
    <input type="text" id="message-input" placeholder="Type your message"/>
    <button id="send-button">Send Message</button>
    <button id="emoji-button">🙂</button>
    <div id="emoji-picker" style="display: none;">
      <span class="emoji">😀</span>
      <span class="emoji">😂</span>
      <span class="emoji">😊</span>
      <span class="emoji">😑</span>
      <span class="emoji">😮</span>
    </div>
    <ul id="message-list"></ul>
    <p id="error-message"></p>
  </div>

  <style>
    #message-app {
      border: 3px solid #edf2f4;
      border-radius: 10px;
      padding: 20px;
      width: 400px;
      height: 400px;
      overflow: auto;
      margin-top: 3px;
      margin-left: 15px; 
    }

    #message-list {
      list-style-type: none;
      padding: 10px;
      margin: 0;
      height: 70%;
      overflow: auto;
      color: #edf2f4;
      font-family: fantasy;
    }

    #message-input {
      width: 98%;
      margin-top: 10px;
    }

    #send-button {
      width: 100%;
      margin-top: 10px;
    }

    #username-button {
      width: 100%;
      margin-top: 10px;
    }

    #username-input {
      width: 98%;
      margin-top: 10px;
    }

    #error-message {
      color: #edf2f4;
      display: none;
      font-size: 25px;
      margin-top: -50px;
      font-family: fantasy;
    }
  </style>
`

customElements.define('message-application',

  /**
   * Custom element representing a message-application.
   */
  class extends HTMLElement {
    /**
     * Represents the message app element.
     *
     * @type {HTMLElement}
     * @private
     */
    #messageApp

    /**
     * Represents the message input element.
     *
     * @type {HTMLElement}
     * @private
     */
    #messageInput

    /**
     * Represents the message list element.
     *
     * @type {HTMLElement}
     * @private
     */
    #messageList

    /**
     * Represents the send button element.
     *
     * @type {HTMLElement}
     * @private
     */
    #sendButton

    /**
     * Represents the error message element.
     *
     * @type {HTMLElement}
     * @private
     */
    #errorMessage

    /**
     * Represents the username button element.
     *
     * @type {HTMLElement}
     * @private
     */
    #usernameButton

    /**
     * Represents the emoji button element.
     *
     * @type {HTMLElement}
     * @private
     */
    #emojiButton

    /**
     * Represents the emoji picker element.
     *
     * @type {HTMLElement}
     * @private
     */
    #emojiPicker

    /**
     * Represents the emojis collection.
     *
     * @type {NodeList}
     * @private
     */
    #emojis

    /**
     * Represents the username input element.
     *
     * @type {HTMLElement}
     * @private
     */
    #usernameInput

    /**
     * Represents the API key for authentication.
     *
     * @type {*}
     */
    socket

    /**
     * Represents the API key for authentication.
     *
     * @type {string}
     */
    apiKey

    /**
     * Represents the username for the chat.
     *
     * @type {string}
     */
    username

    /**
     * Represents the queue of messages to be sent.
     *
     * @type {Array}
     */
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
      this.#messageInput = this.shadowRoot.querySelector('#message-input')
      this.#usernameButton = this.shadowRoot.querySelector('#username-button')
      this.#usernameInput = this.shadowRoot.querySelector('#username-input')
      this.#errorMessage = this.shadowRoot.querySelector('#error-message')
      this.#emojiButton = this.shadowRoot.querySelector('#emoji-button')
      this.#emojiPicker = this.shadowRoot.querySelector('#emoji-picker')
      this.#emojis = this.shadowRoot.querySelectorAll('.emoji')

      this.#messageInput.style.display = 'none'
      this.#sendButton.style.display = 'none'

      this.username = localStorage.getItem('username')
      if (this.username) {
        this.#messageInput.style.display = 'block'
        this.#sendButton.style.display = 'block'

        this.#usernameInput.style.display = 'none'
        this.#usernameButton.style.display = 'none'
      }

      this.#emojiButton.addEventListener('click', () => {
        this.#emojiPicker.style.display = this.#emojiPicker.style.display === 'none' ? 'block' : 'none'
      })

      this.#emojis.forEach((emoji) => {
        emoji.addEventListener('click', () => {
          this.#messageInput.value += emoji.textContent
          this.#emojiPicker.style.display = 'none'
        })
      })
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
        // Gamla lösningen:
        // this.messageQueue.unshift(message)

        // Nya lösningen: istället för att visa meddelandet två gånger visas det nu bara en gång.
        this.#messageInput.value = ''
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
      this.username = localStorage.getItem('username')
      if (this.username) {
        this.setupChat()
      } else {
        this.#usernameButton.addEventListener('click', () => {
          this.username = this.#usernameInput.value
          if (this.username) {
            localStorage.setItem('username', this.username)
            this.setupChat()
            this.#errorMessage.style.display = 'none'
            this.#usernameInput.style.display = 'none'
            this.#usernameButton.style.display = 'none'
          } else {
            this.#errorMessage.textContent = 'Please enter your username'
            this.#errorMessage.style.display = 'block'
          }
        })
      }
    }

    /**
     * Handles a received message from the WebSocket.
     *
     * @param {Event} event - The message event received from the WebSocket.
     */
    handleMessage (event) {
      const message = JSON.parse(event.data)
      if (message.type !== 'heartbeat') {
        this.messageQueue.unshift(message)
        if (this.messageQueue.length > 20) {
          this.messageQueue.pop()
        }
        this.displayMessages(this.messageQueue)
      }
    }

    /**
     * Sets up a chat connection by initializing a WebSocket.
     */
    setupChat () {
      this.socket = new WebSocket(URL)
      this.socket.onmessage = this.handleMessage.bind(this)
      this.#messageInput.style.display = 'block'
      this.#sendButton.style.display = 'block'

      this.#sendButton.addEventListener('click', () => this.sendMessage())
    }
  })
