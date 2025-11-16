# **Axial – Real-Time Posture & Focus Monitoring**
Axial is a lightweight background desktop app that helps you maintain healthy posture and stay focused while working. Using your device’s webcam (processed locally), Axial continuously analyzes upper-body posture, blinking frequency, and signs of fatigue—then sends gentle reminders when you need them.

Axial is designed to be **private**, **efficient**, and **non-intrusive**, built for students, developers, and anyone working long hours at a computer.

---

## **Features**
### **Real-Time Posture Detection**
- Tracks head, shoulder, and spine alignment using MediaPipe Pose  
- Computes slouch angle, head tilt, shoulder droop, and forward-lean metrics  
- Detects **prolonged bad posture** across a sliding time window  
- Sends notifications only when poor posture persists

### **Blinking & Fatigue Monitoring**
- Tracks blink frequency and blink irregularity  
- Detects possible signs of eye strain or fatigue  
- Optional reminders to look away from the screen or take a quick break

### **Desktop App (Runs in Background)**
- Minimal, modern UI  
- Tray icon control (start/stop monitoring, sensitivity settings)  
- Auto-start on boot (optional)

### **Backend–Frontend Architecture**
- **Backend:** Python + OpenCV + MediaPipe, running continuous inference  
- **Frontend:** Electron/React (or your chosen UI) consuming updates via WebSocket  
- Real-time streaming of posture/blink metrics to UI

### **Privacy First**
- **No frames are ever stored or uploaded**  
- All vision inference happens locally on your machine  
- App works entirely offline