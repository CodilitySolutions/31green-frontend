import HomePage from "./pages/HomePage"
import "./App.css"

/**
 * Main App component that serves as the root of the application
 * Renders the HomePage component which contains the main functionality
 */
function App(): JSX.Element {
  return (
    <div className="App">
      <HomePage />
    </div>
  )
}

export default App
