import asyncio
import random
import cv2
import mediapipe as mp
import numpy as np
from collections import deque
from src.utils import wait_for_unpause
import time

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

def get_point(landmarks, idx, w, h):
    lm = landmarks[idx]
    return np.array([lm.x * w, lm.y * h, lm.z * w])  # scale z ~ width


def angle_with_vertical(p1, p2):
    """
    Angle (in degrees) between vector p2->p1 and the vertical axis.
    0° = perfectly vertical, larger = more slouched/tilted.
    """
    v = p1 - p2
    # vertical direction: (0, -1, 0) in image coordinates (y down)
    vertical = np.array([0, -1, 0], dtype=np.float32)
    v_norm = np.linalg.norm(v)
    if v_norm < 1e-6:
        return 0.0
    v_unit = v / v_norm
    dot = np.clip(np.dot(v_unit, vertical), -1.0, 1.0)
    angle_rad = np.arccos(dot)
    return np.degrees(angle_rad)


def euclidean_distance(p1, p2):
    return float(np.linalg.norm(p1 - p2))


def compute_posture_metrics(landmarks, w, h):
    # Key points
    L_SH = get_point(landmarks, mp.solutions.pose.PoseLandmark.LEFT_SHOULDER, w, h)
    R_SH = get_point(landmarks, mp.solutions.pose.PoseLandmark.RIGHT_SHOULDER, w, h)
    L_HIP = get_point(landmarks, mp.solutions.pose.PoseLandmark.LEFT_HIP, w, h)
    R_HIP = get_point(landmarks, mp.solutions.pose.PoseLandmark.RIGHT_HIP, w, h)
    NOSE = get_point(landmarks, mp.solutions.pose.PoseLandmark.NOSE, w, h)

    # Midpoints
    MID_SH = 0.5 * (L_SH + R_SH)
    MID_HIP = 0.5 * (L_HIP + R_HIP)

    # 1) Back angle: shoulder-to-hip line vs vertical
    back_angle = angle_with_vertical(MID_SH, MID_HIP)  # larger = more leaning

    # 2) Neck angle: head-to-shoulder line vs vertical
    neck_angle = angle_with_vertical(NOSE, MID_SH)      # larger = more forward neck

    # 3) Head forward distance (how far nose is in front of shoulders in z or x)
    # Option A: use x-offset (nose left/right vs shoulders) — but not ideal.
    # Option B: use z difference (depth) — more robust.
    head_forward_raw = NOSE[2] - MID_SH[2]  # positive = closer to camera
    # Convert to "cm-ish": scale relative to shoulder width
    shoulder_width_px = euclidean_distance(L_SH, R_SH)
    if shoulder_width_px < 1e-6:
        shoulder_width_px = 1.0
    head_forward_cm = (head_forward_raw / shoulder_width_px) * 30.0  # 30 cm ≈ 1 shoulder-width

    # 4) Shoulder tilt (alignment): difference in y-coordinates
    shoulder_tilt_deg = np.degrees(
        np.arctan2(L_SH[1] - R_SH[1], L_SH[0] - R_SH[0])
    )  # angle vs horizontal

    return {
        "back_angle": back_angle,
        "neck_angle": neck_angle,
        "head_forward_cm": head_forward_cm,
        "shoulder_tilt_deg": shoulder_tilt_deg,
    }


def compute_bad_posture_score(metrics):
    back = metrics["back_angle"]
    neck = metrics["neck_angle"]
    head_fwd = metrics["head_forward_cm"]
    tilt = abs(metrics["shoulder_tilt_deg"])

    # Normalize each into [0,1] “badness” scores using piecewise linear functions.
    def norm_bad(x, good_max, bad_max):
        # 0 if x <= good_max, 1 if x >= bad_max, linear in between
        if x <= good_max:
            return 0.0
        if x >= bad_max:
            return 1.0
        return (x - good_max) / (bad_max - good_max)

    back_bad = norm_bad(back, good_max=8, bad_max=20)
    neck_bad = norm_bad(neck, good_max=50, bad_max=80)
    head_bad = norm_bad(abs(head_fwd), good_max=2, bad_max=8)
    tilt_bad = norm_bad(tilt, good_max=5, bad_max=20)

    # Weighted sum; you can tune these based on your app’s priorities.
    score = (
        0.00 * back_bad +
        1.00 * neck_bad +
        0.00 * head_bad +
        0.00 * tilt_bad
    )
    return float(np.clip(score, 0.0, 1.0))


def main():
    cap = cv2.VideoCapture(0)  # 0 = default camera

    # Optional: lower resolution to reduce CPU usage
    cap.set(cv2.CAP_PROP_FRAME_WIDTH,  640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    pose = mp_pose.Pose(
        static_image_mode=False,
        model_complexity=1,  # 0,1,2 (higher = more accurate, slower)
        enable_segmentation=False,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    # For temporal smoothing
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0 or fps > 120:  # fallback if unknown
        fps = 30
    window_seconds = 3
    max_len = int(fps * window_seconds)
    bad_history = deque(maxlen=max_len)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Flip horizontally so it feels like a mirror
        frame = cv2.flip(frame, 1)
        h, w, _ = frame.shape

        # Convert to RGB for MediaPipe
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = pose.process(rgb)

        bad_posture_score = 0.0
        debug_text = "No person detected"

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            # Compute posture metrics
            metrics = compute_posture_metrics(landmarks, w, h)
            bad_posture_score = compute_bad_posture_score(metrics)

            debug_text = (
                f"Back: {metrics['back_angle']:.1f}°, "
                f"Neck: {metrics['neck_angle']:.1f}°, "
                f"Head fwd: {metrics['head_forward_cm']:.1f}cm, "
                f"Score: {bad_posture_score:.2f}"
            )

            # Draw pose for visualization
            mp_drawing.draw_landmarks(
                frame,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS,
            )

        # Update rolling history
        bad_history.append(bad_posture_score)

        # Decide if posture is bad for prolonged period
        avg_score = np.mean(bad_history) if bad_history else 0.0
        is_bad_now = avg_score > 0.5  # tune threshold

        if is_bad_now:
            cv2.putText(
                frame,
                "BAD POSTURE - Please straighten up!",
                (30, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.9,
                (0, 0, 255),
                2,
                cv2.LINE_AA,
            )

        # Debug text
        cv2.putText(
            frame,
            debug_text,
            (30, h - 30),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2,
            cv2.LINE_AA,
        )

        cv2.imshow("Posture Monitor", frame)
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()


# ---------------------------
# USED FOR WEBSOCKET
# ---------------------------
async def run_posture_monitor(recording_flag, posture_manager):
    print("monitor loop started")

    # while True:
    #     await posture_manager.broadcast({"posture": "bad"})
    #     await asyncio.sleep(1)
    # return
    cap = cv2.VideoCapture(0)  # 0 = default camera

    # Optional: lower resolution to reduce CPU usage
    cap.set(cv2.CAP_PROP_FRAME_WIDTH,  640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    pose = mp_pose.Pose(
        static_image_mode=False,
        model_complexity=1,  # 0,1,2 (higher = more accurate, slower)
        enable_segmentation=False,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    # For temporal smoothing
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0 or fps > 120:  # fallback if unknown
        fps = 30
    window_seconds = 3
    max_len = int(fps * window_seconds)
    bad_history = deque(maxlen=max_len)

    while True:
        await wait_for_unpause(recording_flag)

        ret, frame = cap.read()
        if not ret:
            break

        # Flip horizontally so it feels like a mirror
        frame = cv2.flip(frame, 1)
        h, w, _ = frame.shape

        # Convert to RGB for MediaPipe
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = pose.process(rgb)

        bad_posture_score = 0.0
        debug_text = "No person detected"

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            # Compute posture metrics
            metrics = compute_posture_metrics(landmarks, w, h)
            bad_posture_score = compute_bad_posture_score(metrics)

            debug_text = (
                f"Back: {metrics['back_angle']:.1f}°, "
                f"Neck: {metrics['neck_angle']:.1f}°, "
                f"Head fwd: {metrics['head_forward_cm']:.1f}cm, "
                f"Score: {bad_posture_score:.2f}"
            )

        # Update rolling history
        bad_history.append(bad_posture_score)

        # Decide if posture is bad for prolonged period
        avg_score = np.mean(bad_history) if bad_history else 0.0
        is_bad_now = avg_score > 0.5  # tune threshold

        # send to socket connections
        current_posture = "bad" if is_bad_now else "good"
        # current_blink = random.choice(["blinking", "not_blinking"]) # TODO: implement blink detection
        await posture_manager.broadcast({"posture": current_posture})
        # await blink_manager.broadcast({"blink": current_blink})

    cap.release()
    # cv2.destroyAllWindows()