# Register & Login Feature - Implementation Summary

## Changes Made

### 1. **Register Page** (`app/(auth)/register/page.tsx`)
- Added "Register As" dropdown selector with options: "User" and "Admin"
- Added `adminPassword` field to the form state
- Conditional rendering: Admin password field only appears when "Admin" is selected
- Updated form submission to include `role` and `adminPassword` in the API request

### 2. **Login Page** (`app/(auth)/login/page.tsx`)
- Added "Login As" dropdown (disabled, read-only)
- Shows informational text: "Login role is determined by your account type"
- This provides UI consistency with the register page

### 3. **Register API Route** (`app/api/users/register/route.ts`)
- Added validation for admin registration:
  - If `role === 'ADMIN'`, the provided `adminPassword` must match `ADMIN_PASSWORD` from `.env.local`
  - If admin password doesn't match, returns 403 error with message: "Invalid admin password. Cannot register as admin."
  - If validation passes, user is created with `role: 'ADMIN'` in the database
- Regular users (role: 'USER') can register without admin password validation

## How It Works

### User Registration:
1. User selects "User" from "Register As" dropdown → Registers as regular USER
2. User selects "Admin" from "Register As" dropdown → Must provide admin password
3. If admin password is correct (matches `ADMIN_PASSWORD` from env), registers as ADMIN
4. If admin password is incorrect, registration fails with error message

### User Database:
- All users have a `role` field: `'USER'` or `'ADMIN'`
- Admin users can be identified by their role in the database
- Login determines access level based on the user's role in the database

## Environment Variable Required
```
ADMIN_PASSWORD=dj_Minto123@1  (from .env.local)
```

## Testing Steps
1. Go to `/register`
2. Select "User" → Register normally (no admin password field shown)
3. Go to `/register` again
4. Select "Admin" → Admin password field appears
5. Enter the correct admin password from `.env.local` → Registration succeeds
6. Enter incorrect password → Registration fails with error
7. Login will work based on the user's role in the database

## Files Modified
- ✅ `app/(auth)/register/page.tsx` - Added role selector and admin password field
- ✅ `app/(auth)/login/page.tsx` - Added "Login As" dropdown (informational)
- ✅ `app/api/users/register/route.ts` - Added admin credential validation
