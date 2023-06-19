# <dock-application> Web component

This is a custom web component for a dock application, named dock-application. The dock-application is a UI component that displays a dock of applications at the bottom of your webpage. Each application is represented by an image and a text description. Currently, the dock contains three applications: Chat, Memory, and Tic Tac Toe.

The component utilizes Shadow DOM to encapsulate its style and structure, providing isolation from the rest of the webpage.

# Example usage

- Import the component's JavaScript file into your project.
- Use the component in your HTML just like any other HTML element.

This will create a dock at the bottom of the page with the three applications: Chat, Memory, and Tic Tac Toe.

# Dependencies

This component is dependent on the sub-window component, which must be defined and imported into your project for this component to function correctly. The sub-window component is used to create the sub-windows for each application when an application on the dock is clicked.