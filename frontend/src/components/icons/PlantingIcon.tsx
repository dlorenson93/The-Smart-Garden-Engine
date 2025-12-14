import React from 'react';

interface PlantingIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Planting Icon - Outline style for metric display
 * Represents active plantings/seedlings
 */
export default function PlantingIcon({ size = 32, className = '', style }: PlantingIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`planting-icon ${className}`}
      style={style}
      role="img"
      aria-label="Planting icon"
    >
      {/* Soil line */}
      <ellipse
        cx="16"
        cy="25"
        rx="8"
        ry="2"
        stroke="currentColor"
        strokeWidth="1.75"
        opacity="0.4"
      />
      
      {/* Stem */}
      <path
        d="M16 25V10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      
      {/* Left leaf */}
      <path
        d="M16 18C16 18 12 16 10 14C8 12 8 10 10 10C12 10 14 12 16 14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Right leaf */}
      <path
        d="M16 18C16 18 20 16 22 14C24 12 24 10 22 10C20 10 18 12 16 14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Top sprout */}
      <circle
        cx="16"
        cy="7"
        r="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}
