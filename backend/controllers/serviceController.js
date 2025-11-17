import prisma from '../config/database.js';
import logger from '../config/logger.js';

export const getAllServices = async (req, res) => {
  try {
    const { active } = req.query;
    
    const services = await prisma.service.findMany({
      where: {
        ...(active !== undefined && { active: active === 'true' }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      count: services.length,
      data: { services },
    });
  } catch (error) {
    logger.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { service },
    });
  } catch (error) {
    logger.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
    });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, description, price, imageUrl, active } = req.body;

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        active: active !== undefined ? active : true,
      },
    });

    logger.info(`New service created: ${service.name}`);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: { service },
    });
  } catch (error) {
    logger.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service',
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, active } = req.body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(imageUrl && { imageUrl }),
        ...(active !== undefined && { active }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: { service },
    });
  } catch (error) {
    logger.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service',
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.service.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    logger.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
    });
  }
};
