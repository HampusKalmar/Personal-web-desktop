# <message-application> Web component

The <message-application> web component represents a chat application, built with web components technology. It connects to a WebSocket server for real-time message communication.

# Features

- User can set a username which will be stored locally and persist between sessions.
- User can send text messages and emojis.
- All messages will be displayed in a scrollable list.
- The last 20 messages are stored and displayed in the list.
- The component maintains the state of the WebSocket connection and handles message sending and receiving.

# Attributes

The component does not have any customizable attributes. 

# Example usage 

The message-application is a custom element, so you can use it directly in your HTML file. You do it like this: <message-application>
