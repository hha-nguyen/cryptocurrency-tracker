import { Request, Response } from 'express';
import { fetchCryptoPrice, fetchCryptoPriceHistory, fetchCryptocurrencies } from '../services/cryptoService';

/**
 * Get current price for a cryptocurrency
 * @param req - Express request object
 * @param res - Express response object
 */
export const getCurrentPrice = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }
    
    const price = await fetchCryptoPrice(symbol.toLowerCase());
    return res.status(200).json(price);
  } catch (error) {
    console.error('Error fetching current price:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch price data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get price history for a cryptocurrency
 * @param req - Express request object
 * @param res - Express response object
 */
export const getPriceHistory = async (req: Request, res: Response) => {
  try {
    const { symbol, days } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }
    
    const daysNum = parseInt(days, 10) || 7; // Default to 7 days if not specified
    
    const history = await fetchCryptoPriceHistory(symbol.toLowerCase(), daysNum);
    return res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching price history:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch price history',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get a list of available cryptocurrencies
 * @param req - Express request object
 * @param res - Express response object
 */
export const getCryptocurrencies = async (req: Request, res: Response) => {
  try {
    // Parse pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 50;
    
    // Validate pagination parameters
    if (page < 1 || perPage < 1 || perPage > 250) {
      return res.status(400).json({
        error: 'Invalid pagination parameters',
        message: 'Page must be >= 1 and perPage must be between 1 and 250'
      });
    }
    
    const cryptocurrencies = await fetchCryptocurrencies(page, perPage);
    
    return res.status(200).json({
      success: true,
      data: cryptocurrencies,
      meta: {
        page,
        perPage,
        count: cryptocurrencies.length
      }
    });
  } catch (error) {
    console.error('Error fetching cryptocurrencies:', error);
    return res.status(500).json({
      error: 'Server error',
      message: error instanceof Error ? error.message : 'Failed to fetch cryptocurrencies'
    });
  }
}; 