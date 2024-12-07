import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import StockList from './components/StockList';
import StockDetail from './components/StockDetail';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-blue-600 text-white p-4">
                    <div className="container mx-auto flex justify-between items-center">
                        <Link to="/" className="text-2xl font-bold">
                            Stock Viewer
                        </Link>
                        <div>
                            <Link to="/" className="mr-4 hover:text-blue-200">
                                Home
                            </Link>
                        </div>
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={<StockList />} />
                    <Route path="/stocks/:symbol" element={<StockDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;