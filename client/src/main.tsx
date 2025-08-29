// Test if ANY JavaScript runs
console.log("=== MAIN.TSX IS LOADING ===");
document.body.innerHTML = '<div style="padding: 20px; background: yellow; color: black; font-size: 20px;">JavaScript is running! Module loaded successfully.</div>';

console.log("About to import React...");
import { createRoot } from "react-dom/client";
console.log("React imported!");

console.log("About to import App...");  
import App from "./App";
console.log("App imported!");

console.log("About to import CSS...");
import "./index.css";
console.log("CSS imported!");

try {
  const rootElement = document.getElementById("root");
  console.log("Root element found:", rootElement);
  
  if (!rootElement) {
    throw new Error("Root element not found");
  }

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
    </div>
  `;
}
