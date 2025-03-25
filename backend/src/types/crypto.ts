/**
 * Type for cryptocurrency price data
 */
export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: {
    usd: number;
    eur: number;
    gbp: number;
  };
  market_cap: number;
  price_change_24h: number;
  last_updated: string;
}

/**
 * Type for price history data point
 */
export interface PriceDataPoint {
  timestamp: number;
  price: number;
}

/**
 * Type for cryptocurrency price history
 */
export interface CryptoPriceHistory {
  symbol: string;
  data: PriceDataPoint[];
}

/**
 * Type for cryptocurrency list item from CoinGecko API
 */
export interface CryptocurrencyListItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  last_updated: string;
} 