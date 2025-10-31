import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setupGlobalErrorHandling, logAppStartup } from './utils/browserUtils';

// Setup global error handling for browser extension issues
setupGlobalErrorHandling();

// Log application startup information
logAppStartup();

// Load Worqhat test utilities in development mode
if (import.meta.env.DEV) {
  import('./utils/testWorqhatConnection');
}

createRoot(document.getElementById("root")!).render(<App />);
