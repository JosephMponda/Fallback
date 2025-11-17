import prisma from '../config/database.js';
import logger from '../config/logger.js';
import { sendAdminNotification, sendEmail } from '../config/email.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  try {
    const {
      serviceId,
      customerName,
      customerEmail,
      customerPhone,
      address,
      specialRequests,
      quantity,
    } = req.body;

    // Get service details
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    if (!service.active) {
      return res.status(400).json({
        success: false,
        message: 'This service is currently unavailable',
      });
    }

    // Calculate total amount
    const totalAmount = service.price * quantity;

    // Create order
    const order = await prisma.order.create({
      data: {
        serviceId,
        customerName,
        customerEmail,
        customerPhone,
        address,
        specialRequests,
        quantity,
        totalAmount,
        userId: req.user?.id,
      },
      include: {
        service: true,
      },
    });

    logger.info(`New order created: ${order.id} by ${customerEmail}`);

    // Send email to admin
    await sendAdminNotification({
      subject: `New Order Received - Order #${order.id.substring(0, 8)}`,
      html: `
        <h2>New Order Notification</h2>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${customerPhone || 'N/A'}</p>
        <p><strong>Service:</strong> ${service.name}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
        <p><strong>Address:</strong> ${address || 'N/A'}</p>
        <p><strong>Special Requests:</strong> ${specialRequests || 'None'}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
      `,
      text: `New order received from ${customerName} (${customerEmail}). Order ID: ${order.id}. Total: $${totalAmount.toFixed(2)}`,
    });

    // Send confirmation email to customer
    await sendEmail({
      to: customerEmail,
      subject: `Order Confirmation - Order #${order.id.substring(0, 8)}`,
      html: `
        <h2>Thank You for Your Order!</h2>
        <p>Dear ${customerName},</p>
        <p>We have received your order and will process it shortly.</p>
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Service:</strong> ${service.name}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
        <p>We will contact you soon with further updates.</p>
        <p>Best regards,<br>Your Team</p>
      `,
      text: `Thank you for your order! Order ID: ${order.id}. Total: $${totalAmount.toFixed(2)}`,
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order },
    });
  } catch (error) {
    logger.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus } = req.query;

    const where = {
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
    };

    // If not admin, only show user's orders
    if (req.user.role !== 'ADMIN') {
      where.userId = req.user.id;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        service: true,
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
      count: orders.length,
      data: { orders },
    });
  } catch (error) {
    logger.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check authorization
    if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order',
      });
    }

    res.status(200).json({
      success: true,
      data: { order },
    });
  } catch (error) {
    logger.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      },
      include: {
        service: true,
      },
    });

    // Notify customer
    await sendEmail({
      to: order.customerEmail,
      subject: `Order Status Update - Order #${order.id.substring(0, 8)}`,
      html: `
        <h2>Order Status Update</h2>
        <p>Dear ${order.customerName},</p>
        <p>Your order status has been updated.</p>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>New Status:</strong> ${order.status}</p>
        <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
        <p>Thank you for your business!</p>
      `,
      text: `Your order ${order.id} status has been updated to ${order.status}`,
    });

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: { order },
    });
  } catch (error) {
    logger.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
    });
  }
};

export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { service: true },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id,
        customerEmail: order.customerEmail,
        serviceName: order.service.name,
      },
      description: `Payment for ${order.service.name} - Order #${order.id.substring(0, 8)}`,
    });

    // Update order with payment intent ID
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentIntentId: paymentIntent.id,
      },
    });

    logger.info(`Payment intent created for order ${orderId}: ${paymentIntent.id}`);

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error) {
    logger.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment intent',
    });
  }
};
