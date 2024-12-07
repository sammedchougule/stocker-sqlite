import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const stockService = {
    // Fetch stocks with pagination
    getStocks: async (page = 1, limit = 10, search = '') => {
        try {
            const response = await axios.get(`${API_BASE_URL}/stocks`, {
                params: { page, limit, search }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching stocks:', error);
            throw error;
        }
    },

    // Fetch a single stock by symbol
    getStockBySymbol: async (symbol) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/stocks/${symbol}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching stock details:', error);
            throw error;
        }
    },

    // Add a new stock entry
    addStock: async (stockData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/stocks`, stockData);
            return response.data;
        } catch (error) {
            console.error('Error adding stock:', error);
            throw error;
        }
    }
};