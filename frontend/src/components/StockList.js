import React, { useState, useEffect } from 'react';
import { stockService } from '../services/apiService';
import { Link } from 'react-router-dom';

const StockList = () => {
    const [stocks, setStocks] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        pageSize: 10
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStocks = async (page) => {
        try {
            setLoading(true);
            const data = await stockService.getStocks(page);
            setStocks(data.stocks);
            setPagination(data.pagination);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch stocks');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStocks(1);
    }, []);

    const handlePageChange = (newPage) => {
        fetchStocks(newPage);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Stock List</h1>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Symbol</th>
                        <th className="border p-2">Stock Name</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2">Change %</th>
                        <th className="border p-2">Exchange</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock) => (
                        <tr key={stock.id} className="hover:bg-gray-100">
                            <td className="border p-2">{stock.symbol}</td>
                            <td className="border p-2">{stock.stock_name}</td>
                            <td className="border p-2">{stock.price?.toFixed(2)}</td>
                            <td className="border p-2">
                                {stock.chg_percentage?.toFixed(2)}%
                            </td>
                            <td className="border p-2">{stock.exchange}</td>
                            <td className="border p-2">
                                <Link 
                                    to={`/stocks/${stock.symbol}`} 
                                    className="text-blue-500 hover:underline"
                                >
                                    Details
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-center mt-4">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`mx-1 px-3 py-1 border ${
                            page === pagination.currentPage 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white text-blue-500'
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StockList;