import React from 'react';

interface GreenhouseIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Greenhouse Icon - Represents protected growing spaces
 * Outline style for metric display
 */
export default function GreenhouseIcon({ size = 32, className = '', style }: GreenhouseIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`greenhouse-icon ${className}`}
      style={style}
      role="img"
      aria-label="Greenhouse icon"
    >
      {/* Greenhouse frame/structure */}
      {/* Left wall */}
      <path
        d="M6 26V14L16 6L26 14V26"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Roof peak */}
      <path
        d="M16 6V14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      
      {/* Glass panels (horizontal) */}
      <line
        x1="8"
        y1="18"
        x2="24"
        y2="18"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.3"
      />
      <line
        x1="10"
        y1="22"
        x2="22"
        y2="22"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.3"
      />
      
      {/* Base/floor */}
      <path
        d="M4 26H28"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      
      {/* Plant inside greenhouse */}
      <path
        d="M16 26V22M14 24C14 23 14.5 22 16 22C17.5 22 18 23 18 24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      
      {/* Small leaves */}
      <circle
        cx="14"
        cy="23"
        r="1"
        fill="currentColor"
        opacity="0.4"
      />
      <circle
        cx="18"
        cy="23"
        r="1"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  );
}
