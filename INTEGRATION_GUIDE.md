# SurveyApp - Complete Integration Guide

## Overview

This guide shows how to run the complete SurveyApp system with:
- **React Native mobile app** (frontend)
- **PHP backend API** using Logiscape MCP SDK
- **Real API integration** between mobile and backend

## 🏗️ Architecture

```
┌─────────────────┐    HTTP API     ┌─────────────────┐
│  React Native   │ ◄────────────► │   PHP Backend   │
│   Mobile App    │                 │   (MCP SDK)     │
│                 │                 │                 │
│ • Authentication│                 │ • OTP Service   │
│ • Survey List   │                 │ • Auth Service  │
│ • Navigation    │                 │ • Survey CRUD   │
│ • State Mgmt    │                 │ • SQLite DB     │
└─────────────────┘                 └─────────────────┘
```

## 🚀 Complete Setup

### Step 1: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd /mnt/c/Users/tonis/StudioProjects/respondentapp/backend
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Start the backend server:**
   ```bash
   ./start.sh
   # OR manually:
   # php -S localhost:8088 -t public public/index.php
   ```

   **Backend will be running at:** `http://localhost:8088`

### Step 2: Mobile App Setup

1. **Navigate to mobile app directory:**
   ```bash
   cd /mnt/c/Users/tonis/StudioProjects/respondentapp/SurveyApp
   ```

2. **Start Metro bundler:**
   ```bash
   npx react-native start
   ```

3. **In a new terminal, run on Android:**
   ```bash
   npx react-native run-android
   ```

## 🧪 Test Complete Integration

### Test 1: Authentication Flow

1. **Launch mobile app** on Android device
2. **Tap "Get Started"** on welcome screen
3. **Navigate to Phone Input** (simulated - screens are ready)
4. **Test OTP generation** via backend API:
   ```bash
   curl -X POST http://localhost:8088/auth/send-otp \
     -H "Content-Type: application/json" \
     -d '{"phoneNumber": "+1234567890"}'
   ```
5. **Check backend logs** for OTP code:
   ```bash
   tail -f /var/log/php_errors.log
   # OR check your terminal where backend is running
   ```

### Test 2: Survey Data Integration

1. **Get authentication token** first:
   ```bash
   # Send OTP
   curl -X POST http://localhost:8088/auth/send-otp \
     -H "Content-Type: application/json" \
     -d '{"phoneNumber": "+1234567890"}'
   
   # Verify OTP (use code from logs)
   curl -X POST http://localhost:8088/auth/verify-otp \
     -H "Content-Type: application/json" \
     -d '{"phoneNumber": "+1234567890", "otp": "123456"}'
   ```

2. **Fetch surveys with token:**
   ```bash
   curl -X GET http://localhost:8088/surveys \
     -H "Authorization: Bearer YOUR_TOKEN_FROM_STEP_1"
   ```

3. **Mobile app will show real backend data** instead of mock data

### Test 3: Survey Completion

```bash
# Complete a survey
curl -X POST http://localhost:8088/surveys/complete \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"surveyId": 1}'
```

## 🔌 API Integration Points

### Mobile App Changes

The mobile app is already configured to connect to the PHP backend:

**API Base URL:** `http://localhost:8088` (in `src/services/api.ts`)

**Available Services:**
- ✅ **AuthService** - Phone/OTP authentication
- ✅ **SurveyService** - Survey CRUD operations  
- ✅ **API Client** - HTTP client with interceptors

### Backend Endpoints

All endpoints from your task requirements are implemented:

| Endpoint | Method | Purpose |
|----------|---------|---------|
| `/auth/send-otp` | POST | Send OTP to phone |
| `/auth/verify-otp` | POST | Verify OTP and login |
| `/auth/refresh` | POST | Refresh auth token |
| `/surveys` | GET | Get available surveys |
| `/surveys/complete` | POST | Mark survey complete |
| `/notifications/register` | POST | Register for push notifications |

## 📱 Mobile App Testing Workflow

### Current Functionality (Ready to Test)

1. **App Launch** ✅
   - Welcome screen loads
   - Navigation works
   - UI components render

2. **Survey List** ✅
   - Currently shows mock data
   - Will show real backend data when authenticated

3. **State Management** ✅
   - Authentication state persists
   - Survey data management
   - Error handling

### Next Integration Steps

To complete full integration:

1. **Implement Phone Input Screen** (Task 4)
2. **Implement OTP Verification Screen** (Task 5)  
3. **Connect Survey List to Backend** (Update API calls)

## 🐛 Debugging

### Backend Issues
```bash
# Check if backend is running
curl http://localhost:8088/surveys

# View backend logs
tail -f /var/log/php_errors.log

# Check database
ls -la backend/storage/
```

### Mobile App Issues
```bash
# Check Metro bundler
npx react-native start

# Check device connection
adb devices

# Run app logs
adb logcat | grep ReactNative
```

### Network Issues (WSL2)
```bash
# Find WSL2 IP
ip addr show eth0

# Test connectivity
curl http://WSL2_IP:8088/surveys
```

## 🎯 Development Workflow

### Daily Development
1. **Start backend:** `cd backend && ./start.sh`
2. **Start mobile app:** `cd SurveyApp && npx react-native start`
3. **Run on device:** `npx react-native run-android`
4. **Make changes** - both backend and frontend auto-reload

### Testing Cycle
1. **Backend tests:** Test API endpoints with curl
2. **Mobile tests:** `npm test` (47 tests)
3. **Integration tests:** Test complete user flows
4. **Device testing:** Verify on Android device

## 📊 Current Status

### ✅ Completed
- React Native app with TypeScript
- PHP backend with MCP SDK
- SQLite database with sample data
- Authentication system (OTP-based)
- Survey management API
- Push notification registration
- Complete test suites

### 🔄 Ready for Integration
- Phone number input screen
- OTP verification screen
- Real-time API communication
- Survey completion workflow

### 🎯 Next Steps
1. **Test complete integration** with both servers running
2. **Implement remaining UI screens** (Tasks 4-5)
3. **Connect mobile app to live backend** 
4. **Add WebView for survey display** (Task 8)

The foundation is complete and ready for full end-to-end testing!
