import { Request, Response } from 'express';
import { Favorite } from '../models/Favorite';

/**
 * Get all favorite cryptocurrencies
 * @param req - Express request object
 * @param res - Express response object
 */
export const getFavorites = async (req: Request, res: Response) => {
  try {
    const favorites = await Favorite.getAllFavorites();
    return res.status(200).json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return res.status(500).json({
      error: 'Failed to fetch favorites',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Add a cryptocurrency to favorites
 * @param req - Express request object
 * @param res - Express response object
 */
export const addFavorite = async (req: Request, res: Response) => {
  try {
    const { symbol, name } = req.body;

    if (!symbol || !name) {
      return res.status(400).json({ error: 'Symbol and name are required' });
    }

    const favorite = await Favorite.addFavorite({ symbol, name });
    return res.status(201).json(favorite);
  } catch (error) {
    console.error('Error adding favorite:', error);

    // Check if it's a duplicate error
    if (error instanceof Error && error.message.includes('already in favorites')) {
      return res.status(409).json({
        error: 'Duplicate favorite',
        message: error.message
      });
    }

    return res.status(500).json({
      error: 'Failed to add favorite',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Remove a cryptocurrency from favorites
 * @param req - Express request object
 * @param res - Express response object
 */
export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    const deleteCount = await Favorite.removeFavorite(symbol);

    if (deleteCount === 0) {
      return res.status(404).json({ error: `Favorite with symbol ${symbol} not found` });
    }

    return res.status(200).json({ message: `Removed ${symbol} from favorites` });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return res.status(500).json({
      error: 'Failed to remove favorite',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
