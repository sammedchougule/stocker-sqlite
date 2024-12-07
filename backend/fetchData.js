const { google } = require("googleapis");
const credentials = require("./credentials.json"); // Google API credentials
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();



function storeData(data) {
  const db = new sqlite3.Database('./stocks.db');
    
  const chunkSize = 300; // Maximum number of rows per query (adjust if needed)
  const stocks = data;

  // Generate the placeholders for a single stock insert
  const stockPlaceholder = '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const fieldsPerStock = 26; // Number of fields in each stock object

  // Split stocks into chunks
  const chunks = [];
  for (let i = 0; i < stocks.length; i += chunkSize) {
      chunks.push(stocks.slice(i, i + chunkSize));
  }

  let insertedCount = 0;

  db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      chunks.forEach((chunk, index) => {
          const values = chunk.flatMap(stock => [
            stock.symbol,
            stock.logo,
            stock.view_chart,
            stock.website_link,
            stock.companyname,
            stock.industry,
            stock.sector,
            stock.exchange,
            stock.closeyest,
            stock.priceopen,
            stock.price,
            stock.low,
            stock.high,
            stock.change,
            stock.changepct,
            stock.tradetime,
            stock.volume,
            stock.volumeavg,
            stock.volumespike,
            stock.month_high,
            stock.month_low,
            stock.month_hl_cross,
            stock.high52,
            stock.low52,
            stock.year_hl_cross,
            stock.marketcap,
            stock.eps, 
          ]);

          const truncateQuery = 'DELETE FROM stocks';

          db.run(truncateQuery, function (err) {
              if (err) {
                  console.error('Error truncating table:', err.message);
              } else {
                  const query = `
                      INSERT INTO stocks (
                         symbol,
                          logo,
                          view_chart,
                          website_link,
                          companyname,
                          industry,
                          sector,
                          exchange,
                          closeyest,
                          priceopen,
                          price,
                          low,
                          high,
                          change,
                          changepct,
                          tradetime,
                          volume,
                          volumeavg,
                          volumespike,
                          month_high,
                          month_low,
                          month_hl_cross,
                          high52,
                          low52,
                          year_hl_cross,
                          marketcap,
                          eps
                      ) VALUES 
                      ${chunk.map(() => stockPlaceholder).join(',')}
                  `;

                  db.run(query, values, function (err) {
                      if (err) {
                          console.error(`Error inserting chunk ${index + 1}:`, err.message);
                      } else {
                          insertedCount += this.changes;
                      }
                  });
              }
          });
      });

      db.run('COMMIT', (err) => {
          if (err) {
              console.error('Transaction commit failed:', err.message);
              return
          }
      });
  });
  
}


// Google Sheets configuration
const spreadsheetId = process.env.SPREADSHEET_ID; // Replace with your spreadsheet ID
const range = process.env.RANGE; // Replace with your sheet and range

// Fetch data from Google Sheets
async function getGoogleSheetsData() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: process.env.SCOPES.split(',') ?? [],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: range, // Adjusted range to match the full data
    });

    if (!response.data.values || response.data.values.length === 0) {
      console.log("No data found in the Google Sheet.");
      return [];
    }

    const rows = response.data.values;
    const headers = rows[0]; // First row as headers

    // Dynamically map all rows to their respective headers
    return rows.slice(1).map((row) => {
      const rowData = {};
      headers.forEach((header, index) => {
        const value = row[index] || "0"; // Default to "0" if cell is empty
        rowData[header] = header === "price" ? parseFloat(value) || 0 : value;
      });
      return rowData;
    });
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error.message);
    return [];
  }
}



// Periodically fetch data and broadcast to WebSocket clients
setInterval(async () => {
  const stockData = await getGoogleSheetsData();
  
  if (stockData.length > 0) {
    // console.log("Broadcasting stock data:", stockData);
    storeData(stockData);
  }
}, 5000);
