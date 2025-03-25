import db from '../database/config';

export interface PriceHistoryRecord {
  id?: number;
  symbol: string;
  price: number;
  timestamp: Date;
}

export class PriceHistory {
  /**
   * Save price data to the database
   * @param data Price data to save
   * @returns Saved record
   */
  static async savePrice(data: Omit<PriceHistoryRecord, 'id'>): Promise<PriceHistoryRecord> {
    const [id] = await db('price_history').insert(data);
    return { ...data, id };
  }

  /**
   * Get price history for a specific cryptocurrency
   * @param symbol Cryptocurrency symbol
   * @param limit Number of records to retrieve
   * @returns Array of price history records
   */
  static async getPriceHistory(symbol: string, limit: number = 100): Promise<PriceHistoryRecord[]> {
    return db('price_history')
      .where('symbol', symbol.toLowerCase())
      .orderBy('timestamp', 'desc')
      .limit(limit);
  }

  /**
   * Get price history for a specific cryptocurrency within a time range
   * @param symbol Cryptocurrency symbol
   * @param startDate Start date for the range
   * @param endDate End date for the range
   * @returns Array of price history records
   */
  static async getPriceHistoryRange(
    symbol: string,
    startDate: Date,
    endDate: Date = new Date()
  ): Promise<PriceHistoryRecord[]> {
    return db('price_history')
      .where('symbol', symbol.toLowerCase())
      .whereBetween('timestamp', [startDate, endDate])
      .orderBy('timestamp', 'desc');
  }

  /**
   * Delete old price history records to manage database size
   * @param olderThan Delete records older than this date
   * @returns Number of deleted records
   */
  static async cleanupOldRecords(olderThan: Date): Promise<number> {
    return db('price_history')
      .where('timestamp', '<', olderThan)
      .delete();
  }
} 