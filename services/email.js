// services/email.js

// !!! IMPORTANT !!!
// Replace this with the URL you get from Vercel after deploying
const API_ENDPOINT = 'https://carbeezzapp.netlify.app/.netlify/functions/send-otp';

/**
 * Generates a random 6-digit OTP
 */
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Calls YOUR secure backend API to send the OTP email
 * @param {string} email - The recipient's email
 * @param {string} otp - The 6-digit OTP
 */
export const sendOtpEmail = async (email, otp) => {
  if (API_ENDPOINT.includes('your-app-name')) {
    console.error("Please update the API_ENDPOINT in services/email.js");
    return false;
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();
    return response.ok && data.success;
    
  } catch (error) {
    console.error('Network error calling email service:', error);
    return false;
  }
};