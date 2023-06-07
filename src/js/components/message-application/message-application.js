const URL = 'https://courselab.lnu.se/message-app/socket'

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

    #sendButton

    #messageList

    apiKey
    /**
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#messageApp = this.shadowRoot.querySelector('#message-app')
      this.#messageInput = this.shadowRoot.querySelector('#message-input')
      this.#sendButton = this.shadowRoot.querySelector('#send-button')
      this.#messageList = this.shadowRoot.querySelector('#message-list')

      this.apiKey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'

      this.#sendButton.addEventListener('click', this.sendMessage())
    }

    /**
     *
     */
    connectedCallback () {
      this.fetchMessages()
    }

    /**
     *
     */
    async fetchMessages () {
      try {
        const res = await window.fetch(URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`
          }
        })
        if (res.status === 200) {
          const messages = await res.json()
          this.displayMessages(messages)
        } else {
          throw new Error('Error')
        }
      } catch (err) {
        console.error(err.message)
      }
    }

    /**
     *
     */
    async sendMessage () {
      const message = {
        type: 'message',
        data: this.#messageInput.value,
        username: 'MyFancyUsername',
        channel: 'my, not so secret, channel',
        key: this.apiKey
      }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(message)
      }

      try {
        const response = await fetch(URL, requestOptions)
        if (response.status === 200) {
          console.log('Message sent successfully')
          this.#messageInput.value = ''
        } else {
          throw new Error('Error sending message')
        }
      } catch (error) {
        console.error(error.message)
      }
    }

    /**
     *
     * @param messages
     */
    displayMessages (messages) {
      this.#messageList.innerHTML = ''

      for (const message of messages) {
        const listItem = document.createElement('li')
        listItem.textContent = `${message.username}: ${message.data}`
        this.#messageList.appendChild(listItem)
      }
    }
  })
