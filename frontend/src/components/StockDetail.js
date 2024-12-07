import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { stockService } from '../services/apiService';

const StockDetail = () => {
    const { symbol } = useParams();
    const [stock, setStock] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStockDetail = async () => {
            try {
                const data = await stockService.getStockBySymbol(symbol);
                setStock(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch stock details');
                setLoading(false);
            }
        };

        fetchStockDetail();
    }, [symbol]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!stock) return <div>No stock found</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{stock.stock_name} ({stock.symbol})</h1>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white shadow rounded p-4">
                    <h2 className="text-xl font-semibold mb-2">Stock Information</h2>
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="font-medium">Exchange:</td>
                                <td>{stock.exchange}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">Current Price:</td>
                                <td>${stock.price?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">Change:</td>
                                <td>
                                    {stock.chg_rs?.toFixed(2)} 
                                    ({stock.chg_percentage?.toFixed(2)}%)
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-white shadow rounded p-4">
                    <h2 className="text-xl font-semibold mb-2">Market Data</h2>
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="font-medium">Market Cap:</td>
                                <td>${stock.marketcap?.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">Volume:</td>
                                <td>{stock.volume?.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">EPS:</td>
                                <td>${stock.eps?.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 bg-white shadow rounded p-4">
                <h2 className="text-xl font-semibold mb-2">Performance</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-medium">Month Range</h3>
                        <p>High: ${stock.month_high?.toFixed(2)}</p>
                        <p>Low: ${stock.month_low?.toFixed(2)}</p>
                    </div>
                    <div>
                        <h3 className="font-medium">Year Range</h3>
                        <p>High: ${stock.year_high?.toFixed(2)}</p>
                        <p>Low: ${stock.year_low?.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockDetail;