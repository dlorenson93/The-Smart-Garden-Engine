import React from 'react';

interface BedIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Bed Icon - Outline style for metric display
 * Represents raised beds or planting rows
 */
export default function BedIcon({ size = 32, className = '', style }: BedIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`bed-icon ${className}`}
      style={style}
      role="img"
      aria-label="Bed icon"
    >
      {/* Raised bed container */}
      <rect
        x="4"
        y="10"
        width="24"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Soil rows */}
      <line
        x1="8"
        y1="14"
        x2="24"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.4"
      />
      <line
        x1="8"
        y1="18"
        x2="24"
        y2="18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.4"
      />
      <line
        x1="8"
        y1="22"
        x2="24"
        y2="22"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.4"
      />
      
      {/* Sprout indicators */}
      <circle cx="10" cy="15" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="16" cy="19" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="22" cy="15" r="1" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
