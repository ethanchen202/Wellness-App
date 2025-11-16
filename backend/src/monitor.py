import asyncio
import random
import cv2
import mediapipe as mp
import numpy as np
from collections import deque
from src.utils import wait_for_unpause
import time
from src.posture_engine import mp_drawing, mp_pose, compute_bad_posture_score, compute_posture_metrics
from src.blink_engine import LEFT_EYE, RIGHT_EYE

from src.blink_engine import compute_EAR

mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# ---------------------------
# USED FOR WEBSOCKET
# ---------------------------
async def run_combined_monitor(recording_flag, posture_manager, blink_manager):
    print("combined monitor started")

    # ---- CAMERA SETUP ----
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH,  640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    # ---- MEDIAPIPE SETUP ----
    pose = mp_pose.Pose(
        static_image_mode=False,
        model_complexity=1,
        enable_segmentation=False,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    face_mesh = mp_face_mesh.FaceMesh(
        refine_landmarks=True,
        max_num_faces=1,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    # ---- POSTURE HISTORY ----
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0 or fps > 120:
        fps = 30

    window_seconds = 3
    bad_history = deque(maxlen=int(fps * window_seconds))

    # ---- BLINK HISTORY ----
    EAR_THRESHOLD = 0.23
    EAR_CONSEC_FRAMES = 2
    frame_counter = 0
    blink_times = deque()

    while True:
        # wait until recording_flag = True (non-blocking)
        await wait_for_unpause(recording_flag)

        ret, frame = cap.read()
        if not ret:
            await asyncio.sleep(0.01)
            continue

        # Mirror the frame
        frame = cv2.flip(frame, 1)
        h, w, _ = frame.shape
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # ---------- POSTURE PROCESSING ----------
        posture_score = None
        current_posture = "unknown"

        pose_results = pose.process(rgb)
        if pose_results.pose_landmarks:
            lm = pose_results.pose_landmarks.landmark

            metrics = compute_posture_metrics(lm, w, h)
            posture_score = compute_bad_posture_score(metrics)

            bad_history.append(posture_score)
            avg_score = np.mean(bad_history)
            current_posture = "bad" if avg_score > 0.5 else "good"

        # ---------- BLINK PROCESSING ----------
        blink_rate = 0
        current_blink = "unknown"

        face_results = face_mesh.process(rgb)
        if face_results.multi_face_landmarks:
            face = face_results.multi_face_landmarks[0].landmark

            left_EAR  = compute_EAR(face, w, h, LEFT_EYE)
            right_EAR = compute_EAR(face, w, h, RIGHT_EYE)
            EAR       = (left_EAR + right_EAR) / 2.0

            # Blink logic
            if EAR < EAR_THRESHOLD:
                frame_counter += 1
            else:
                if frame_counter >= EAR_CONSEC_FRAMES:
                    blink_times.append(time.time())
                frame_counter = 0

            # cleanup blink timestamps older than 60s
            now = time.time()
            while blink_times and now - blink_times[0] > 60:
                blink_times.popleft()

            blink_rate = len(blink_times)
            current_blink = "bad" if blink_rate > 10 else "good"

        # ---------- BROADCAST TO SOCKETS ----------
        if posture_score is not None:
            await posture_manager.broadcast({"posture": current_posture})

        await blink_manager.broadcast({"blink": blink_rate})

        # yield to event loop (important!)
        await asyncio.sleep(0)  

    cap.release()


async def main_backend(recording_flag, general_manager):
    print("combined monitor started")

    # ---- CAMERA SETUP ----
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH,  640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    # ---- MEDIAPIPE SETUP ----
    pose = mp_pose.Pose(
        static_image_mode=False,
        model_complexity=1,
        enable_segmentation=False,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    face_mesh = mp_face_mesh.FaceMesh(
        refine_landmarks=True,
        max_num_faces=1,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    # ---- POSTURE HISTORY (SHORT-TERM SMOOTHING) ----
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0 or fps > 120:
        fps = 30

    window_seconds = 3
    bad_history = deque(maxlen=int(fps * window_seconds))

    # ---- BLINK HISTORY ----
    EAR_THRESHOLD = 0.23
    EAR_CONSEC_FRAMES = 2
    frame_counter = 0
    blink_times = deque([time.time()] * 15)  # timestamps of each detected blink (for last 60s)

    # ---- PROLONGED STATE CONFIG ----
    # Posture: "prolonged bad" = 60s of continuous bad posture
    POSTURE_PROLONGED_THRESHOLD_SEC = 2

    # Blink: "prolonged low blink rate" = < 8 blinks/min for at least 60s
    LOW_BLINK_RATE_THRESHOLD = 8          # blinks / minute
    LOW_BLINK_PROLONGED_THRESHOLD_SEC = 2

    # ---- PROLONGED STATE VARIABLES ----
    posture_bad_since = None
    posture_prolonged_active = False

    low_blink_since = None
    low_blink_prolonged_active = False

    while True:
        # wait until recording_flag = True (non-blocking)
        await wait_for_unpause(recording_flag)

        ret, frame = cap.read()
        if not ret:
            await asyncio.sleep(0.01)
            continue

        now = time.time()

        # Mirror the frame
        frame = cv2.flip(frame, 1)
        h, w, _ = frame.shape
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # ---------- POSTURE PROCESSING ----------
        posture_score = None
        current_posture = "unknown"

        pose_results = pose.process(rgb)
        if pose_results.pose_landmarks:
            lm = pose_results.pose_landmarks.landmark

            metrics = compute_posture_metrics(lm, w, h)
            posture_score = compute_bad_posture_score(metrics)

            bad_history.append(posture_score)
            avg_score = np.mean(bad_history)
            current_posture = "bad" if avg_score > 0.67 else "good"
        else:
            current_posture = "unknown"

        # ---------- BLINK PROCESSING ----------
        blink_rate = None    # blinks per 60s
        face_visible = False

        face_results = face_mesh.process(rgb)
        if face_results.multi_face_landmarks:
            face_visible = True
            face = face_results.multi_face_landmarks[0].landmark

            left_EAR  = compute_EAR(face, w, h, LEFT_EYE)
            right_EAR = compute_EAR(face, w, h, RIGHT_EYE)
            EAR       = (left_EAR + right_EAR) / 2.0

            # Blink logic
            if EAR < EAR_THRESHOLD:
                frame_counter += 1
            else:
                if frame_counter >= EAR_CONSEC_FRAMES:
                    blink_times.append(now)
                frame_counter = 0

        # cleanup blink timestamps older than 60s
        while blink_times and now - blink_times[0] > 60:
            blink_times.popleft()

        # compute blink rate over last 60s if face is visible
        if face_visible:
            blink_rate = len(blink_times)

        # ---------- PROLONGED POSTURE LOGIC & WEBSOCKET EVENTS ----------
        # We treat "unknown" posture (no pose detected) as a break in continuity.
        if current_posture == "bad":
            if posture_bad_since is None:
                posture_bad_since = now

            bad_duration = now - posture_bad_since

            if (not posture_prolonged_active and
                    bad_duration >= POSTURE_PROLONGED_THRESHOLD_SEC):
                posture_prolonged_active = True

                # Send a single event when prolonged bad posture starts
                await general_manager.broadcast({
                    "type": "posture_warning",
                    "status": "prolonged_bad",
                    "bad_duration_sec": int(bad_duration),
                })

        else:
            # Posture is either "good" or "unknown" -> break streak
            if posture_prolonged_active:
                posture_prolonged_active = False
                posture_bad_since = None

                # Notify client that posture returned to non-prolonged state
                await general_manager.broadcast({
                    "type": "posture_resolved",
                    "status": "back_to_good_or_unknown",
                })
            else:
                posture_bad_since = None

        # ---------- PROLONGED LOW BLINK RATE LOGIC & WEBSOCKET EVENTS ----------
        # Only reason about eye fatigue when we have a face in frame and a blink_rate.
        if face_visible and blink_rate is not None:
            if blink_rate < LOW_BLINK_RATE_THRESHOLD:
                if low_blink_since is None:
                    low_blink_since = now

                low_duration = now - low_blink_since

                if (not low_blink_prolonged_active and
                        low_duration >= LOW_BLINK_PROLONGED_THRESHOLD_SEC):
                    low_blink_prolonged_active = True

                    await general_manager.broadcast({
                        "type": "blink_warning",
                        "status": "prolonged_low_rate",
                        "blink_rate_per_min": blink_rate,
                        "low_duration_sec": int(low_duration),
                    })
            else:
                # Blink rate back to normal
                if low_blink_prolonged_active:
                    low_blink_prolonged_active = False
                    low_blink_since = None

                    await general_manager.broadcast({
                        "type": "blink_resolved",
                        "status": "back_to_normal",
                        "blink_rate_per_min": blink_rate,
                    })
                else:
                    low_blink_since = None
        else:
            # No reliable face / blink measurement -> clear any active low-blink state
            if low_blink_prolonged_active:
                low_blink_prolonged_active = False
                low_blink_since = None

                await general_manager.broadcast({
                    "type": "blink_resolved",
                    "status": "face_not_visible",
                })
            else:
                low_blink_since = None

        # yield to event loop (important!)
        await asyncio.sleep(0)

    cap.release()