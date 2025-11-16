import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./global.css";
import { NotificationProvider } from "./context/NotificationContext.tsx";
import { PersistentNotificationProvider } from "./context/PersistentNotificationContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NotificationProvider>
      <PersistentNotificationProvider>
        <App />
      </PersistentNotificationProvider>
    </NotificationProvider>
  </React.StrictMode>
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
