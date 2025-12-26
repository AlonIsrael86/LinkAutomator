import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Visual indicator that code is running
const indicator = document.createElement('div');
indicator.id = 'debug-indicator';
indicator.style.cssText = 'position:fixed;top:0;left:0;z-index:99999;background:red;color:white;padding:10px;font-weight:bold;';
indicator.textContent = '🔴 MAIN.TSX EXECUTING';
document.body.appendChild(indicator);

console.log('🔴🔴🔴 MAIN.TSX EXECUTING - IF YOU SEE THIS, CODE IS RUNNING 🔴🔴🔴');
console.log('[DEBUG] main.tsx: Script is executing');
console.log('[DEBUG] main.tsx: About to find root element');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('[DEBUG] main.tsx: Root element NOT FOUND!');
  throw new Error("Root element not found!");
}

console.log('[DEBUG] main.tsx: Root element found, creating root');
const root = createRoot(rootElement);
console.log('[DEBUG] main.tsx: About to render App component');
root.render(<App />);
console.log('[DEBUG] main.tsx: App component rendered');