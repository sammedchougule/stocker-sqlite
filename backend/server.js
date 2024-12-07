const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(bodyParser.json({limit: '1mb'}));
app.use(cors())
// Connect to SQLite database
const dbPath = path.resolve(__dirname, 'stocks.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database', err);
    } else {
        console.log('Connected to the SQLite database');
        
        // Create stocks table with all fields nullable
        db.run(`CREATE TABLE IF NOT EXISTS stocks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT,
            logo TEXT,
            view_chart TEXT,
            website_link TEXT,
            companyname TEXT,
            industry TEXT,
            sector TEXT,
            exchange TEXT,
            closeyest REAL,
            priceopen REAL,
            price REAL,
            low REAL,
            high REAL,
            change REAL,
            changepct REAL,
            tradetime INTEGER,
            volume INTEGER,
            volumeavg REAL,
            volumespike REAL,
            month_high REAL,
            month_low TEXT,
            month_hl_cross REAL,
            high52 REAL,
            low52 TEXT,
            year_hl_cross REAL,
            marketcap REAL,
            eps REAL,
            createed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating stocks table', err);
            } else {
                console.log('Stocks table ready');
            }
        });
    }
});

require('./fetchData')

  
  // Endpoint for search suggestions
  app.get('/api/search', (req, res) => {
    const query = req.query.q;
    const sql = `
      SELECT symbol, companyname
      FROM stocks
      WHERE symbol LIKE ? OR companyname LIKE ?
      LIMIT 10
    `;
    const params = [`%${query}%`, `%${query}%`];
  
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });
  
  // Endpoint for full stock details
  app.get('/api/stock/:symbol', (req, res) => {
    const symbol = req.params.symbol;
    const sql = `SELECT * FROM stocks WHERE symbol = ?`;
  
    db.get(sql, [symbol], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (row) {
        res.json(row);
      } else {
        res.status(404).json({ error: 'Stock not found' });
      }
    });
  });

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});