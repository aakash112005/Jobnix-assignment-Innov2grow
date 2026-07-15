const axios = require('axios');

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

/**
 * Sends an email via Brevo's HTTP API (not SMTP) — avoids SMTP port
 * blocking issues on Render. Fails silently (logs only) if no API key
 * is configured, so the rest of the app keeps working without email setup.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.log(`[email:skip] No Brevo API key configured. Would send "${subject}" to ${to}`);
      return { skipped: true };
    }

    const { data } = await axios.post(
      BREVO_API_URL,
      {
        sender: {
          name: process.env.EMAIL_FROM_NAME || 'Job Portal',
          email: process.env.EMAIL_FROM || 'no-reply@jobportal.com',
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout: 15000,
      }
    );

    return data;
  } catch (err) {
    console.error('Email send failed:', err.response?.data?.message || err.message);
    return { error: err.response?.data?.message || err.message };
  }
};

module.exports = sendEmail;