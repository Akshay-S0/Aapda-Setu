# Raspberry Pi 5 Drone Alert System Script
# This script waits for a person to be detected by a camera
# and then plays an audio file through a connected speaker.
#
# Prerequisites:
# 1. Pygame library installed: pip install pygame
# 2. An audio file named 'sound.mp3' in the same directory.
# 3. Hardware connected (USB Audio Adapter, Amplifier, Speaker).
# 4. A computer vision script/library (like OpenCV) that can
#    detect people and return True when a person is seen.

import pygame
import time
import random # Using random for simulation purposes

# --- Configuration ---
# The name of the audio file you want to play.
AUDIO_FILE = "sound.mp3" 
# How long to wait (in seconds) before checking for a person again.
DETECTION_COOLDOWN = 5

def detect_person_on_drone_camera():
    """
    *** This is a placeholder function! ***
    In a real application, you would replace this with your actual
    computer vision code that analyzes the drone's camera feed.
    
    For example, using a library like OpenCV, you would:
    1. Capture a frame from the camera.
    2. Run a pre-trained model (like YOLO or MobileNet SSD) on the frame.
    3. Check if the model's output includes a 'person' class.
    4. Return True if a person is detected, otherwise return False.
    
    To simulate this for testing, this function will randomly "detect"
    a person every few calls.
    """
    print("Scanning for people...")
    # REPLACE THIS LINE with your actual detection logic.
    if random.randint(0, 3) == 0:
        print("!!! Person Detected !!!")
        return True
    else:
        print("...nothing seen.")
        return False

def play_sound(file_path):
    """
    Initializes the pygame mixer and plays the specified sound file.
    """
    try:
        # Initialize pygame mixer
        # We can initialize it once at the start of the main loop too.
        pygame.mixer.init()
        
        # Load the sound file
        print(f"Loading audio file: {file_path}...")
        pygame.mixer.music.load(file_path)
        
        # Play the sound file
        print("Playing alert sound...")
        pygame.mixer.music.play()
        
        # Keep the function busy while the music is playing
        while pygame.mixer.music.get_busy():
            time.sleep(0.5)
            
        print("Playback finished.")
        pygame.mixer.quit() # Quit the mixer to release resources

    except pygame.error as e:
        print(f"Error playing sound: {e}")
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")

def main_loop():
    """
    The main operational loop for the drone's alert system.
    """
    print("Drone Alert System Initialized. Starting main loop...")
    while True:
        # Check the camera for a person
        person_spotted = detect_person_on_drone_camera()
        
        if person_spotted:
            # If a person is seen, play the alert sound
            play_sound(AUDIO_FILE)
            
            # Wait for the cooldown period to avoid spamming the alert
            print(f"Entering cooldown for {DETECTION_COOLDOWN} seconds.")
            time.sleep(DETECTION_COOLDOWN)
        else:
            # If no one is seen, wait a short time before checking again
            time.sleep(2)


if _name_ == "_main_":
    try:
        main_loop()
    except KeyboardInterrupt:
        print("\nProgram stopped by user. Shutting down.")