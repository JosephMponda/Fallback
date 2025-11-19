import nodemailer from 'nodemailer';
import logger from './logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    logger.error('Email configuration error:', error);
  } else {
    logger.info('Email server is ready to send messages');
  }
});

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const from = `"Everest Printin Press" <${process.env.EMAIL_USER}>`;

    // Build BCC list from ADMIN_EMAIL if configured and not already in recipients
    let bcc;
    const adminEnv = process.env.ADMIN_EMAIL;
    if (adminEnv) {
      const normalize = (val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val.map(String).map(s => s.trim()).filter(Boolean);
        return String(val).split(',').map(s => s.trim()).filter(Boolean);
      };

      const toList = normalize(to);
      const adminList = normalize(adminEnv);
      const adminsToBcc = adminList.filter(a => !toList.includes(a));
      if (adminsToBcc.length) bcc = adminsToBcc.join(', ');
    }

    const mailOptions = {
      from,
      to,
      subject,
      text,
      html,
    };

    if (bcc) mailOptions.bcc = bcc;

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}` + (bcc ? ` (bcc: ${process.env.ADMIN_EMAIL})` : ''));
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

export const sendAdminNotification = async ({ subject, html, text }) => {
  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `[Admin Notification] ${subject}`,
    html,
    text,
  });
};

export default transporter;
