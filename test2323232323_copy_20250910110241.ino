#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// --- Replace with your Wi-Fi credentials ---
const char* ssid = "Nothing";
const char* password = "12345678";
// -------------------------------------------

// --- Replace with your Firebase credentials ---
#define API_KEY "YOUR_FIREBASE_API_KEY"
#define DATABASE_URL "https://your-project-id.firebaseio.com/"  
#define USER_EMAIL "your_email@example.com"
#define USER_PASSWORD "your_password"
// -------------------------------------------

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Motor pins
const int dirPin = 14;
const int stepPin = 12;

// Motor states
const int MOTOR_STOP = 0;
const int MOTOR_CW = 1;
const int MOTOR_CCW = 2;
volatile int motorState = MOTOR_STOP; // Motor is stopped by default

void setup() {
  Serial.begin(115200);

  pinMode(stepPin, OUTPUT);
  pinMode(dirPin, OUTPUT);

  // Connect Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");

  // Firebase config
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  // Sign in with email and password
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  // Initialize Firebase
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Start streaming motor command node
  if (!Firebase.RTDB.beginStream(&fbdo, "/motor/command")) {
    Serial.println("Stream failed: " + fbdo.errorReason());
  }
}

void loop() {
  // Check Firebase stream for command updates
  if (Firebase.RTDB.readStream(&fbdo)) {
    if (fbdo.streamAvailable()) {
      String command = fbdo.stringData();
      Serial.println("Firebase Command: " + command);

      if (command == "cw") {
        motorState = MOTOR_CW;
      } else if (command == "ccw") {
        motorState = MOTOR_CCW;
      } else if (command == "stop") {
        motorState = MOTOR_STOP;
      }
    }
  } else {
    if (fbdo.httpConnected()) {
      Serial.println("Stream error: " + fbdo.errorReason());
    }
  }

  // Run motor based on current state
  switch (motorState) {
    case MOTOR_CW:
      digitalWrite(dirPin, HIGH);   // clockwise
      digitalWrite(stepPin, HIGH);
      delayMicroseconds(1000);
      digitalWrite(stepPin, LOW);
      delayMicroseconds(1000);
      break;

    case MOTOR_CCW:
      digitalWrite(dirPin, LOW);   // counter-clockwise
      digitalWrite(stepPin, HIGH);
      delayMicroseconds(1000);
      digitalWrite(stepPin, LOW);
      delayMicroseconds(1000);
      break;

    case MOTOR_STOP:
      // do nothing
      break;
  }
}
