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
    const info = await transporter.sendMail({
      from: `"System Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    logger.info(`Email sent: ${info.messageId}`);
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
