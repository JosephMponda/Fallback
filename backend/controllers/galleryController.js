import prisma from '../config/database.js';
import logger from '../config/logger.js';

export const getAllGalleryItems = async (req, res) => {
  try {
    const { category, featured } = req.query;

    const items = await prisma.galleryItem.findMany({
      where: {
        ...(category && { category }),
        ...(featured !== undefined && { featured: featured === 'true' }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: { items },
    });
  } catch (error) {
    logger.error('Get gallery items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery items',
    });
  }
};

export const getGalleryItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.galleryItem.findUnique({
      where: { id },
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { item },
    });
  } catch (error) {
    logger.error('Get gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery item',
    });
  }
};

export const createGalleryItem = async (req, res) => {
  try {
    const { title, description, imageUrl, category, featured } = req.body;

    const item = await prisma.galleryItem.create({
      data: {
        title,
        description,
        imageUrl,
        category,
        featured: featured || false,
      },
    });

    logger.info(`New gallery item created: ${item.title}`);

    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: { item },
    });
  } catch (error) {
    logger.error('Create gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating gallery item',
    });
  }
};

export const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, category, featured } = req.body;

    const item = await prisma.galleryItem.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(imageUrl && { imageUrl }),
        ...(category !== undefined && { category }),
        ...(featured !== undefined && { featured }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully',
      data: { item },
    });
  } catch (error) {
    logger.error('Update gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating gallery item',
    });
  }
};

export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.galleryItem.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully',
    });
  } catch (error) {
    logger.error('Delete gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting gallery item',
    });
  }
};
