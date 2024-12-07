import React from 'react';

export function Badge({ variant, className, children }) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  const variantClasses = {
    success: "bg-green-100 text-green-800",
    destructive: "bg-red-100 text-red-800",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
