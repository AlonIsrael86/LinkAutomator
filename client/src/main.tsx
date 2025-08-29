console.log("main.tsx is loading...");

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("App component imported successfully");

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
