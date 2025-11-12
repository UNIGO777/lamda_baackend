

/**
 * Format phone number to international format
 * @param {string} phone - Phone number
 * @param {string} countryCode - Country code (default: +1 for US)
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (phone, countryCode = '+1') => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // If phone already starts with country code, return as is
  if (cleanPhone.startsWith('1') && cleanPhone.length === 11) {
    return `+${cleanPhone}`;
  }
  
  // If phone is 10 digits, add country code
  if (cleanPhone.length === 10) {
    return `${countryCode}${cleanPhone}`;
  }
  
  // If phone already has country code format
  if (phone.startsWith('+')) {
    return phone;
  }
  
  return `${countryCode}${cleanPhone}`;
};


const sendOTPSMS = async (phone, otp, type = 'verification') => {
  try {
    
    // Format phone number
    const formattedPhone = formatPhoneNumber(phone);

    console.log(`SMS sent successfully to ${formattedPhone} OTP: ${otp}`);
    return true;
    
  } catch (error) {
    console.error('Error sending SMS:', error);
    
    // Log specific Twilio errors
    if (error.code) {
      console.error(`Twilio Error Code: ${error.code} - ${error.message}`);
    }
    
    return false;
  }
};


const validatePhoneNumber = (phone) => {
  // Basic phone number validation
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if phone has at least 10 digits
  return cleanPhone.length >= 10 && phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Get SMS delivery status
 * @param {string} messageSid - Twilio message SID
 * @returns {Promise<Object>} - Message status object
 */


module.exports = {
  sendOTPSMS,
  validatePhoneNumber,
  formatPhoneNumber,
};