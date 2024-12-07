import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import StockDetails from './components/StockDetails';

function App() {
    const [selectedStock, setSelectedStock] = useState(null);
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Stock Search</h1>
        <SearchBar onSelectStock={setSelectedStock} />
        {selectedStock && <StockDetails symbol={selectedStock} />}
      </div>
    );
  }

export default App;