const URL = 'wss://courselab.lnu.se/message-app/socket'

const template = document.createElement('template')
template.innerHTML = `
  <div id="message-app">
    <input type="text" id="username-input" placeholder="Enter username"/>
    <button id="username-button">Enter Username</button>
    <input type="text" id="message-input" placeholder="Type your message"/>
    <button id="send-button">Send</button>
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
      border: 2px solid #000;
      border-radius: 10px;
      padding: 20px;
      width: 200px;
      height: 400px;
      overflow: auto; 
    }

    #message-list {
      list-style-type: none;
      padding: 10px;
      margin: 0;
      height: 70%;
      overflow: auto;
    }

    #message-input {
      width: 96%;
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
      width: 96%;
      margin-top: 10px;
    }

    #error-message {
      color: red;
      display: none;
    }
  </style>
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

    #errorMessage

    #usernameButton

    #emojiButton

    #emojiPicker

    #emojis

    #usernameInput

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
      this.#messageInput = this.shadowRoot.querySelector('#message-input')
      this.#usernameButton = this.shadowRoot.querySelector('#username-button')
      this.#usernameInput = this.shadowRoot.querySelector('#username-input')
      this.#errorMessage = this.shadowRoot.querySelector('#error-message')
      this.#emojiButton = this.shadowRoot.querySelector('#emoji-button')
      this.#emojiPicker = this.shadowRoot.querySelector('#emoji-picker')
      this.#emojis = this.shadowRoot.querySelectorAll('.emoji')

      this.#emojiButton.addEventListener('click', () => {
        this.#emojiPicker.style.display = this.#emojiPicker.style.display === 'none' ? 'block' : 'none'
      })

      this.#emojis.forEach((emoji) => {
        emoji.addEventListener('click', () => {
          this.#messageInput.value += emoji.textContent
          this.#emojiPicker.style.display = 'none'
        })
      })

      // SAKER ATT FIXA:
      // Användar namnet sparas inte om jag refershar sidan, det ska sparas även om sidan refreshas.
      // Fixa så att en text 'error-messesage' visas första gången att användaren måste skriva in ett användarnamn.
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
      this.#usernameButton.addEventListener('click', () => {
        this.username = this.#usernameInput.value
        if (this.username) {
          localStorage.setItem('username', this.username)
          this.socket = new WebSocket(URL)
          this.socket.onmessage = this.handleMessage.bind(this)
          this.#sendButton.addEventListener('click', () => this.sendMessage())
          this.#errorMessage.style.display = 'none'
        } else {
          this.#errorMessage.textContent = 'Please enter your username'
          this.#errorMessage.style.display = 'block'
        }
      })
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
  })
