import axios from 'axios';
import { CryptoPrice, CryptoPriceHistory } from '../types/crypto';
import { PriceHistory } from '../models/PriceHistory';

// Cache to store price data to reduce API calls
const priceCache: Record<string, { data: CryptoPrice; timestamp: number }> = {};
const cacheExpiration = 60 * 1000; // 60 seconds in milliseconds

/**
 * Fetch current price for a cryptocurrency from CoinGecko API
 * @param symbol - Cryptocurrency symbol (e.g., bitcoin, ethereum)
 * @returns Promise with price data
 */
export const fetchCryptoPrice = async (symbol: string): Promise<CryptoPrice> => {
  // Check cache first
  const now = Date.now();
  const cacheKey = `price-${symbol}`;
  
  if (priceCache[cacheKey] && now - priceCache[cacheKey].timestamp < cacheExpiration) {
    return priceCache[cacheKey].data;
  }
  
  try {
    // CoinGecko API requires IDs rather than symbols
    const coinId = mapSymbolToCoinGeckoId(symbol);
    
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}`,
      {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
        },
      }
    );
    
    const { data } = response;
    
    const priceData: CryptoPrice = {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      image: data.image.large,
      current_price: {
        usd: data.market_data.current_price.usd,
        eur: data.market_data.current_price.eur,
        gbp: data.market_data.current_price.gbp,
      },
      market_cap: data.market_data.market_cap.usd,
      price_change_24h: data.market_data.price_change_percentage_24h,
      last_updated: data.market_data.last_updated,
    };
    
    // Update cache
    priceCache[cacheKey] = {
      data: priceData,
      timestamp: now,
    };
    
    // Save price data to database for historical purposes
    await PriceHistory.savePrice({
      symbol: priceData.symbol,
      price: priceData.current_price.usd,
      timestamp: new Date(),
    });
    
    return priceData;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    throw new Error(`Failed to fetch price data for ${symbol}`);
  }
};

/**
 * Fetch price history for a cryptocurrency from CoinGecko API
 * @param symbol - Cryptocurrency symbol (e.g., bitcoin, ethereum)
 * @param days - Number of days of history to retrieve
 * @returns Promise with price history data
 */
export const fetchCryptoPriceHistory = async (
  symbol: string,
  days: number = 7
): Promise<CryptoPriceHistory> => {
  try {
    // First, try to get history from our database
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const localHistory = await PriceHistory.getPriceHistoryRange(
      symbol,
      startDate
    );
    
    // If we have enough data in our database, use it
    if (localHistory.length > 0) {
      const formattedData = localHistory.map((record) => ({
        timestamp: record.timestamp.getTime(),
        price: record.price,
      }));
      
      return {
        symbol,
        data: formattedData,
      };
    }
    
    // Otherwise, fetch from CoinGecko API
    const coinId = mapSymbolToCoinGeckoId(symbol);
    
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: days,
        },
      }
    );
    
    const { data } = response;
    
    // Format the data for our frontend
    const formattedData = data.prices.map((item: [number, number]) => {
      const timestamp = new Date(item[0]);
      const price = item[1];
      
      // Save price points to database (don't wait for it)
      PriceHistory.savePrice({
        symbol: symbol.toLowerCase(),
        price,
        timestamp,
      }).catch(err => console.error(`Failed to save price history: ${err.message}`));
      
      return {
        timestamp: item[0],
        price: item[1],
      };
    });
    
    return {
      symbol,
      data: formattedData,
    };
  } catch (error) {
    console.error(`Error fetching price history for ${symbol}:`, error);
    throw new Error(`Failed to fetch price history for ${symbol}`);
  }
};

/**
 * Map common cryptocurrency symbols to CoinGecko IDs
 * @param symbol - Cryptocurrency symbol
 * @returns CoinGecko ID for the symbol
 */
const mapSymbolToCoinGeckoId = (symbol: string): string => {
  const symbolMap: Record<string, string> = {
    btc: 'bitcoin',
    eth: 'ethereum',
    usdt: 'tether',
    usdc: 'usd-coin',
    bnb: 'binancecoin',
    xrp: 'ripple',
    sol: 'solana',
    ada: 'cardano',
    doge: 'dogecoin',
    dot: 'polkadot',
    // Add more mappings as needed
  };
  
  // If the symbol is directly in our map, return it
  if (symbolMap[symbol]) {
    return symbolMap[symbol];
  }
  
  // Otherwise, assume the symbol might be the ID
  return symbol;
};

/**
 * Fetch list of cryptocurrencies from CoinGecko API with pagination
 * @param page - Page number (starting from 1)
 * @param perPage - Number of cryptocurrencies per page
 * @returns Promise with list of cryptocurrencies
 */
export const fetchCryptocurrencies = async (
  page: number = 1,
  perPage: number = 50
) => {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;
    const baseUrl = 'https://api.coingecko.com/api/v3';
    
    // Build URL and params
    const url = `${baseUrl}/coins/markets`;
    const params: any = {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: perPage,
      page: page,
      sparkline: false,
    };
    
    // Add API key if available
    const headers: Record<string, string> = {};
    if (apiKey) {
      headers['x-cg-pro-api-key'] = apiKey;
    }
    
    const response = await axios.get(url, { 
      params,
      headers
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching cryptocurrencies list:', error);
    throw new Error('Failed to fetch cryptocurrencies list');
  }
}; 