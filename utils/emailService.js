/**
 * Email Service
 * Handles email sending functionality using nodemailer
 */

const nodemailer = require('nodemailer');

/**
 * Create email transporter
 */
const createTransporter = () => {
  // Development/Testing configuration
  if (process.env.NODE_ENV === 'development') {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Production configuration (Gmail example)
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use App Password for Gmail
      }
    });
  }

  // Custom SMTP configuration
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @returns {Promise} Email send result
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'LinkExtractor'} <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', result.messageId);
    
    // Log preview URL for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(result));
    }
    
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

/**
 * Send welcome email
 * @param {string} email - User email
 * @param {string} firstName - User first name
 * @param {string} verificationToken - Email verification token
 */
const sendWelcomeEmail = async (email, firstName, verificationToken) => {
  const verificationUrl = `${process.env.CLIENT_URL}/auth/verify-email?token=${verificationToken}`;
  
  const subject = 'Welcome to LinkExtractor - Verify Your Email';
  
  const text = `
    Hi ${firstName},
    
    Welcome to LinkExtractor! We're excited to have you on board.
    
    To get started, please verify your email address by clicking the link below:
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    If you didn't create an account with us, please ignore this email.
    
    Best regards,
    The LinkExtractor Team
  `;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to LinkExtractor</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to LinkExtractor!</h1>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>Welcome to LinkExtractor! We're excited to have you on board.</p>
          <p>To get started, please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account with us, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>Best regards,<br>The LinkExtractor Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({ to: email, subject, text, html });
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} firstName - User first name
 * @param {string} resetToken - Password reset token
 */
const sendPasswordResetEmail = async (email, firstName, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${resetToken}`;
  
  const subject = 'Password Reset Request - LinkExtractor';
  
  const text = `
    Hi ${firstName},
    
    You requested a password reset for your LinkExtractor account.
    
    Click the link below to reset your password:
    ${resetUrl}
    
    This link will expire in 10 minutes for security reasons.
    
    If you didn't request a password reset, please ignore this email and your password will remain unchanged.
    
    Best regards,
    The LinkExtractor Team
  `;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Request</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>You requested a password reset for your LinkExtractor account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <div class="warning">
            <strong>Important:</strong> This link will expire in 10 minutes for security reasons.
          </div>
          <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
        </div>
        <div class="footer">
          <p>Best regards,<br>The LinkExtractor Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({ to: email, subject, text, html });
};

/**
 * Send email verification email
 * @param {string} email - User email
 * @param {string} firstName - User first name
 * @param {string} verificationToken - Email verification token
 */
const sendEmailVerification = async (email, firstName, verificationToken) => {
  const verificationUrl = `${process.env.CLIENT_URL}/auth/verify-email?token=${verificationToken}`;
  
  const subject = 'Verify Your Email Address - LinkExtractor';
  
  const text = `
    Hi ${firstName},
    
    Please verify your email address by clicking the link below:
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    If you didn't request this verification, please ignore this email.
    
    Best regards,
    The LinkExtractor Team
  `;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email Address</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email Address</h1>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>Best regards,<br>The LinkExtractor Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({ to: email, subject, text, html });
};

/**
 * Send password change confirmation email
 * @param {string} email - User email
 * @param {string} firstName - User first name
 */
const sendPasswordChangeConfirmation = async (email, firstName) => {
  const subject = 'Password Changed Successfully - LinkExtractor';
  
  const text = `
    Hi ${firstName},
    
    Your password has been successfully changed for your LinkExtractor account.
    
    If you didn't make this change, please contact our support team immediately.
    
    Best regards,
    The LinkExtractor Team
  `;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Changed Successfully</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        .warning { background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Changed Successfully</h1>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>Your password has been successfully changed for your LinkExtractor account.</p>
          <div class="warning">
            <strong>Security Notice:</strong> If you didn't make this change, please contact our support team immediately.
          </div>
        </div>
        <div class="footer">
          <p>Best regards,<br>The LinkExtractor Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({ to: email, subject, text, html });
};

/**
 * Send OTP email
 * @param {string} email - Recipient email address
 * @param {string} otp - OTP code
 * @param {string} type - Type of OTP (registration, login, etc.)
 * @returns {Promise<boolean>} - Success status
 */
const sendOTPEmail = async (email, otp, type = 'verification') => {
  try {
    // Email templates based on OTP type
    const emailTemplates = {
      registration: {
        subject: 'Complete Your Registration - OTP Verification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Welcome! Complete Your Registration</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">Thank you for signing up! To complete your registration, please use the following OTP:</p>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
              </div>
              <p style="color: #666; font-size: 14px;">This OTP will expire in 10 minutes for security reasons.</p>
              <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">This is an automated message, please do not reply.</p>
            </div>
          </div>
        `
      },
      login: {
        subject: 'Login Verification - OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Login Verification</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">Someone is trying to log in to your account. Please use the following OTP to complete the login:</p>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h1 style="color: #28a745; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
              </div>
              <p style="color: #666; font-size: 14px;">This OTP will expire in 10 minutes for security reasons.</p>
              <p style="color: #dc3545; font-size: 14px;"><strong>If this wasn't you, please secure your account immediately.</strong></p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">This is an automated message, please do not reply.</p>
            </div>
          </div>
        `
      },
      password_reset: {
        subject: 'Password Reset - OTP Verification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Password Reset Request</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">You requested to reset your password. Please use the following OTP to proceed:</p>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h1 style="color: #dc3545; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
              </div>
              <p style="color: #666; font-size: 14px;">This OTP will expire in 10 minutes for security reasons.</p>
              <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email and your password will remain unchanged.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">This is an automated message, please do not reply.</p>
            </div>
          </div>
        `
      }
    };

    const template = emailTemplates[type] || emailTemplates.registration;

    const emailOptions = {
      to: email,
      subject: template.subject,
      html: template.html
    };

    return await sendEmail(emailOptions);

  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendEmailVerification,
  sendPasswordChangeConfirmation,
  sendOTPEmail
};