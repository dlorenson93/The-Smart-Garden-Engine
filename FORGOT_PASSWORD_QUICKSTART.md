# Quick Start - Forgot Password Feature

## ⚡ Fast Setup (3 steps)

### 1. Apply Database Migration

Run this from the project root:

```bash
cd backend
sqlite3 prisma/dev.db < prisma/migrations/20251213_add_password_resets/migration.sql
npx prisma generate
```

### 2. Restart Backend

```bash
npm run dev
```

### 3. Test It Out

1. Go to http://localhost:5173/login
2. Click "Forgot password?"
3. Enter an email that exists in your database
4. You'll see a reset URL on the success page (dev mode)
5. Click the URL to reset your password
6. Enter new password (min 6 characters)
7. Login with new password

## 🎯 What Was Added

**Backend:**
- `PasswordReset` database table
- `POST /api/v1/auth/request-reset` endpoint
- `POST /api/v1/auth/reset-password` endpoint

**Frontend:**
- `/forgot-password` page
- `/reset-password` page  
- "Forgot password?" link on login
- Success message handling

## 🔐 Security Features

✅ 30-minute token expiration  
✅ One-time use tokens  
✅ Cryptographically secure (256-bit)  
✅ Email enumeration prevention  
✅ Same password rules as signup  
✅ Dev mode for local testing  

## 📝 Key Points

- **No email service needed for dev** - Reset URL is shown on screen
- **No changes to signup/login** - All existing auth works the same
- **Secure by default** - Tokens expire, can't be reused
- **Matches Terra Plantari design** - Purple gradient, consistent UI

## 🐛 Troubleshooting

**"passwordReset does not exist" error?**
```bash
cd backend
npx prisma generate
```

**Migration not applied?**
Check if table exists:
```bash
cd backend
sqlite3 prisma/dev.db "SELECT name FROM sqlite_master WHERE type='table' AND name='password_resets';"
```

**Need to test with real users?**
1. Create a user via signup
2. Use that email in forgot password
3. Check the reset URL shown in dev mode

## 📖 Full Documentation

See `FORGOT_PASSWORD_IMPLEMENTATION.md` for:
- Complete API documentation
- Security details
- Production deployment notes
- Email service integration guide
- Testing checklist

---

**Ready to deploy?** Check the production notes in the full documentation for email service setup.
