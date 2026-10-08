const nodemailer = require('nodemailer');

(async () => {
  const transporter = nodemailer.createTransport({ jsonTransport: true });

  const info = await transporter.sendMail({
    from: '"Valence Finance" <test@valence.com>',
    to: 'anyone@example.com',
    subject: 'Test alert',
    text: 'If you can read this, email sending works.',
  });

  console.log(info.message);
})();