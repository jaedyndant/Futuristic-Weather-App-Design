
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error('Root element not found. Make sure there is an element with id="root" in your HTML.');
  }

  try {
    createRoot(rootElement).render(<App />);
  } catch (error) {
    console.error('Failed to render application:', error);
    // Show user-friendly error message
    rootElement.innerHTML = '<div style="padding: 20px; color: red;">Application failed to load. Please refresh the page.</div>';
  }
  