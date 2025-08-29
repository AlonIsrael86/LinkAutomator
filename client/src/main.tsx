console.log("=== MAIN.TSX IS LOADING ===");

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("All imports successful");

function initializeApp() {
  console.log("Initializing app...");
  const rootElement = document.getElementById("root");
  console.log("Root element found:", !!rootElement);
  
  if (!rootElement) {
    console.error("Root element missing, creating one...");
    const newRoot = document.createElement("div");
    newRoot.id = "root";
    document.body.appendChild(newRoot);
    return newRoot;
  }
  
  return rootElement;
}

function startApp() {
  console.log("Starting app...");
  try {
    const rootElement = initializeApp();
    
    const root = createRoot(rootElement);
    console.log("Rendering full app...");
    
    root.render(<App />);
    console.log("App rendered successfully!");
    
  } catch (error) {
    console.error("Error in main.tsx:", error);
    document.body.innerHTML = `
      <div style="padding: 20px; color: red; background-color: white; min-height: 100vh;">
        <h1>Loading Error</h1>
        <p>Failed to load Link Automator</p>
        <pre>${error?.toString()}</pre>
        <p>Debug info: Document ready state was ${document.readyState}</p>
      </div>
    `;
  }
}

// Wait for DOM and then initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}