
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { register } from './serviceWorkerRegistration'

// Registra o service worker assim que possível
register({
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting;
    
    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener("statechange", event => {
        if ((event.target as ServiceWorker).state === "activated") {
          window.location.reload();
        }
      });
      
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
