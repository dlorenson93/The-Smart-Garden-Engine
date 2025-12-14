import React from 'react';

interface SoilHealthScoreProps {
  score: number; // 0-100
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export default function SoilHealthScore({ score, size = 'medium', showLabel = true }: SoilHealthScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22C55E'; // green
    if (score >= 60) return '#FFB74D'; // orange
    if (score >= 40) return '#FF9800'; // darker orange
    return '#EF5350'; // red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  const sizes = {
    small: { container: 60, stroke: 4, fontSize: '0.875rem', labelSize: '0.75rem' },
    medium: { container: 90, stroke: 6, fontSize: '1.25rem', labelSize: '0.875rem' },
    large: { container: 120, stroke: 8, fontSize: '1.75rem', labelSize: '1rem' },
  };

  const { container, stroke, fontSize, labelSize } = sizes[size];
  const radius = (container - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <svg width={container} height={container} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={container / 2}
          cy={container / 2}
          r={radius}
          fill="none"
          stroke="#E0E0E0"
          strokeWidth={stroke}
        />
        
        {/* Progress circle */}
        <circle
          cx={container / 2}
          cy={container / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        
        {/* Score text */}
        <text
          x={container / 2}
          y={container / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#333"
          fontSize={fontSize}
          fontWeight="700"
          style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
        >
          {score}
        </text>
      </svg>
      
      {showLabel && (
        <div
          style={{
            fontSize: labelSize,
            fontWeight: 600,
            color,
            textAlign: 'center',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
