import sqlite3 from 'sqlite3';
import { google } from "googleapis";
import credentials from "./credentials.json" with { type: "json" };

const spreadsheetId = "1y-oRS9ena3yf-IgqPBHDWyVLETbty34gx_z-PJhTfmg"; // Replace with your spreadsheet ID
const range = "nse"; // Replace with your sheet and range

async function getGoogleSheetsDataAndSaveToSQLite() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: range, // Adjusted range to match the full data
    });

    if (!response.data.values || response.data.values.length === 0) {
      console.log("No data found in the Google Sheet.");
      return;
    }

    const rows = response.data.values;
    const headers = rows[0]; // First row as headers

    // Open SQLite database connection
    const db = new sqlite3.Database("stocks_data.sqlite");

    // Create table if not exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS stocks (
        symbol TEXT DEFAULT NULL,
        logo TEXT DEFAULT NULL,
        view_chart TEXT DEFAULT NULL,
        website_link TEXT DEFAULT NULL,
        stock_name TEXT DEFAULT NULL,
        industry TEXT DEFAULT NULL,
        sector TEXT DEFAULT NULL,
        exchange TEXT DEFAULT NULL,
        close_yest TEXT DEFAULT NULL,
        price_open TEXT DEFAULT NULL,
        price REAL,
        low TEXT DEFAULT NULL,
        high TEXT DEFAULT NULL,
        chg_rs TEXT DEFAULT NULL,
        chg_percentage TEXT DEFAULT NULL,
        volume TEXT DEFAULT NULL,
        avg_volume TEXT DEFAULT NULL,
        volume_spike TEXT DEFAULT NULL,
        month_high TEXT DEFAULT NULL,
        month_low TEXT DEFAULT NULL,
        month_hl_cross TEXT DEFAULT NULL,
        year_high TEXT DEFAULT NULL,
        year_low TEXT DEFAULT NULL,
        year_hl_cross TEXT DEFAULT NULL,
        marketcap TEXT DEFAULT NULL,
        eps TEXT DEFAULT NULL
      );
    `;
    db.run(createTableQuery);

    // Insert data into SQLite
    const insertQuery = `
      INSERT INTO stocks (
        symbol, logo, view_chart, website_link, stock_name, industry, sector, exchange,
        close_yest, price_open, price, low, high, chg_rs, chg_percentage, volume,
        avg_volume, volume_spike, month_high, month_low, month_hl_cross, year_high,
        year_low, year_hl_cross, marketcap, eps
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      );
    `;

    // Prepare and execute insertions
    const stmt = db.prepare(insertQuery);
    rows.slice(1).forEach((row) => {
      const rowData = headers.map((header, index) => {
        if (header === "price") {
          return parseFloat(row[index] || "0") || 0;
        }
        return row[index] || "0"; // Default to "0" if cell is empty
      });
      stmt.run(rowData);
    });
    stmt.finalize();

    console.log("Data saved to SQLite database successfully.");

    // Close the database connection
    db.close();
  } catch (error) {
    console.error("Error fetching or saving data:", error.message);
  }
}

// Call the function
getGoogleSheetsDataAndSaveToSQLite();

setInterval(async () => {
  const stockData = await getGoogleSheetsDataAndSaveToSQLite() ?? [];
  if (stockData.length > 0) {
    // console.log("Broadcasting stock data:", stockData);
    broadcastData(stockData);
  }
}, 5000);
