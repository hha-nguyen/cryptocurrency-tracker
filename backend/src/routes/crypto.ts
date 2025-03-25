import express, { Request, Response, NextFunction } from 'express';
import { getCurrentPrice, getPriceHistory, getCryptocurrencies } from '../controllers/cryptoController';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoriteController';

const router = express.Router();

// Helper to properly type express handlers that return Promises
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * @route GET /api/price/:symbol
 * @description Get current price for a cryptocurrency
 * @param {string} symbol - Cryptocurrency symbol (e.g., BTC, ETH)
 */
router.get('/price/:symbol', asyncHandler(getCurrentPrice));

/**
 * @route GET /api/history/:symbol/:days
 * @description Get price history for a cryptocurrency
 * @param {string} symbol - Cryptocurrency symbol (e.g., BTC, ETH)
 * @param {number} days - Number of days of history to retrieve
 */
router.get('/history/:symbol/:days', asyncHandler(getPriceHistory));

/**
 * @route GET /api/favorites
 * @description Get all favorite cryptocurrencies
 */
router.get('/favorites', asyncHandler(getFavorites));

/**
 * @route POST /api/favorites
 * @description Add a cryptocurrency to favorites
 * @body {symbol, name} - Symbol and name of the cryptocurrency
 */
router.post('/favorites', asyncHandler(addFavorite));

/**
 * @route DELETE /api/favorites/:symbol
 * @description Remove a cryptocurrency from favorites
 * @param {string} symbol - Cryptocurrency symbol
 */
router.delete('/favorites/:symbol', asyncHandler(removeFavorite));

/**
 * @route GET /api/cryptocurrencies
 * @description Get list of cryptocurrencies with pagination
 * @query {number} page - Page number (default: 1)
 * @query {number} perPage - Items per page (default: 50, max: 250)
 */
router.get('/cryptocurrencies', asyncHandler(getCryptocurrencies));

export default router;
