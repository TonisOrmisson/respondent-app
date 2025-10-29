# SurveyApp Backend API

PHP backend using Logiscape MCP SDK for the SurveyApp mobile application.

## Features

- **Phone-based Authentication** with OTP verification
- **Survey Management** with completion tracking
- **Push Notifications** for new surveys
- **SQLite Database** for easy setup and development
- **RESTful API** endpoints for mobile app integration

## Quick Start

### Prerequisites

- **PHP 8.1+**
- **Composer**
- **SQLite** (included with PHP)

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd /mnt/c/Users/tonis/StudioProjects/respondentapp/backend
   ```

2. **Install dependencies:**
   ```bash
   composer install
   ```

3. **Start the server:**
   ```bash
   composer start
   ```
   
   Server will start at: `http://localhost:8088`

### Verify Installation

Test the API with curl:
```bash
# Test endpoint availability
curl http://localhost:8088/auth/send-otp \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+1234567890"}'
```

## API Endpoints

### Authentication

#### Send OTP
```http
POST /auth/send-otp
Content-Type: application/json

{
  "phoneNumber": "+1234567890"
}
```

#### Verify OTP
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "otp": "123456"
}
```

#### Refresh Token
```http
POST /auth/refresh
Authorization: Bearer {token}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer {token}
```

### Surveys

#### Get Available Surveys
```http
GET /surveys
Authorization: Bearer {token}
```

#### Get Specific Survey
```http
GET /surveys/get
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": 1
}
```

#### Mark Survey Complete
```http
POST /surveys/complete
Authorization: Bearer {token}
Content-Type: application/json

{
  "surveyId": 1
}
```

#### Create Survey (Admin)
```http
POST /surveys/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New Survey",
  "description": "Survey description",
  "url": "https://forms.gle/example",
  "reward": 5.00
}
```

### Notifications

#### Register Device for Push Notifications
```http
POST /notifications/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "deviceToken": "firebase_device_token",
  "platform": "android"
}
```

## Database Schema

The API uses SQLite with the following tables:

- **users** - User accounts with phone numbers
- **otp_codes** - OTP verification codes
- **user_sessions** - Authentication tokens
- **surveys** - Available surveys
- **survey_completions** - User survey completion tracking
- **device_tokens** - Push notification device tokens

## Configuration

### Environment Variables

Create a `.env` file (optional):
```env
# Database
DB_PATH=storage/database.sqlite

# SMS Service (for production)
TWILIO_SID=your_twilio_sid
TWILIO_TOKEN=your_twilio_token
TWILIO_FROM=+1234567890

# Firebase (for push notifications)
FIREBASE_SERVER_KEY=your_firebase_server_key
```

### Development vs Production

**Development Mode:**
- OTP codes are logged to error log
- Push notifications are logged (not sent)
- SQLite database for easy setup

**Production Setup:**
- Integrate with Twilio for SMS
- Configure Firebase Cloud Messaging
- Use MySQL/PostgreSQL for production database

## Integration with React Native App

Update your React Native app's API base URL:

```typescript
// In src/services/api.ts
const API_BASE_URL = 'http://localhost:8088'; // Development
// const API_BASE_URL = 'https://your-production-domain.com'; // Production
```

## Testing

### Manual Testing with curl

```bash
# 1. Send OTP
curl -X POST http://localhost:8088/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+1234567890"}'

# 2. Check logs for OTP code
tail -f /var/log/php_errors.log

# 3. Verify OTP (use code from logs)
curl -X POST http://localhost:8088/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+1234567890", "otp": "123456"}'

# 4. Get surveys (use token from step 3)
curl -X GET http://localhost:8088/surveys \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Sample Data

The database is automatically populated with sample surveys:
- Customer Satisfaction Survey ($5.00 reward)
- Product Feedback Survey ($10.00 reward)
- Mobile App Experience ($7.50 reward)

## Deployment

### Local Development
```bash
composer start
```

### Production Deployment
1. Configure web server (Apache/Nginx)
2. Point document root to `public/` directory
3. Set up proper environment variables
4. Configure database connection
5. Set up SSL certificate

## Architecture

Built using the **Logiscape MCP SDK PHP** with:
- **MCP Server** for HTTP transport
- **Handler-based** endpoint routing
- **Service layer** for business logic
- **Database abstraction** for data persistence
- **CORS support** for React Native integration

## Support

For issues with the backend API:
1. Check server logs for error messages
2. Verify database permissions and connectivity
3. Ensure all dependencies are installed
4. Test endpoints individually with curl
5. Check CORS configuration for mobile app requests