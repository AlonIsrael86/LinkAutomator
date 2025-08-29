// Add debugging
console.log("main.tsx is loading...");

import { createRoot } from "react-dom/client";
import "./index.css";

console.log("React imported successfully");

try {
  console.log("Checking root element...");
  const rootElement = document.getElementById("root");
  console.log("Root element found:", rootElement);
  
  if (!rootElement) {
    document.body.innerHTML = '<div style="padding: 20px; color: red;">Root element not found!</div>';
    throw new Error("Root element not found");
  }

  console.log("Creating root...");
  const root = createRoot(rootElement);
  
  console.log("Testing basic render...");
  root.render(
    <div style={{ padding: '20px', backgroundColor: 'white', color: 'black', minHeight: '100vh' }}>
      <h1>React is Working!</h1>
      <p>If you see this, React is mounting correctly.</p>
      <p>Loading full app in 2 seconds...</p>
    </div>
  );
  
  console.log("Basic render successful! Now loading full app...");
  
  // Load full app after basic test works
  setTimeout(async () => {
    try {
      console.log("Loading full App component...");
      const { default: App } = await import("./App");
      
      root.render(<App />);
      console.log("Full app loaded successfully!");
    } catch (error) {
      console.error("Error loading full app:", error);
      root.render(
        <div style={{ padding: '20px', color: 'red', backgroundColor: 'white' }}>
          <h1>App Load Error</h1>
          <pre>{error?.toString()}</pre>
        </div>
      );
    }
  }, 2000);
  
} catch (error) {
  console.error("Critical error in main.tsx:", error);
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; background-color: white;">
      <h1>JavaScript Error</h1>
      <pre>${error?.toString()}</pre>
    </div>
  `;
}
