
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error('Root element not found. Make sure there is an element with id="root" in your HTML.');
  }

  // Register service worker for automatic updates
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              window.location.reload();
            }
          });
        }
      });
    });
  }

  try {
    createRoot(rootElement).render(<App />);
  } catch (error) {
    console.error('Failed to render application:', error);
    // Show user-friendly error message
    rootElement.innerHTML = '<div style="padding: 20px; color: red;">Application failed to load. Please refresh the page.</div>';
  }
  