const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json({limit: '50mb'}));
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
            stock_name TEXT,
            industry TEXT,
            sector TEXT,
            exchange TEXT,
            close_yest REAL,
            price_open REAL,
            price REAL,
            low REAL,
            high REAL,
            chg_rs REAL,
            chg_percentage REAL,
            volume INTEGER,
            avg_volume INTEGER,
            volume_spike REAL,
            month_high REAL,
            month_low REAL,
            month_hl_cross TEXT,
            year_high REAL,
            year_low REAL,
            year_hl_cross TEXT,
            marketcap REAL,
            eps REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating stocks table', err);
            } else {
                console.log('Stocks table ready');
            }
        });
    }
});

// POST route to add a new stock entry
app.post('/stocks', (req, res) => {
    // Destructure all fields, allowing them to be optional
    const stocks = req.body;

    stocks.forEach(stock => {
        const {
          symbol = null,
          logo = null,
          view_chart = null,
          website_link = null,
          stock_name = null,
          industry = null,
          sector = null,
          exchange = null,
          close_yest = null,
          price_open = null,
          price = null,
          low = null,
          high = null,
          chg_rs = null,
          chg_percentage = null,
          volume = null,
          avg_volume = null,
          volume_spike = null,
          month_high = null,
          month_low = null,
          month_hl_cross = null,
          year_high = null,
          year_low = null,
          year_hl_cross = null,
          marketcap = null,
          eps = null
      } = stock;

      // Prepare the SQL query with all fields
      const query = `
          INSERT INTO stocks (
              symbol, logo, view_chart, website_link, stock_name, industry, 
              sector, exchange, close_yest, price_open, price, low, high, 
              chg_rs, chg_percentage, volume, avg_volume, volume_spike, 
              month_high, month_low, month_hl_cross, year_high, year_low, 
              year_hl_cross, marketcap, eps
          ) VALUES (
              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
              ?, ?, ?, ?, ?, ?, ?, ?
          )
      `;

      // Execute the query with all fields
      db.run(query, [
          symbol, logo, view_chart, website_link, stock_name, industry, 
          sector, exchange, close_yest, price_open, price, low, high, 
          chg_rs, chg_percentage, volume, avg_volume, volume_spike, 
          month_high, month_low, month_hl_cross, year_high, year_low, 
          year_hl_cross, marketcap, eps
      ], function(err) {
          if (err) {
              return res.status(500).json({ error: err.message });
          }
          console.log('created');
          
      });
    });
      res.status(201).json({ 
          message: 'Stock entry created successfully', 
          stockId: this.lastID 
      });
});

// GET route to retrieve all stock entries
// Paginated GET route for stocks
app.get('/stocks', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // First, get total count of stocks
    db.get('SELECT COUNT(*) as total FROM stocks', [], (err, countRow) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const totalStocks = countRow.total;
        const totalPages = Math.ceil(totalStocks / limit);

        // Then, fetch paginated stocks
        db.all('SELECT * FROM stocks LIMIT ? OFFSET ?', [limit, offset], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            res.json({
                stocks: rows,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalStocks: totalStocks,
                    pageSize: limit
                }
            });
        });
    });
});

// GET route to retrieve a single stock by symbol
app.get('/stocks/:symbol', (req, res) => {
    db.get('SELECT * FROM stocks WHERE symbol = ?', [req.params.symbol], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Stock not found' });
        }
        res.json(row);
    });
});
// Start the server
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