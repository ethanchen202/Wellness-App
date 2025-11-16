import cv2
import mediapipe as mp
import numpy as np
import time
from collections import deque

mp_face_mesh = mp.solutions.face_mesh

# Indices for eye landmarks in MediaPipe FaceMesh
LEFT_EYE = [33, 160, 158, 133, 153, 144] 
RIGHT_EYE = [362, 385, 387, 263, 373, 380]

def euclidean(p1, p2):
    return np.linalg.norm(p1 - p2)

def get_point(landmarks, idx, w, h):
    lm = landmarks[idx]
    return np.array([lm.x * w, lm.y * h], dtype=np.float32)

def compute_EAR(landmarks, w, h, eye_indices):
    pts = [get_point(landmarks, i, w, h) for i in eye_indices]

    # For 6 landmarks:
    # EAR = (||p2 - p6|| + ||p3 - p5||) / (2 * ||p1 - p4||)
    v1 = euclidean(pts[1], pts[5])
    v2 = euclidean(pts[2], pts[4])
    h_len = euclidean(pts[0], pts[3])

    ear = (v1 + v2) / (2.0 * h_len + 1e-6)
    return float(ear)

def eye_fatigue_detector():
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    face_mesh = mp_face_mesh.FaceMesh(
        refine_landmarks=True,
        max_num_faces=1,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )

    # EAR threshold & blink detection state
    EAR_THRESHOLD = 0.23          # Typical threshold
    EAR_CONSEC_FRAMES = 2         # How many frames to count as blink
    frame_counter = 0
    blink_count = 0

    # Rolling history of blink timestamps (60 seconds)
    blink_times = deque()

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        h, w, _ = frame.shape
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = face_mesh.process(rgb)

        blink_rate = 0
        display_text = "Face not detected"

        if results.multi_face_landmarks:
            face = results.multi_face_landmarks[0]
            lm = face.landmark

            # Compute EAR for both eyes
            left_EAR = compute_EAR(lm, w, h, LEFT_EYE)
            right_EAR = compute_EAR(lm, w, h, RIGHT_EYE)
            EAR = (left_EAR + right_EAR) / 2.0

            # Blink detection
            if EAR < EAR_THRESHOLD:
                frame_counter += 1
            else:
                if frame_counter >= EAR_CONSEC_FRAMES:
                    # Genuine blink
                    t = time.time()
                    blink_times.append(t)
                frame_counter = 0

            # Remove timestamps older than 60 seconds
            now = time.time()
            while blink_times and now - blink_times[0] > 60:
                blink_times.popleft()

            # Compute blinks per minute
            blink_rate = len(blink_times)

            display_text = f"EAR: {EAR:.3f}  Blinks/min: {blink_rate}"

            # Eye fatigue detection
            if blink_rate < 10:    # <10/min is strong fatigue sign
                cv2.putText(
                    frame,
                    "Eye Fatigue Detected! Blink More or Rest.",
                    (20, 50),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.8,
                    (0, 0, 255),
                    2
                )

        # Display debug text
        cv2.putText(
            frame,
            display_text,
            (20, h - 30),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 255),
            2
        )

        cv2.imshow("Eye Fatigue Monitor", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    eye_fatigue_detector()
