import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db;

export async function initializeDatabase() {
    const dbDir = './database';
    if (!existsSync(dbDir)) {
        mkdirSync(dbDir, { recursive: true });
    }

    db = await open({
        filename: process.env.DB_PATH || './database/dreamhunters.db',
        driver: sqlite3.Database
    });

    // Create users table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            username TEXT,
            nox INTEGER DEFAULT 0,
            vex INTEGER DEFAULT 0,
            level INTEGER DEFAULT 1,
            xp INTEGER DEFAULT 0,
            last_daily DATETIME,
            last_hunt DATETIME,
            voice_start DATETIME,
            voice_time INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create spirits table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS spirits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            spirit_name TEXT,
            rarity TEXT,
            obtained_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (user_id)
        )
    `);

    // Create activity log table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS activity_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            activity_type TEXT,
            reward_amount INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (user_id)
        )
    `);

    console.log('📦 Database tables initialized');
}

export async function getUser(userId) {
    if (!db) await initializeDatabase();
    
    let user = await db.get('SELECT * FROM users WHERE user_id = ?', [userId]);
    
    if (!user) {
        await db.run(`
            INSERT INTO users (user_id, username) 
            VALUES (?, ?)
        `, [userId, 'Unknown']);
        
        user = await db.get('SELECT * FROM users WHERE user_id = ?', [userId]);
    }
    
    return user;
}

export async function updateUser(userId, updates) {
    if (!db) await initializeDatabase();
    
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    
    await db.run(`UPDATE users SET ${setClause} WHERE user_id = ?`, [...values, userId]);
}

export async function addSpirit(userId, spiritName, rarity) {
    if (!db) await initializeDatabase();
    
    await db.run(`
        INSERT INTO spirits (user_id, spirit_name, rarity) 
        VALUES (?, ?, ?)
    `, [userId, spiritName, rarity]);
}

export async function getUserSpirits(userId) {
    if (!db) await initializeDatabase();
    
    return await db.all('SELECT * FROM spirits WHERE user_id = ? ORDER BY obtained_at DESC', [userId]);
}

export async function getLeaderboard(type = 'nox', limit = 10) {
    if (!db) await initializeDatabase();
    
    return await db.all(`
        SELECT user_id, username, ${type} 
        FROM users 
        WHERE ${type} > 0 
        ORDER BY ${type} DESC 
        LIMIT ?
    `, [limit]);
}

export async function logActivity(userId, activityType, rewardAmount) {
    if (!db) await initializeDatabase();
    
    await db.run(`
        INSERT INTO activity_log (user_id, activity_type, reward_amount) 
        VALUES (?, ?, ?)
    `, [userId, activityType, rewardAmount]);
}

export { db };