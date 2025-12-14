# Forgot Password Flow - Implementation Guide

## Overview

Complete forgot password flow has been implemented for Terra Plantari with:
- Email-based password reset requests
- Secure token generation and validation
- Token expiration (30 minutes)
- Dev mode for local testing without email
- Polished UI matching Terra Plantari branding

## Files Created/Modified

### Backend

**Schema Changes:**
- `backend/prisma/schema.prisma` - Added `PasswordReset` model
- `backend/prisma/migrations/20251213_add_password_resets/migration.sql` - Migration file

**Routes:**
- `backend/src/routes/auth.ts` - Added two new endpoints:
  - `POST /api/v1/auth/request-reset` - Request password reset
  - `POST /api/v1/auth/reset-password` - Reset password with token

### Frontend

**New Pages:**
- `frontend/src/pages/ForgotPassword.tsx` - Request reset link
- `frontend/src/pages/ResetPassword.tsx` - Set new password

**Modified Pages:**
- `frontend/src/pages/Login.tsx` - Added "Forgot password?" link and success message display
- `frontend/src/App.tsx` - Added new routes

### Scripts

- `scripts/apply-password-reset-migration.sh` - Helper script to apply migration and regenerate Prisma client

## Database Schema

### PasswordReset Model

```prisma
model PasswordReset {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  token     String   @unique
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")
  used      Boolean  @default(false)
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])
  @@index([userId])
  @@map("password_resets")
}
```

## Setup Instructions

### 1. Apply Database Migration

**Option A: Using the script (recommended)**
```bash
chmod +x scripts/apply-password-reset-migration.sh
./scripts/apply-password-reset-migration.sh
```

**Option B: Manual steps**
```bash
cd backend

# Apply migration
sqlite3 prisma/dev.db < prisma/migrations/20251213_add_password_resets/migration.sql

# Regenerate Prisma Client
npx prisma generate
```

### 2. Restart Backend Server

```bash
cd backend
npm run dev
```

The backend will now have the new `passwordReset` table and Prisma client methods.

### 3. Frontend is Ready

No additional setup needed. The routes are already configured in App.tsx.

## API Endpoints

### Request Password Reset

**Endpoint:** `POST /api/v1/auth/request-reset`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (always returns 200):**
```json
{
  "message": "If an account exists, we sent a reset link."
}
```

**Response (dev mode with valid email):**
```json
{
  "message": "If an account exists, we sent a reset link.",
  "devMode": true,
  "resetUrl": "http://localhost:5173/reset-password?token=abc123..."
}
```

**Security Note:** Always returns success message to prevent email enumeration attacks.

### Reset Password

**Endpoint:** `POST /api/v1/auth/reset-password`

**Request Body:**
```json
{
  "token": "abc123...",
  "password": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

**Error Responses:**
- 400: Invalid token, expired token, or used token
- 400: Password validation failure (< 6 characters)

## User Flow

### 1. Request Reset

1. User visits login page
2. Clicks "Forgot password?" link
3. Enters email address
4. Submits form
5. Sees confirmation message

**In Dev Mode:**
- Reset URL is displayed on screen
- User can click directly to reset password page

**In Production:**
- Email would be sent (requires email service integration)
- User clicks link in email

### 2. Reset Password

1. User opens reset link (with token in URL)
2. Token is validated on page load
3. If invalid/expired: Shows error + option to request new link
4. If valid: User enters new password + confirmation
5. Password is validated (min 6 chars, must match)
6. Submit updates password
7. Redirects to login with success message

### 3. Login with New Password

1. User sees success message on login page
2. Logs in with new password
3. Continues to dashboard

## Security Features

### Token Security
- **Cryptographically secure:** Uses `crypto.randomBytes(32)` for 256-bit tokens
- **URL-safe:** Tokens are hex-encoded
- **Unique:** Database constraint ensures no duplicates
- **Indexed:** Fast token lookups

### Expiration
- **30-minute validity:** Tokens expire automatically
- **Server-side validation:** Checked on every reset attempt
- **One-time use:** Tokens are marked as used after password reset

### Token Invalidation
- **Automatic cleanup:** Old unused tokens are marked as used when new request is made
- **Cascade delete:** Tokens are deleted when user is deleted
- **Used flag:** Prevents token reuse

### Email Enumeration Prevention
- **Neutral response:** Always returns same message regardless of email existence
- **Same timing:** Response time doesn't reveal if email exists
- **No hints:** No distinction between valid and invalid emails

### Password Security
- **Same validation:** Uses existing signup rules (min 6 chars)
- **Same hashing:** Uses bcrypt with 10 rounds (same as signup)
- **Secure update:** Direct password hash update in database

## Dev Mode Features

### Reset URL Display

When `NODE_ENV !== 'production'`, the reset URL is:
1. Included in API response
2. Displayed on the ForgotPassword success screen
3. Clickable for immediate testing

**Example:**
```
http://localhost:5173/reset-password?token=a1b2c3d4e5f6...
```

### Environment Variables

```env
# Backend (.env)
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key
DATABASE_URL="file:./prisma/dev.db"
```

## UI/UX Design

### Consistent Branding
- **Gradient background:** Purple gradient matching login/signup
- **Card layout:** White card with proper spacing
- **Icons:** Emoji icons for visual appeal
  - 🔑 Forgot Password
  - 🔐 Reset Password
  - 📧 Send email
  - ✓ Success checkmark

### Loading States
- **Disabled buttons:** During API calls
- **Loading text:** Clear feedback ("🔄 Sending...")
- **Cursor changes:** not-allowed when disabled

### Error Handling
- **Inline messages:** Red gradient banners with ⚠️
- **Specific errors:** Clear descriptions of issues
- **Recovery options:** Links to request new reset

### Success States
- **Green banners:** Success confirmations with ✅
- **Clear instructions:** Next steps for user
- **Auto-redirect:** After successful reset

### Mobile Responsive
- **Full viewport:** 100vh layouts
- **Flexible containers:** Max-width 440px
- **Touch-friendly:** Large buttons and inputs

## Testing Checklist

### Backend Tests

- [ ] Request reset with valid email
- [ ] Request reset with non-existent email (should not reveal)
- [ ] Request reset with invalid email format
- [ ] Generate token and verify uniqueness
- [ ] Verify token expiration (30 minutes)
- [ ] Reset password with valid token
- [ ] Reset password with expired token
- [ ] Reset password with used token
- [ ] Reset password with invalid token
- [ ] Password validation (min 6 chars)
- [ ] Token invalidation when new request is made
- [ ] User can login with new password

### Frontend Tests

- [ ] Navigate to /forgot-password from login
- [ ] Submit forgot password form
- [ ] See dev mode reset URL (if in dev)
- [ ] Navigate to /reset-password with token
- [ ] See error if token is missing
- [ ] See error if token is invalid
- [ ] Enter mismatched passwords
- [ ] Enter password < 6 characters
- [ ] Successfully reset password
- [ ] Redirect to login with success message
- [ ] Login with new password
- [ ] Back to login link works
- [ ] Request new reset link works

### Security Tests

- [ ] Token cannot be reused
- [ ] Expired tokens are rejected
- [ ] Email enumeration not possible
- [ ] Password is properly hashed
- [ ] Token is cryptographically secure
- [ ] Old tokens invalidated on new request

## Production Deployment Notes

### Email Integration Required

For production, you'll need to:

1. **Choose email service:**
   - SendGrid
   - AWS SES
   - Mailgun
   - Postmark
   - Resend

2. **Update request-reset endpoint:**

```typescript
// In backend/src/routes/auth.ts
if (user) {
  const token = crypto.randomBytes(32).toString('hex');
  // ... create token in database ...
  
  // Production: Send email
  if (process.env.NODE_ENV === 'production') {
    await sendResetEmail(user.email, token);
    return res.json({
      message: 'If an account exists, we sent a reset link.'
    });
  }
  
  // Dev: Show URL
  // ... existing dev mode code ...
}
```

3. **Create email template:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Reset Your Password - Terra Plantari</title>
</head>
<body>
  <h1>🌱 Terra Plantari</h1>
  <h2>Reset Your Password</h2>
  <p>You requested to reset your password. Click the button below:</p>
  <a href="{{RESET_URL}}" style="...">Reset Password</a>
  <p>This link expires in 30 minutes.</p>
  <p>If you didn't request this, please ignore this email.</p>
</body>
</html>
```

4. **Add environment variables:**

```env
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your-api-key
EMAIL_FROM=noreply@terraplantari.com
```

### Security Hardening

For production:

1. **Rate limiting:** Add rate limits to prevent abuse
```typescript
// Limit to 5 reset requests per email per hour
```

2. **HTTPS only:** Ensure reset links use HTTPS

3. **Token cleanup:** Add cron job to delete expired tokens
```typescript
// Delete tokens older than 24 hours
```

4. **Monitoring:** Log password reset attempts

## Troubleshooting

### "Property 'passwordReset' does not exist on type 'PrismaClient'"

**Solution:** Regenerate Prisma client
```bash
cd backend
npx prisma generate
```

### Migration not applied

**Solution:** Apply migration manually
```bash
cd backend
sqlite3 prisma/dev.db < prisma/migrations/20251213_add_password_resets/migration.sql
```

### Reset URL not showing in dev mode

**Check:**
1. `NODE_ENV` is not set to 'production'
2. Email exists in database
3. Backend logs for errors

### Token validation failing

**Check:**
1. Token is in URL query parameter
2. Token hasn't expired (30 minutes)
3. Token hasn't been used already
4. Database has the token record

## Future Enhancements

### Planned Features

1. **Email service integration** - SendGrid/AWS SES
2. **Rate limiting** - Prevent abuse
3. **Token cleanup job** - Remove expired tokens
4. **Password strength meter** - Visual feedback
5. **Remember device** - Skip reset for trusted devices
6. **Account recovery** - Additional verification methods
7. **Audit logging** - Track password changes
8. **Multi-factor auth** - Enhanced security

### Optional Improvements

- Custom email templates with branding
- SMS-based reset option
- Security questions as backup
- Password history (prevent reuse)
- Notification when password is changed
- IP-based suspicious activity detection

## Support

For issues or questions:
1. Check TypeScript/Prisma errors
2. Verify migration was applied
3. Check backend logs
4. Test in dev mode first
5. Review this documentation

## Changelog

### v1.0.0 - December 13, 2024
- ✅ Initial implementation
- ✅ Database schema with PasswordReset model
- ✅ Backend API endpoints
- ✅ Frontend UI pages
- ✅ Dev mode with URL display
- ✅ Security features (token expiration, one-time use)
- ✅ Email enumeration prevention
- ✅ Terra Plantari branded design
