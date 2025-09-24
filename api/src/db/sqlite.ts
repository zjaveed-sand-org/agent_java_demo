/**
 * SQLite database connection and helper functions
 */

import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { DB_CONFIG, TEST_DB_CONFIG } from './config';

// Enable verbose mode in development
const Database =
  process.env.NODE_ENV === 'development' ? sqlite3.verbose().Database : sqlite3.Database;

/*
 * Database connection and query execution
 */
class DatabaseConnection {
  public db: sqlite3.Database;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  public run(sql: string, params: any[] = []): Promise<{ lastID?: number; changes: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (this: sqlite3.RunResult, err: Error | null) {
        if (err) {
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  public get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise<T | undefined>((resolve, reject) => {
      this.db.get(sql, params, (err: Error | null, row: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as T);
        }
      });
    });
  }

  public all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      this.db.all(sql, params, (err: Error | null, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as T[]);
        }
      });
    });
  }

  public close(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.close((err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

class SQLiteHelper {
  private static instance: SQLiteHelper;
  private connection: sqlite3.Database | null = null;

  private constructor() {}

  public static getInstance(): SQLiteHelper {
    if (!SQLiteHelper.instance) {
      SQLiteHelper.instance = new SQLiteHelper();
    }
    return SQLiteHelper.instance;
  }

  /**
   * Initialize database connection
   */
  public async connect(isTest: boolean = false): Promise<DatabaseConnection> {
    const config = isTest ? TEST_DB_CONFIG : DB_CONFIG;

    // Ensure data directory exists for file-based databases
    if (config.DB_FILE !== ':memory:') {
      const dataDir = path.dirname(config.DB_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    }

    return new Promise((resolve, reject) => {
      this.connection = new Database(config.DB_FILE, (err) => {
        if (err) {
          reject(new Error(`Failed to connect to database: ${err.message}`));
          return;
        }

        // Configure database settings
        this.setupDatabase()
          .then(() => {
            const wrappedConnection = this.wrapConnection(this.connection!);
            resolve(wrappedConnection);
          })
          .catch(reject);
      });
    });
  }

  /**
   * Configure database settings
   */
  private async setupDatabase(): Promise<void> {
    if (!this.connection) return;

    const config = DB_CONFIG;

    return new Promise((resolve, reject) => {
      // Enable foreign key constraints
      if (config.FOREIGN_KEYS) {
        this.connection!.run('PRAGMA foreign_keys = ON;', (err) => {
          if (err) {
            reject(new Error(`Failed to enable foreign keys: ${err.message}`));
            return;
          }
        });
      }

      // Enable WAL mode for better concurrency (only for file databases)
      if (config.ENABLE_WAL && config.DB_FILE !== ':memory:') {
        this.connection!.run('PRAGMA journal_mode = WAL;', (err) => {
          if (err) {
            reject(new Error(`Failed to enable WAL mode: ${err.message}`));
            return;
          }
        });
      }

      // Set timeout
      this.connection!.configure('busyTimeout', config.TIMEOUT);

      resolve();
    });
  }

  /**
   * Wrap the database connection with promisified methods
   */
  private wrapConnection(db: sqlite3.Database): DatabaseConnection {
  return new DatabaseConnection(db);
  }

  /**
   * Close database connection
   */
  public async close(): Promise<void> {
    if (this.connection) {
      return new Promise((resolve, reject) => {
        this.connection!.close((err) => {
          if (err) {
            reject(new Error(`Failed to close database: ${err.message}`));
          } else {
            this.connection = null;
            resolve();
          }
        });
      });
    }
  }
}

// Global database connection instance
let dbConnection: DatabaseConnection | null = null;

/**
 * Get the global database connection
 */
export async function getDatabase(isTest: boolean = false): Promise<DatabaseConnection> {
  if (!dbConnection) {
    const helper = SQLiteHelper.getInstance();
    dbConnection = await helper.connect(isTest);
  }
  return dbConnection;
}

/**
 * Close the global database connection
 */
export async function closeDatabase(): Promise<void> {
  if (dbConnection) {
    await dbConnection.close();
    dbConnection = null;
  }
}

export { SQLiteHelper, DatabaseConnection };
