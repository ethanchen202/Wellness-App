// services/electronNotificationService.ts
/**
 * Service for handling Electron native notifications
 * Shows notifications even when app is minimized/in background
 */
export class ElectronNotificationService {
  static showNotification(title: string, options?: NotificationOptions) {
    // For Electron main process
    if (window.require) {
      try {
        const { ipcRenderer } = window.require("electron");
        ipcRenderer.send("show-notification", {
          title,
          options: {
            icon: "path/to/icon.png", // Update path to your icon
            ...options,
          },
        });
      } catch (err) {
        console.warn("Electron IPC not available, using fallback");
        this.fallbackNotification(title, options);
      }
    } else {
      this.fallbackNotification(title, options);
    }
  }

  private static fallbackNotification(
    title: string,
    options?: NotificationOptions
  ) {
    // Fallback for web or when Electron not available
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        icon: "path/to/icon.png",
        ...options,
      });
    }
  }

  static requestPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }
}
