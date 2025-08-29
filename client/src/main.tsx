console.log("=== MAIN.TSX IS LOADING ===");

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Wait for DOM to be ready
function initializeApp() {
  console.log("Initializing app...");
  console.log("Document ready state:", document.readyState);
  console.log("Document body:", document.body);
  console.log("All elements in body:", document.body?.children);
  
  const rootElement = document.getElementById("root");
  console.log("Looking for root element:", rootElement);
  
  if (!rootElement) {
    console.error("Root element not found! Creating one...");
    // Create root element if missing
    const newRoot = document.createElement("div");
    newRoot.id = "root";
    document.body.appendChild(newRoot);
    console.log("Created new root element");
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