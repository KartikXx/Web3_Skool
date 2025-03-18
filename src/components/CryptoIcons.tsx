
import React from 'react';

export const BitcoinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path 
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
      fill="#F7931A" 
    />
    <path 
      d="M15.14 10.7C15.39 9.16 14.25 8.46 12.67 8.01L13.14 6.06L11.93 5.77L11.47 7.67C11.17 7.59 10.86 7.52 10.55 7.45L11.01 5.53L9.8 5.24L9.33 7.19C9.07 7.13 8.82 7.07 8.58 7.01L8.59 7L6.91 6.60L6.6 7.9C6.6 7.9 7.5 8.1 7.48 8.11C7.93 8.22 8.01 8.52 8 8.75L7.46 10.96C7.49 10.97 7.54 10.98 7.59 11C7.55 10.99 7.5 10.98 7.46 10.96L6.7 14.03C6.65 14.16 6.5 14.35 6.2 14.28C6.21 14.3 5.32 14.07 5.32 14.07L4.75 15.47L6.34 15.85C6.62 15.92 6.89 16 7.16 16.07L6.69 18.04L7.9 18.33L8.37 16.37C8.68 16.45 8.98 16.53 9.27 16.61L8.8 18.55L10.01 18.84L10.48 16.88C12.55 17.24 14.1 17.1 14.78 15.23C15.33 13.7 14.77 12.83 13.71 12.27C14.5 12.07 15.09 11.54 15.14 10.7ZM12.39 14.36C12 15.89 9.62 15.11 8.86 14.93L9.5 12.31C10.26 12.49 12.8 12.76 12.39 14.36ZM12.77 10.68C12.42 12.06 10.44 11.39 9.81 11.24L10.4 8.86C11.03 9.01 13.14 9.24 12.77 10.68Z" 
      fill="white" 
    />
  </svg>
);

export const EthereumIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path 
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
      fill="#627EEA" 
    />
    <path 
      d="M12.3735 3V9.6525L17.9963 12.165L12.3735 3Z" 
      fill="white" 
      fillOpacity="0.602" 
    />
    <path 
      d="M12.3735 3L6.75 12.165L12.3735 9.6525V3Z" 
      fill="white" 
    />
    <path 
      d="M12.3735 16.764V20.9978L18 13.212L12.3735 16.764Z" 
      fill="white" 
      fillOpacity="0.602" 
    />
    <path 
      d="M12.3735 20.9978V16.7633L6.75 13.212L12.3735 20.9978Z" 
      fill="white" 
    />
    <path 
      d="M12.3735 15.7095L17.9963 12.1575L12.3735 9.6543V15.7095Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
    <path 
      d="M6.75 12.1575L12.3735 15.7095V9.6543L6.75 12.1575Z" 
      fill="white" 
      fillOpacity="0.602" 
    />
  </svg>
);

export const TrendingUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

export const TrendingDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);
