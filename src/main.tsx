import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Load Worqhat test utilities in development mode
if (import.meta.env.DEV) {
  import('./utils/testWorqhatConnection');
}

createRoot(document.getElementById("root")!).render(<App />);
