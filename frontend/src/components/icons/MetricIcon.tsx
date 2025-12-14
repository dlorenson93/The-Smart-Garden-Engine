import React from 'react';

interface MetricIconProps {
  icon: React.ReactNode;
  color: string;
  bgColor?: string;
}

/**
 * MetricIcon - Consistent wrapper for metric display icons
 * Provides badge background and proper alignment
 */
export default function MetricIcon({ icon, color, bgColor = 'rgba(255, 255, 255, 0.6)' }: MetricIconProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '2.5rem', // 40px
        marginBottom: '0.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '9999px',
          backgroundColor: bgColor,
          color: color,
        }}
      >
        {icon}
      </div>
    </div>
  );
}
