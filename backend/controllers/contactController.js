import prisma from '../config/database.js';
import logger from '../config/logger.js';
import { sendAdminNotification, sendEmail } from '../config/email.js';

export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    logger.info(`New contact message: ${contactMessage.id} from ${email}`);

    // Send email to admin
    await sendAdminNotification({
      subject: `New Contact Message${subject ? `: ${subject}` : ''}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Message ID:</strong> ${contactMessage.id}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
      `,
      text: `New contact message from ${name} (${email}): ${message}`,
    });

    // Send auto-reply to customer
    await sendEmail({
      to: email,
      subject: 'We Received Your Message',
      html: `
        <h2>Thank You for Contacting Us!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <h3>Your Message:</h3>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        <p>${message}</p>
        <p>Our team typically responds within 24 hours.</p>
        <p>Best regards,<br>Your Team</p>
      `,
      text: `Thank you for contacting us! We have received your message and will respond soon.`,
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { contactMessage },
    });
  } catch (error) {
    logger.error('Create contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
    });
  }
};

export const getAllContactMessages = async (req, res) => {
  try {
    const { read } = req.query;

    const messages = await prisma.contactMessage.findMany({
      where: {
        ...(read !== undefined && { read: read === 'true' }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: { messages },
    });
  } catch (error) {
    logger.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
    });
  }
};

export const getContactMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { message },
    });
  } catch (error) {
    logger.error('Get contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching message',
    });
  }
};

export const markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    });

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: { message },
    });
  } catch (error) {
    logger.error('Mark message as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating message',
    });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.contactMessage.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    logger.error('Delete contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting message',
    });
  }
};
