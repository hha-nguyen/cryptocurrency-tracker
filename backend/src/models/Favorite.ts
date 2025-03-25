import db from '../database/config';

export interface FavoriteRecord {
  id?: number;
  symbol: string;
  name: string;
  created_at?: Date;
}

export class Favorite {
  /**
   * Add a cryptocurrency to favorites
   * @param data Favorite data to save
   * @returns Saved favorite record
   */
  static async addFavorite(data: Omit<FavoriteRecord, 'id' | 'created_at'>): Promise<FavoriteRecord> {
    try {
      const [id] = await db('favorites').insert({
        symbol: data.symbol.toLowerCase(),
        name: data.name,
      });
      
      return { ...data, id };
    } catch (error) {
      // Handle unique constraint violation (favorite already exists)
      if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
        throw new Error(`${data.symbol} is already in favorites`);
      }
      throw error;
    }
  }

  /**
   * Remove a cryptocurrency from favorites
   * @param symbol Cryptocurrency symbol
   * @returns Number of records deleted (0 or 1)
   */
  static async removeFavorite(symbol: string): Promise<number> {
    return db('favorites')
      .where('symbol', symbol.toLowerCase())
      .delete();
  }

  /**
   * Get all favorite cryptocurrencies
   * @returns Array of favorite records
   */
  static async getAllFavorites(): Promise<FavoriteRecord[]> {
    return db('favorites').orderBy('created_at', 'desc');
  }

  /**
   * Check if a cryptocurrency is in favorites
   * @param symbol Cryptocurrency symbol
   * @returns True if favorite exists, false otherwise
   */
  static async isFavorite(symbol: string): Promise<boolean> {
    const favorite = await db('favorites')
      .where('symbol', symbol.toLowerCase())
      .first();
    
    return favorite !== undefined;
  }
} 