# <tic-tac-toe> Web component

A web component that represents a tic-tac-toe game. The goal of the is to get three 'x'-symbols in a row. 
You are playing against the computer, which is using the symbol 'o'.

The component utilizes Shadow DOM to encapsulate its style and structure, providing isolation from the rest of the webpage.

# Example usage 

To try this application follow these steps:
1. import the tic-tac-toe.js file with the correct path.
2. Inside the body tag in the index.html module, add this: <tic-tac-toe>
3. Start the application by running 'npm run dev' in the console.
4. Go to the provided link and play the game.

# Dependencies

This component has no external dependencies.

# Game logic 

When the game starts, startGame() method sets up the board and resets all game state. The handleCellClick(cell) method handles the player's move when a cell is clicked. The computerMove() method handles the computer's move. The checkWin(player) method checks if the given player has won. The isDraw() method checks if the game is a draw.