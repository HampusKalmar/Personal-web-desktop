# <sub-window> Web component

This is a custom web component, named sub-window, that creates pop-up sub-windows within a webpage. These sub-windows are draggable and can be closed. Each sub-window can host an application specified at the time of creation.

# Example usage 

To try this application follow these steps:
1. import sub-window.js file with the correct path.
2. Inside the body tag in the index.html module, add this: <sub-window>
3. Start the application by running 'npm run dev' in the console.
4. Go to the provided link and you should be able to see a window which can be closed down.

# Dependencies

This component has no external dependencies.

# Creating Pop-Up Windows

To create a pop-up sub-window, call the createPopUpWindow(appType) method on a sub-window element, where appType is the type of application you want to host in the sub-window. This can be 'message' for a messaging application, 'tic-tac-toe' for a Tic-Tac-Toe game, or 'memory' for a Memory game.