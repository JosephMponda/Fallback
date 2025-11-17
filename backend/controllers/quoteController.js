import prisma from '../config/database.js';
import logger from '../config/logger.js';
import { sendAdminNotification, sendEmail } from '../config/email.js';

export const createQuote = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      serviceType,
      description,
      budget,
    } = req.body;

    const quote = await prisma.quote.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        serviceType,
        description,
        budget,
        userId: req.user?.id,
      },
    });

    logger.info(`New quote request: ${quote.id} from ${customerEmail}`);

    // Send email to admin
    await sendAdminNotification({
      subject: `New Quote Request - ${serviceType}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Quote ID:</strong> ${quote.id}</p>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${customerPhone || 'N/A'}</p>
        <p><strong>Service Type:</strong> ${serviceType}</p>
        <p><strong>Budget:</strong> ${budget ? `$${budget}` : 'Not specified'}</p>
        <p><strong>Description:</strong></p>
        <p>${description}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `,
      text: `New quote request from ${customerName} (${customerEmail}) for ${serviceType}. Quote ID: ${quote.id}`,
    });

    // Send confirmation to customer
    await sendEmail({
      to: customerEmail,
      subject: 'Quote Request Received',
      html: `
        <h2>Thank You for Your Quote Request!</h2>
        <p>Dear ${customerName},</p>
        <p>We have received your quote request and will review it shortly.</p>
        <h3>Request Details:</h3>
        <p><strong>Quote ID:</strong> ${quote.id}</p>
        <p><strong>Service Type:</strong> ${serviceType}</p>
        <p><strong>Budget:</strong> ${budget ? `$${budget}` : 'Not specified'}</p>
        <p>Our team will contact you within 24-48 hours with a detailed quote.</p>
        <p>Best regards,<br>Your Team</p>
      `,
      text: `Thank you for your quote request! Quote ID: ${quote.id}. We will contact you soon.`,
    });

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully',
      data: { quote },
    });
  } catch (error) {
    logger.error('Create quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting quote request',
    });
  }
};

export const getAllQuotes = async (req, res) => {
  try {
    const { status } = req.query;

    const where = {
      ...(status && { status }),
    };

    // If not admin, only show user's quotes
    if (req.user.role !== 'ADMIN') {
      where.userId = req.user.id;
    }

    const quotes = await prisma.quote.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      count: quotes.length,
      data: { quotes },
    });
  } catch (error) {
    logger.error('Get quotes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quotes',
    });
  }
};

export const getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
    }

    // Check authorization
    if (req.user.role !== 'ADMIN' && quote.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this quote',
      });
    }

    res.status(200).json({
      success: true,
      data: { quote },
    });
  } catch (error) {
    logger.error('Get quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quote',
    });
  }
};

export const updateQuoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
      },
    });

    // Notify customer
    if (status) {
      await sendEmail({
        to: quote.customerEmail,
        subject: `Quote Status Update - ${quote.serviceType}`,
        html: `
          <h2>Quote Status Update</h2>
          <p>Dear ${quote.customerName},</p>
          <p>Your quote request status has been updated.</p>
          <p><strong>Quote ID:</strong> ${quote.id}</p>
          <p><strong>Service Type:</strong> ${quote.serviceType}</p>
          <p><strong>Status:</strong> ${status}</p>
          ${adminNotes ? `<p><strong>Notes:</strong> ${adminNotes}</p>` : ''}
          <p>We will contact you with more details soon.</p>
          <p>Best regards,<br>Your Team</p>
        `,
        text: `Your quote request ${quote.id} status has been updated to ${status}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quote updated successfully',
      data: { quote },
    });
  } catch (error) {
    logger.error('Update quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating quote',
    });
  }
};
