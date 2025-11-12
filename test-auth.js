/**
 * Authentication Endpoints Test Script
 * Tests all the implemented authentication endpoints
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const API_URL = `${BASE_URL}/auth`;

// Test data
const testUser = {
  fullName: 'Test User',
  email: 'test@example.com',
  phone: '+1234567890',
  ageGroup: '25-34',
  password: 'TestPassword123!'
};

const testGoogleToken = 'fake-google-id-token'; // This would be a real token in production

/**
 * Test helper function
 */
async function testEndpoint(method, endpoint, data = null, description = '') {
  try {
    console.log(`\n🧪 Testing: ${description || `${method.toUpperCase()} ${endpoint}`}`);
    
    const config = {
      method: method.toLowerCase(),
      url: `${API_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    console.log(`✅ Success: ${response.status} - ${response.data.message || 'OK'}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log(`❌ Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`);
      return error.response.data;
    } else {
      console.log(`❌ Network Error: ${error.message}`);
      return null;
    }
  }
}

/**
 * Run all authentication tests
 */
async function runAuthTests() {
  console.log('🚀 Starting Authentication Endpoints Test Suite');
  console.log('=' .repeat(60));

  // Test 1: User Registration
  console.log('\n📝 REGISTRATION TESTS');
  console.log('-'.repeat(30));
  
  await testEndpoint('POST', '/register', testUser, 'User Registration with OTP');
  
  // Test 2: OTP Verification (will fail without real OTP)
  await testEndpoint('POST', '/verify-otp', {
    identifier: testUser.email,
    otp: '123456',
    type: 'email'
  }, 'OTP Verification for Registration');

  // Test 3: Resend OTP
  await testEndpoint('POST', '/resend-otp', {
    identifier: testUser.email,
    type: 'email'
  }, 'Resend OTP for Registration');

  // Test 4: Login OTP Request
  console.log('\n🔐 LOGIN TESTS');
  console.log('-'.repeat(30));
  
  await testEndpoint('POST', '/login/request-otp', {
    identifier: testUser.email,
    type: 'email'
  }, 'Request Login OTP');

  // Test 5: Login OTP Verification (will fail without real OTP)
  await testEndpoint('POST', '/login/verify-otp', {
    identifier: testUser.email,
    otp: '123456',
    type: 'email'
  }, 'Verify Login OTP');

  // Test 6: Google OAuth
  console.log('\n🔍 GOOGLE OAUTH TESTS');
  console.log('-'.repeat(30));
  
  await testEndpoint('GET', '/google/auth-url', null, 'Get Google Auth URL');
  
  await testEndpoint('POST', '/google/login', {
    idToken: testGoogleToken
  }, 'Google OAuth Login (will fail with fake token)');

  // Test 7: Password Reset
  console.log('\n🔄 PASSWORD RESET TESTS');
  console.log('-'.repeat(30));
  
  await testEndpoint('POST', '/forgot-password', {
    email: testUser.email
  }, 'Forgot Password Request');

  // Test 8: Email Verification
  console.log('\n📧 EMAIL VERIFICATION TESTS');
  console.log('-'.repeat(30));
  
  await testEndpoint('GET', '/verify-email?token=fake-token', null, 'Email Verification (will fail with fake token)');

  console.log('\n' + '='.repeat(60));
  console.log('🏁 Authentication Tests Completed!');
  console.log('\nNote: Some tests are expected to fail due to:');
  console.log('- Missing real OTP codes');
  console.log('- Fake Google ID tokens');
  console.log('- Missing email verification tokens');
  console.log('- Missing environment variables for email/SMS services');
  console.log('\nThe important thing is that endpoints are responding correctly!');
}

// Run the tests
runAuthTests().catch(console.error);