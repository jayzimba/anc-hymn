import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export const getDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('hymns.db');
  }
  return db;
};

export interface FavoriteHymn {
  id?: number;
  language: string;
  hymnId: number;
  title: string;
  number: string;
  dateAdded?: string;
}

export const initDatabase = async () => {
  try {
    const database = await getDb();
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        language TEXT NOT NULL,
        hymnId INTEGER NOT NULL,
        title TEXT NOT NULL,
        number TEXT NOT NULL,
        dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(language, hymnId)
      );
    `);
    console.log('Database initialized');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};

export const addFavoriteHymn = async (
  language: string,
  hymn: { id: number; title: string; number: string }
): Promise<boolean> => {
  const database = await getDb();
  try {
    await database.runAsync(
      `INSERT OR REPLACE INTO favorites (language, hymnId, title, number)
       VALUES (?, ?, ?, ?)`,
      [language, hymn.id, hymn.title, hymn.number]
    );
    return true;
  } catch (error) {
    console.error('Error adding favorite hymn:', error);
    throw error;
  }
};

export const removeFavoriteHymn = async (
  language: string,
  hymnId: number
): Promise<boolean> => {
  const database = await getDb();
  try {
    await database.runAsync(
      'DELETE FROM favorites WHERE language = ? AND hymnId = ?',
      [language, hymnId]
    );
    return true;
  } catch (error) {
    console.error('Error removing favorite hymn:', error);
    throw error;
  }
};

export const getFavoriteHymns = async (language: string): Promise<FavoriteHymn[]> => {
  const database = await getDb();
  try {
    const favorites = await database.getAllAsync<FavoriteHymn>(
      'SELECT * FROM favorites WHERE language = ? ORDER BY dateAdded DESC',
      [language]
    );
    return favorites || [];
  } catch (error) {
    console.error('Error getting favorite hymns:', error);
    throw error;
  }
};

export const isHymnFavorite = async (
  language: string,
  hymnId: number
): Promise<boolean> => {
  const database = await getDb();
  try {
    const result = await database.getAllAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM favorites WHERE language = ? AND hymnId = ?',
      [language, hymnId]
    );
    return (result?.[0]?.count ?? 0) > 0;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    throw error;
  }
};

export const getFavoriteCount = async (language: string): Promise<number> => {
  const database = await getDb();
  try {
    const result = await database.getAllAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM favorites WHERE language = ?',
      [language]
    );
    return result?.[0]?.count ?? 0;
  } catch (error) {
    console.error('Error getting favorite count:', error);
    return 0;
  }
}; 