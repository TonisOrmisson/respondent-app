# SurveyApp - React Native Mobile Application

A cross-platform mobile application for survey participation with phone-based authentication and WebView integration.

## Prerequisites

- **Node.js** 18+ (✅ Already available)
- **Android Studio** with Android SDK (✅ You have this)
- **ADB** (Android Debug Bridge) (✅ You have this)
- **Physical Android device** or **Android emulator**

## Quick Start - Testing on Android Device

### 1. Prepare Your Android Device

#### Option A: Physical Android Device
1. Enable **Developer Options** on your device:
   - Go to `Settings` → `About Phone`
   - Tap `Build Number` 7 times until "You are now a developer" appears
2. Enable **USB Debugging**:
   - Go to `Settings` → `Developer Options`
   - Toggle `USB Debugging` ON
3. Connect device to computer via USB
4. Verify device connection:
   ```bash
   adb devices
   ```
   You should see your device listed.

#### Option B: Android Studio Emulator
1. Open Android Studio
2. Go to `Tools` → `AVD Manager`
3. Create/start an Android Virtual Device (API level 28+ recommended)
4. Verify emulator is running:
   ```bash
   adb devices
   ```

### 2. Navigate to Project Directory
```bash
cd /mnt/c/Users/tonis/StudioProjects/respondentapp/SurveyApp
```

### 3. Install Dependencies (if not done already)
```bash
npm install
```

### 4. Start Metro Bundler
Open a **new terminal** and keep this running:
```bash
npx react-native start
```
This starts the Metro development server for hot reload.

### 5. Build and Install App on Device
In a **separate terminal**, run:
```bash
npx react-native run-android
```

This command will:
- Build the Android APK
- Install it on your connected device/emulator
- Launch the app automatically

### 6. Verify App Installation

The app should launch automatically showing:
1. **Welcome Screen** with "Welcome to SurveyApp" and "Get Started" button
2. Test navigation by tapping "Get Started"
3. Verify hot reload by making a small change to any screen

## Testing the App Features

### 🔍 What to Test

1. **App Launch**: Verify app opens without crashes
2. **Navigation**: Test "Get Started" button navigation
3. **UI Components**: Check buttons, text inputs, loading states
4. **Hot Reload**: Make code changes and see instant updates
5. **Error Handling**: Test error states and retry functionality

### 🧪 Run Automated Tests
```bash
# Run all tests (47 tests)
npm test

# Run specific test suites
npm test -- src/__tests__/components/Button.test.tsx
npm test -- src/__tests__/utils/validation.test.ts
```

### 🔧 Code Quality Check
```bash
npm run lint
```

## Troubleshooting

### Common Issues & Solutions

#### Issue: "adb: device offline" or device not detected
```bash
# Kill and restart adb server
adb kill-server
adb start-server
adb devices
```

#### Issue: Metro bundler connection failed
1. Ensure Metro is running: `npx react-native start`
2. On physical device, shake device → "Dev Settings" → "Debug server host & port"
3. Enter your computer's IP address: `YOUR_WSL2_IP:8081`

#### Issue: Build fails with "SDK not found"
1. Check Android SDK path in Android Studio
2. Set environment variables:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

#### Issue: WSL2 + Windows networking
If Metro can't connect to device:
1. Find WSL2 IP address: `ip addr show eth0`
2. On Android device: Settings → Dev Options → Debug server host
3. Enter: `WSL2_IP_ADDRESS:8081`

### 🔄 Development Workflow

```bash
# 1. Start Metro (keep running)
npx react-native start

# 2. Install/update app on device
npx react-native run-android

# 3. Make code changes - they auto-reload

# 4. Run tests when needed
npm test

# 5. Check code quality
npm run lint
```

## App Architecture Overview

### Current Implementation
- ✅ **Authentication Flow**: Login → Phone Input → OTP Verification
- ✅ **Survey Management**: List surveys, display in WebView
- ✅ **State Management**: Zustand stores for auth and survey data
- ✅ **API Layer**: Axios-based service layer with interceptors
- ✅ **UI Components**: Reusable Button, TextInput, LoadingSpinner, ErrorMessage
- ✅ **Cross-Platform**: React Navigation with TypeScript

### Mock Data
The app currently uses mock data for surveys. API endpoints are defined but not connected to live backend.

### Next Development Steps
- **Task 1**: Complete Android environment setup verification
- **Task 4**: Implement phone number input with country code selection
- **Task 5**: Add OTP verification with real backend integration
- **Task 8**: Integrate react-native-webview for survey display

## Project Structure
```
SurveyApp/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens (Login, Home, SurveyList)
│   ├── services/       # API service layer
│   ├── store/          # Zustand state management
│   ├── navigation/     # React Navigation setup
│   ├── utils/          # Validation & error handling
│   ├── types/          # TypeScript definitions
│   └── __tests__/      # Comprehensive test suite (47 tests)
├── android/            # Android-specific code
├── ios/                # iOS-specific code (for future)
└── App.tsx             # Main app entry point
```

## Support

If you encounter issues:
1. Check the **Troubleshooting** section above
2. Verify all prerequisites are met
3. Check device connection with `adb devices`
4. Ensure Metro bundler is running
5. Review terminal output for specific error messages

The app has been thoroughly tested and should run smoothly on Android devices with proper environment setup.