const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./leads.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    company TEXT,
    message TEXT
  )`);
});

module.exports = db;
