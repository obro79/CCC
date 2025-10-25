# Email Authentication Setup Guide

This guide walks you through enabling email/password authentication in your Supabase project.

## Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project

## Step 2: Enable Email Provider

1. In the left sidebar, click **Authentication**
2. Click on **Providers** tab
3. Find **Email** in the list of providers
4. Toggle the **Enable Email provider** switch to ON

## Step 3: Configure Email Settings

### Basic Settings

- **Enable Email Signup**: Toggle ON (allows new users to register)
- **Enable Email Confirmations**: Choose based on your needs
  - **ON (Recommended)**: Users must verify email before accessing the app
  - **OFF**: Users can access immediately (less secure, faster onboarding)

### Email Templates (Optional)

Customize the emails sent to users:

1. Navigate to **Authentication** → **Email Templates**
2. Available templates:
   - **Confirm signup**: Sent when user registers
   - **Magic Link**: For passwordless login
   - **Change Email Address**: Sent when user changes email
   - **Reset Password**: Password recovery email

### SMTP Configuration (Production)

For production, configure custom SMTP:

1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Enter your SMTP credentials:
   - **Host**: smtp.gmail.com (or your provider)
   - **Port**: 587
   - **Username**: your-email@example.com
   - **Password**: your-app-password
   - **Sender email**: noreply@yourdomain.com
   - **Sender name**: Your App Name

**Note**: For development, Supabase provides built-in email service (limited to 4 emails/hour per user).

## Step 4: Configure Auth Settings

1. Go to **Authentication** → **Settings**
2. Review these important settings:

### Site URL
- Set to your frontend URL
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

### Redirect URLs
Add allowed redirect URLs after authentication:
```
http://localhost:3000/*
http://localhost:3000/auth/callback
https://yourdomain.com/*
https://yourdomain.com/auth/callback
```

### JWT Settings
- **JWT expiry**: 3600 seconds (1 hour) - default
- Keep other JWT settings as default

### Password Requirements
- Minimum length: 6 characters (increase for production)
- Consider enabling password strength requirements

## Step 5: Get Your Credentials

1. Go to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL**: Your Supabase project URL
   - **anon public**: Public anonymous key (safe for frontend)
   - **service_role**: Service role key (NEVER expose to frontend)

3. Add these to your `.env.local` file (see `.env.local.example`)

## Step 6: Test Authentication

Once configured, test the authentication flow:

1. Try signing up a new user from your app
2. Check the **Authentication** → **Users** table in dashboard
3. Verify email delivery (check spam folder)
4. Test login with the created user

## Troubleshooting

### Emails not being sent
- Check spam folder
- Verify SMTP settings (if configured)
- Check Supabase logs: **Project Logs** → **Auth Logs**
- Development: Remember 4 emails/hour limit per user

### Sign up fails
- Check RLS policies on `users` table
- Verify "Enable Email Signup" is ON
- Check browser console for errors

### Redirect issues
- Ensure Site URL and Redirect URLs are correctly configured
- Check for trailing slashes in URLs
- Verify callback route exists in your app

## Security Best Practices

1. **Always enable email confirmation** in production
2. **Never commit** `.env.local` with real credentials
3. **Use strong passwords** - increase minimum length to 8+ characters
4. **Set up rate limiting** - configure in Auth settings
5. **Monitor auth logs** regularly for suspicious activity
6. **Rotate service_role key** if exposed
7. **Use HTTPS only** in production

## Next Steps

After completing this setup:
- [ ] Add environment variables to your frontend
- [ ] Implement login/signup components
- [ ] Create protected routes
- [ ] Add session management
- [ ] Implement logout functionality
- [ ] Test the complete auth flow

## Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Password-based Auth Guide](https://supabase.com/docs/guides/auth/passwords)
- [Row Level Security Docs](https://supabase.com/docs/guides/auth/row-level-security)
