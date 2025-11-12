const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/constants');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters long'],
    maxlength: [50, 'Full name cannot exceed 50 characters'],
    match: [
      /^[a-zA-Z\s]+$/,
      'Full name can only contain letters and spaces'
    ]
  },
  identifier: {
    type: String,
    required: [true, 'Email or phone number is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(value) {
        // Check if it's a valid email or phone number
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      },
      message: 'Please enter a valid email address or phone number'
    }
  },
  ageGroup: {
    type: String,
    required: [true, 'Age group is required'],
    enum: {
      values: ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+', 'Not specified'],
      message: 'Please select a valid age group'
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  avatar: {
    type: String, // URL to profile picture
    default: null
  },
  identifierVerified: {
    type: Boolean,
    default: false
  },
  identifierType: {
    type: String,
    enum: ['email', 'phone'],
    required: true
  },
  registrationStep: {
    type: String,
    enum: ['pending_verification', 'completed'],
    default: 'pending_verification'
  },
  lastLogin: {
    type: Date
  },
  LastActive: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Instance method to generate JWT token
userSchema.methods.generateAuthToken = function() {
  const payload = {
    id: this._id,
    identifier: this.identifier,
    fullName: this.fullName,
    identifierType: this.identifierType
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE || '7d'
  });
};

// Instance method to check if user is fully verified
userSchema.methods.isFullyVerified = function() {
  if (this.verificationMethod === 'email') {
    return this.emailVerified;
  } else if (this.verificationMethod === 'phone') {
    return this.phoneVerified;
  } else if (this.verificationMethod === 'both') {
    return this.emailVerified && this.phoneVerified;
  }
  return false;
};

// Instance method to mark registration as completed
userSchema.methods.completeRegistration = function() {
  this.registrationStep = 'completed';
  return this.save();
};

// Static method to find user by email or phone
userSchema.statics.findByEmailOrPhone = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { phone: identifier }
    ]
  });
};

// Static method to find verified user by email or phone
userSchema.statics.findVerifiedUser = function(identifier) {
  return this.findOne({
    $or: [
      { 
        email: identifier.toLowerCase(),
        emailVerified: true 
      },
      { 
        phone: identifier,
        phoneVerified: true 
      }
    ],
    registrationStep: 'completed',
    isActive: true
  });
};

// Virtual for user's display identifier
userSchema.virtual('displayIdentifier').get(function() {
  return this.email || this.phone || this.fullName;
});

// Pre-save middleware to determine identifier type
userSchema.pre('save', function(next) {
  // Determine identifier type
  if (this.isModified('identifier')) {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    this.identifierType = emailRegex.test(this.identifier) ? 'email' : 'phone';
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
