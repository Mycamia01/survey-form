// services/emailService.js

export async function sendEmail(toEmail, toName, subject, htmlContent) {
  const BREVO_API_KEY = process.env.BREVO_SMTP_API_KEY; // Uses your key: 5pfQP0j9vYAghZr7
  const BREVO_SENDER_EMAIL = process.env.BREVO_SMTP_LOGIN_EMAIL; // info@plugnplayglobal.com

  console.log('BREVO_API_KEY:', BREVO_API_KEY);
  console.log('BREVO_SENDER_EMAIL:', BREVO_SENDER_EMAIL);

  if (!BREVO_API_KEY) {
    throw new Error('Brevo API key is missing');
  }

  const payload = {
    sender: {
      email: BREVO_SENDER_EMAIL,
      name: 'Plug N Play Global', // Updated sender name
    },
    to: [{
      email: toEmail,
      name: toName || toEmail.split('@')[0], // Fallback to email prefix if no name
    }],
    subject,
    htmlContent,
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Brevo API Error:', error);
      throw new Error(error.message || 'Email failed to send');
    }

    return await response.json();
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}
