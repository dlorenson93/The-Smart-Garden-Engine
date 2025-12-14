import React from 'react';

/**
 * Garden Bed Illustration - Wooden raised bed with plants
 */
export default function GardenBedIllustration() {
  return (
    <svg
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: '300px', height: 'auto' }}
    >
      {/* Sky background elements */}
      <circle cx="200" cy="40" r="20" fill="#E3F2FD" opacity="0.5" />
      <circle cx="50" cy="50" r="15" fill="#E3F2FD" opacity="0.5" />
      
      {/* Raised bed - front panel */}
      <rect x="30" y="110" width="180" height="50" rx="4" fill="#8D6E63" />
      <rect x="30" y="110" width="180" height="45" rx="4" fill="#A1887F" />
      
      {/* Raised bed - side panel (3D effect) */}
      <path d="M210 110 L230 120 L230 165 L210 160 Z" fill="#6D4C41" />
      
      {/* Raised bed - top edge */}
      <rect x="30" y="105" width="180" height="8" rx="2" fill="#BCAAA4" />
      <path d="M210 105 L230 112 L230 120 L210 113 Z" fill="#A1887F" />
      
      {/* Wood grain details */}
      <line x1="35" y1="120" x2="205" y2="120" stroke="#6D4C41" strokeWidth="1" opacity="0.3" />
      <line x1="35" y1="140" x2="205" y2="140" stroke="#6D4C41" strokeWidth="1" opacity="0.3" />
      
      {/* Soil */}
      <rect x="35" y="110" width="170" height="8" fill="#5D4037" />
      
      {/* Plants - Row 1 (Back) */}
      <g transform="translate(60, 95)">
        <ellipse cx="0" cy="10" rx="12" ry="8" fill="#66BB6A" />
        <ellipse cx="-5" cy="5" rx="10" ry="7" fill="#81C784" />
        <ellipse cx="5" cy="5" rx="10" ry="7" fill="#81C784" />
      </g>
      
      <g transform="translate(95, 95)">
        <ellipse cx="0" cy="10" rx="12" ry="8" fill="#66BB6A" />
        <ellipse cx="-5" cy="5" rx="10" ry="7" fill="#81C784" />
        <ellipse cx="5" cy="5" rx="10" ry="7" fill="#81C784" />
      </g>
      
      <g transform="translate(130, 95)">
        <ellipse cx="0" cy="10" rx="12" ry="8" fill="#66BB6A" />
        <ellipse cx="-5" cy="5" rx="10" ry="7" fill="#81C784" />
        <ellipse cx="5" cy="5" rx="10" ry="7" fill="#81C784" />
      </g>
      
      <g transform="translate(165, 95)">
        <ellipse cx="0" cy="10" rx="12" ry="8" fill="#66BB6A" />
        <ellipse cx="-5" cy="5" rx="10" ry="7" fill="#81C784" />
        <ellipse cx="5" cy="5" rx="10" ry="7" fill="#81C784" />
      </g>
      
      {/* Plants - Row 2 (Middle) */}
      <g transform="translate(75, 110)">
        <ellipse cx="0" cy="8" rx="14" ry="10" fill="#4CAF50" />
        <ellipse cx="-6" cy="3" rx="11" ry="8" fill="#66BB6A" />
        <ellipse cx="6" cy="3" rx="11" ry="8" fill="#66BB6A" />
      </g>
      
      <g transform="translate(115, 110)">
        <ellipse cx="0" cy="8" rx="14" ry="10" fill="#4CAF50" />
        <ellipse cx="-6" cy="3" rx="11" ry="8" fill="#66BB6A" />
        <ellipse cx="6" cy="3" rx="11" ry="8" fill="#66BB6A" />
      </g>
      
      <g transform="translate(155, 110)">
        <ellipse cx="0" cy="8" rx="14" ry="10" fill="#4CAF50" />
        <ellipse cx="-6" cy="3" rx="11" ry="8" fill="#66BB6A" />
        <ellipse cx="6" cy="3" rx="11" ry="8" fill="#66BB6A" />
      </g>
      
      {/* Plants - Row 3 (Front) */}
      <g transform="translate(55, 128)">
        <ellipse cx="0" cy="5" rx="15" ry="11" fill="#388E3C" />
        <ellipse cx="-7" cy="0" rx="12" ry="9" fill="#4CAF50" />
        <ellipse cx="7" cy="0" rx="12" ry="9" fill="#4CAF50" />
      </g>
      
      <g transform="translate(95, 128)">
        <ellipse cx="0" cy="5" rx="15" ry="11" fill="#388E3C" />
        <ellipse cx="-7" cy="0" rx="12" ry="9" fill="#4CAF50" />
        <ellipse cx="7" cy="0" rx="12" ry="9" fill="#4CAF50" />
      </g>
      
      <g transform="translate(135, 128)">
        <ellipse cx="0" cy="5" rx="15" ry="11" fill="#388E3C" />
        <ellipse cx="-7" cy="0" rx="12" ry="9" fill="#4CAF50" />
        <ellipse cx="7" cy="0" rx="12" ry="9" fill="#4CAF50" />
      </g>
      
      <g transform="translate(175, 128)">
        <ellipse cx="0" cy="5" rx="15" ry="11" fill="#388E3C" />
        <ellipse cx="-7" cy="0" rx="12" ry="9" fill="#4CAF50" />
        <ellipse cx="7" cy="0" rx="12" ry="9" fill="#4CAF50" />
      </g>
      
      {/* Shadow */}
      <ellipse cx="120" cy="170" rx="80" ry="8" fill="#000" opacity="0.08" />
    </svg>
  );
}
