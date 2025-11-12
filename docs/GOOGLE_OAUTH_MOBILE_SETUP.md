# Google OAuth Setup for Mobile vs Web

## Overview
This document explains the differences between Google OAuth configuration for web applications and mobile/React Native applications.

## Why Different Keys Are Needed

### Web Applications
- Use **Web Application** OAuth client type in Google Cloud Console
- Redirect URIs are HTTP/HTTPS URLs (e.g., `http://localhost:3000/auth/google/callback`)
- Client secret is used and kept secure on the server
- Uses authorization code flow with PKCE

### Mobile Applications (React Native)
- Use **iOS** or **Android** OAuth client type in Google Cloud Console
- Redirect URIs use custom URL schemes (e.g., `com.yourapp.linkextractor://oauth/callback`)
- Client secret is typically not used for security reasons
- Uses authorization code flow with PKCE for better security

## Environment Variables

### Web Configuration
```env
# Google OAuth Configuration for Web
GOOGLE_CLIENT_ID=your-web-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-web-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

### Mobile Configuration
```env
# Google OAuth Configuration for Mobile/React Native
GOOGLE_MOBILE_CLIENT_ID=your-mobile-google-client-id.apps.googleusercontent.com
GOOGLE_MOBILE_CLIENT_SECRET=your-mobile-google-client-secret
GOOGLE_MOBILE_REDIRECT_URI=myapp://oauth/callback
```

## Setting Up Google Cloud Console

### For Web Application
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select your project
3. Enable Google+ API and Google OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Select "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)

### For Mobile Application
1. In the same Google Cloud Console project
2. Create another OAuth 2.0 Client ID
3. Select "iOS" or "Android" depending on your target platform
4. For iOS: Add your bundle identifier
5. For Android: Add your package name and SHA-1 certificate fingerprint
6. The redirect URI will be automatically configured as a custom URL scheme

## Implementation Differences

### Backend Controller
The React Native Google controller now uses mobile-specific environment variables:

```javascript
// Uses mobile client ID with fallback to web client ID
const googleMobileClient = new OAuth2Client(
  process.env.GOOGLE_MOBILE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID
);

// Configuration endpoint returns mobile-specific settings
const getReactNativeGoogleConfig = async (req, res) => {
  res.json({
    clientId: process.env.GOOGLE_MOBILE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
    redirectUri: process.env.GOOGLE_MOBILE_REDIRECT_URI || 'com.yourapp.linkextractor://oauth/callback',
    responseType: 'code', // Authorization code flow
    platform: 'mobile'
  });
};
```

### React Native App
The mobile app uses `expo-auth-session` which automatically handles:
- Custom URL scheme registration
- Authorization code exchange
- Token management
- Platform-specific OAuth flows

## Security Considerations

1. **Client Secrets**: Mobile apps should not include client secrets in the app bundle
2. **Redirect URIs**: Use custom URL schemes for mobile apps
3. **PKCE**: Always use PKCE (Proof Key for Code Exchange) for mobile OAuth flows
4. **Token Storage**: Store tokens securely using platform-specific secure storage

## Expo Configuration

### app.json Setup
For Expo React Native apps, ensure your `app.json` includes the correct scheme:

```json
{
  "expo": {
    "name": "my-app",
    "slug": "my-app",
    "scheme": "myapp",
    // ... other configuration
  }
}
```

The `scheme` value should match the scheme used in your `GOOGLE_MOBILE_REDIRECT_URI`.

### URL Scheme Format
- **Correct**: `myapp://oauth/callback`
- **Incorrect**: `http://localhost:5173/google/callback` (this is for web apps)

## Testing

### Web Application
- Test with `http://localhost:3000` and `http://localhost:5173`
- Verify redirect works in browser

### Mobile Application (Expo)
- Test with Expo Go app during development
- Test with standalone builds for production
- Verify custom URL scheme handling
- Ensure the scheme in `app.json` matches the redirect URI

## Production Deployment

### Web
- Update `GOOGLE_CALLBACK_URL` to production domain
- Ensure HTTPS is used

### Mobile
- Update bundle identifier/package name in Google Cloud Console
- Add production SHA-1 fingerprints for Android
- Update redirect URI scheme if needed