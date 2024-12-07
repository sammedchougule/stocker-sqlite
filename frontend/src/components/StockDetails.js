import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Badge } from "./Badge";
import { Separator } from "./Separator";

export function StockDetails({ stock }) {
  const isPositiveChange = stock?.chg_rs >= 0;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{stock?.stock_name}</CardTitle>
            <p className="text-sm text-gray-500">{stock?.symbol}</p>
          </div>
          <Badge variant={isPositiveChange ? "success" : "destructive"} className="text-lg py-1 px-2">
            {isPositiveChange ? "▲" : "▼"}
            ₹{stock?.chg_rs?.toFixed(2)} ({stock?.chg_percentage?.toFixed(2)}%)
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Price</p>
              <p className="text-2xl font-bold">₹{stock?.price?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Industry</p>
              <p>{stock?.industry}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Sector</p>
              <p>{stock?.sector}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Exchange</p>
              <p>{stock?.exchange}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Volume</p>
              <p>{stock?.volume.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Volume</p>
              <p>{stock?.avg_volume.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Market Cap</p>
              <p>₹{(stock?.marketcap / 1e9)?.toFixed(2)}B</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">EPS</p>
              <p>₹{stock?.eps?.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">52 Week Range</p>
          <div className="flex items-center space-x-2">
            <span>₹{stock?.year_low?.toFixed(2)}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{
                  width: `${((stock?.price - stock?.year_low) / (stock?.year_high - stock?.year_low)) * 100}%`
                }}
              />
            </div>
            <span>₹{stock?.year_high?.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-6 flex space-x-4">
          <a 
            href={stock?.website_link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2"
          >
            Visit Website
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <a 
            href={stock?.view_chart} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 px-4 py-2"
          >
            View Chart
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default StockDetails;

