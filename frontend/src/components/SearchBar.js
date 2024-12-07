import React, { useState, useEffect } from 'react';

function SearchBar({ onSelectStock }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query.length >= 1) {
      fetch(`http://localhost:8000/api/search?q=${query}`)
        .then(response => response.json())
        .then(data => setSuggestions(data))
        .catch(error => console.error('Error fetching suggestions:', error));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSelect = (symbol) => {
    onSelectStock(symbol);
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a stock..."
        className="w-full p-2 border rounded"
      />
      {suggestions.length > 0 && (
        <ul className="mt-2 border rounded">
          {suggestions.map((stock) => (
            <li
              key={stock.symbol}
              onClick={() => handleSelect(stock.symbol)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {stock.symbol} - {stock.stock_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;

