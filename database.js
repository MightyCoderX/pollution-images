import sqlite3 from "sqlite3";

export const db = new sqlite3.Database('pollution-images.db');
db.serialize(() =>
{
    db.run(`CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        fileName TEXT, 
        mimeType TEXT, 
        size INTEGER,
        dateCreated DATE,
        description TEXT, 
        latitude FLOAT, 
        longitude FLOAT
    )`);
});