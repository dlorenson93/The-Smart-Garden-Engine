import React from 'react';

interface ContainerIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Container Icon - Represents pots, planters, and containers
 * Outline style for metric display
 */
export default function ContainerIcon({ size = 32, className = '', style }: ContainerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`container-icon ${className}`}
      style={style}
      role="img"
      aria-label="Container icon"
    >
      {/* Plant pot/container body */}
      <path
        d="M8 12L10 26C10.2 27.2 11 28 12 28H20C21 28 21.8 27.2 22 26L24 12H8Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Container rim/top */}
      <path
        d="M6 12C6 11.4 6.4 11 7 11H25C25.6 11 26 11.4 26 12C26 12.6 25.6 13 25 13H7C6.4 13 6 12.6 6 12Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M6 12H26"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      
      {/* Plant/sprout growing from container */}
      <path
        d="M16 11V6M16 6C14 6 13 7.5 13 9M16 6C18 6 19 7.5 19 9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Leaves */}
      <path
        d="M14 8C13 8 12 7 12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M18 8C19 8 20 7 20 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
