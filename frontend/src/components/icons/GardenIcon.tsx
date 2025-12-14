import React from 'react';

interface GardenIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Garden Icon - Outline style for metric display
 * Represents a garden area/property
 */
export default function GardenIcon({ size = 32, className = '', style }: GardenIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`garden-icon ${className}`}
      style={style}
      role="img"
      aria-label="Garden icon"
    >
      {/* House outline */}
      <path
        d="M16 4L6 12V26C6 27.1046 6.89543 28 8 28H24C25.1046 28 26 27.1046 26 26V12L16 4Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Roof line */}
      <path
        d="M16 4L26 12H6L16 4Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Door */}
      <rect
        x="13"
        y="19"
        width="6"
        height="9"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      
      {/* Windows */}
      <circle
        cx="11"
        cy="15"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle
        cx="21"
        cy="15"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}
