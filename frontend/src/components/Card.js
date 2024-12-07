import React from 'react';

export function Card({ className, children }) {
  return (
    <div className={`bg-white shadow-md rounded-lg ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return <div className="px-6 py-4 border-b border-gray-200">{children}</div>;
}

export function CardContent({ children }) {
  return <div className="px-6 py-4">{children}</div>;
}

export function CardTitle({ children }) {
  return <h2 className="text-2xl font-bold">{children}</h2>;
}
