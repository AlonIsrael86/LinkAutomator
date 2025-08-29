console.log("=== MAIN.TSX IS LOADING ===");

// Imports must be at the top
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Test basic JavaScript execution
console.log("✅ All imports successful!");
console.log("JavaScript is executing!");
console.log("Window location:", window.location.href);

// Test if we can access DOM
const rootElement = document.getElementById("root");
if (rootElement) {
  rootElement.innerHTML = '<div style="padding: 20px; background: green; color: white;"><h1>✅ JavaScript and React Ready!</h1><p>All imports loaded successfully</p></div>';
  console.log("✅ DOM manipulation successful!");
} else {
  console.error("❌ Root element not found!");
}

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
  console.log("=== STARTING APP ===");
  console.log("Current domain:", window.location.hostname);
  console.log("Current port:", window.location.port);
  console.log("Current protocol:", window.location.protocol);
  console.log("Full URL:", window.location.href);
  
  try {
    const rootElement = initializeApp();
    console.log("Root element acquired successfully");
    
    // Force clear the fallback content
    if (rootElement) {
      console.log("Clearing fallback content...");
      rootElement.innerHTML = '<div style="color: green;">🚀 Mounting React app...</div>';
      console.log("Content cleared, creating React root...");
      
      const root = createRoot(rootElement);
      console.log("React root created successfully, rendering...");
      
      // Add a small delay to ensure DOM is ready
      setTimeout(() => {
        console.log("Rendering App component...");
        root.render(<App />);
        console.log("✅ App rendered successfully!");
      }, 100);
    } else {
      throw new Error("Root element not found!");
    }
    
  } catch (error) {
    console.error("❌ CRITICAL ERROR in startApp:", error);
    const rootElement = document.getElementById("root") || document.body;
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; color: red; background-color: yellow; min-height: 100vh;">
          <h1>🚨 MOUNTING FAILED</h1>
          <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
          <pre>${error instanceof Error ? error.stack : String(error)}</pre>
          <p><strong>Debug Info:</strong></p>
          <p>URL: ${window.location.href}</p>
          <p>Port: ${window.location.port || 'default'}</p>
          <p>Document ready: ${document.readyState}</p>
        </div>
      `;
    }
  }
}

// Wait for DOM and then initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}