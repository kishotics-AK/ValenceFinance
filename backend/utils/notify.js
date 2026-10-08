// utils/notify.js
const nodemailer = require('nodemailer');

const mailer = process.env.EMAIL_USER
  ? nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // TLS via STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD ? process.env.EMAIL_APP_PASSWORD.replace(/\s+/g, '') : ''
      },
    })
  : nodemailer.createTransport({ jsonTransport: true });

exports.sendEmail = async (to, subject, text) => {
  try {
    const info = await mailer.sendMail({
      from: '"Valence Finance" <' + (process.env.EMAIL_USER || 'test@valence.com') + '>',
      to,
      subject,
      text,
    });

    if (!process.env.EMAIL_USER) {
      console.log('[TEST EMAIL]', info.message);
    } else {
      console.log(`[EMAIL SENT] To: ${to} | Subject: ${subject} | ID: ${info.messageId}`);
    }
    return info;
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send email to ${to}:`, error.message);
    throw error;
  }
};