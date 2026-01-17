const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const db = new sqlite3.Database(
  path.join(__dirname, 'database.db'),
  (err) => {
    if (err) {
      console.error('Failed to connect to database:', err.message);
    } else {
      console.log('Connected to SQLite database.');
    }
  }
);

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL
    )
  `);
});

// Export the database connection
module.exports = db;
