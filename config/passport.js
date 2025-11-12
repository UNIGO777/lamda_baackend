/**
 * Passport Configuration
 * Sets up authentication strategies for Google OAuth and JWT
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

/**
 * Google OAuth Strategy
 * Only initialize if valid Google OAuth credentials are provided
 */
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

// Only initialize Google strategy if valid credentials are provided
if (googleClientId && 
    googleClientSecret && 
    googleClientId !== 'placeholder-google-client-id' && 
    googleClientSecret !== 'placeholder-google-client-secret') {
  
  passport.use(new GoogleStrategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // Update user info from Google profile
        user.fullName = profile.displayName;
        user.identifier = profile.emails[0].value;
        user.avatar = profile.photos[0]?.value;
        user.lastLogin = new Date();
        user.LastActive = new Date();
        await user.save();
        return done(null, user);
      }

      // Check if user exists with the same email
      user = await User.findOne({ identifier: profile.emails[0].value });

      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        user.avatar = profile.photos[0]?.value;
        user.identifierVerified = true; // Google accounts are pre-verified
        user.lastLogin = new Date();
        user.LastActive = new Date();
        await user.save();
        return done(null, user);
      }

      // For new users via web OAuth, we need additional info
      // This will be handled by redirecting to a form to collect missing data
      const userData = {
        googleId: profile.id,
        fullName: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0]?.value,
        identifierVerified: true,
        // These fields will need to be collected separately
        requiresAdditionalInfo: true
      };

      return done(null, userData);

    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, null);
    }
  }));

} else {
  console.log('⚠️  Google OAuth not configured - using placeholder credentials. Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env file to enable Google authentication.');
}

/**
 * JWT Strategy
 */
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    ExtractJwt.fromUrlQueryParameter('token'),
    (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies.jwt;
      }
      return token;
    }
  ]),
  secretOrKey: process.env.JWT_SECRET,
  issuer: process.env.JWT_ISSUER || 'linkextractor-api',
  audience: process.env.JWT_AUDIENCE || 'linkextractor-client'
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    
    if (user && user.isActive) {
      return done(null, user);
    }
    
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

/**
 * Serialize user for session storage
 */
passport.serializeUser((user, done) => {
  if (user._id) {
    done(null, user._id);
  } else {
    // For incomplete user data, serialize the temporary data
    done(null, { tempData: user });
  }
});

/**
 * Deserialize user from session storage
 */
passport.deserializeUser(async (data, done) => {
  try {
    if (data.tempData) {
      // Return temporary user data for completion
      return done(null, data.tempData);
    }
    
    const user = await User.findById(data);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;