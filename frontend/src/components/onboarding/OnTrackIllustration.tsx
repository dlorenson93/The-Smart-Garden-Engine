import React from 'react';

/**
 * On Track Illustration - Garden bed with checkmark sign
 */
export default function OnTrackIllustration() {
  return (
    <svg
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: '300px', height: 'auto' }}
    >
      {/* Raised bed - front panel */}
      <rect x="30" y="110" width="180" height="50" rx="4" fill="#6D4C41" />
      <rect x="30" y="110" width="180" height="45" rx="4" fill="#8D6E63" />
      
      {/* Raised bed - side panel (3D effect) */}
      <path d="M210 110 L230 120 L230 165 L210 160 Z" fill="#5D4037" />
      
      {/* Raised bed - top edge */}
      <rect x="30" y="105" width="180" height="8" rx="2" fill="#A1887F" />
      <path d="M210 105 L230 112 L230 120 L210 113 Z" fill="#8D6E63" />
      
      {/* Wood grain details */}
      <line x1="35" y1="120" x2="205" y2="120" stroke="#5D4037" strokeWidth="1" opacity="0.3" />
      <line x1="35" y1="140" x2="205" y2="140" stroke="#5D4037" strokeWidth="1" opacity="0.3" />
      
      {/* Soil */}
      <rect x="35" y="110" width="170" height="8" fill="#4E342E" />
      
      {/* Healthy full plants - Row 1 */}
      <g transform="translate(60, 92)">
        <ellipse cx="0" cy="12" rx="15" ry="10" fill="#2E7D32" />
        <ellipse cx="-6" cy="6" rx="12" ry="9" fill="#388E3C" />
        <ellipse cx="6" cy="6" rx="12" ry="9" fill="#388E3C" />
        <ellipse cx="0" cy="3" rx="10" ry="7" fill="#43A047" />
      </g>
      
      <g transform="translate(95, 92)">
        <ellipse cx="0" cy="12" rx="15" ry="10" fill="#2E7D32" />
        <ellipse cx="-6" cy="6" rx="12" ry="9" fill="#388E3C" />
        <ellipse cx="6" cy="6" rx="12" ry="9" fill="#388E3C" />
        <ellipse cx="0" cy="3" rx="10" ry="7" fill="#43A047" />
      </g>
      
      <g transform="translate(130, 92)">
        <ellipse cx="0" cy="12" rx="15" ry="10" fill="#2E7D32" />
        <ellipse cx="-6" cy="6" rx="12" ry="9" fill="#388E3C" />
        <ellipse cx="6" cy="6" rx="12" ry="9" fill="#388E3C" />
        <ellipse cx="0" cy="3" rx="10" ry="7" fill="#43A047" />
      </g>
      
      <g transform="translate(165, 92)">
        <ellipse cx="0" cy="12" rx="15" ry="10" fill="#2E7D32" />
        <ellipse cx="-6" cy="6" rx="12" ry="9" fill="#388E3C" />
        <ellipse cx="6" cy="6" rx="12" ry="9" fill="#388E3C" />
        <ellipse cx="0" cy="3" rx="10" ry="7" fill="#43A047" />
      </g>
      
      {/* Healthy full plants - Row 2 */}
      <g transform="translate(75, 108)">
        <ellipse cx="0" cy="10" rx="16" ry="12" fill="#1B5E20" />
        <ellipse cx="-7" cy="4" rx="13" ry="10" fill="#2E7D32" />
        <ellipse cx="7" cy="4" rx="13" ry="10" fill="#2E7D32" />
        <ellipse cx="0" cy="0" rx="11" ry="8" fill="#388E3C" />
      </g>
      
      <g transform="translate(115, 108)">
        <ellipse cx="0" cy="10" rx="16" ry="12" fill="#1B5E20" />
        <ellipse cx="-7" cy="4" rx="13" ry="10" fill="#2E7D32" />
        <ellipse cx="7" cy="4" rx="13" ry="10" fill="#2E7D32" />
        <ellipse cx="0" cy="0" rx="11" ry="8" fill="#388E3C" />
      </g>
      
      <g transform="translate(155, 108)">
        <ellipse cx="0" cy="10" rx="16" ry="12" fill="#1B5E20" />
        <ellipse cx="-7" cy="4" rx="13" ry="10" fill="#2E7D32" />
        <ellipse cx="7" cy="4" rx="13" ry="10" fill="#2E7D32" />
        <ellipse cx="0" cy="0" rx="11" ry="8" fill="#388E3C" />
      </g>
      
      {/* Healthy full plants - Row 3 */}
      <g transform="translate(55, 125)">
        <ellipse cx="0" cy="8" rx="17" ry="13" fill="#1B5E20" />
        <ellipse cx="-8" cy="2" rx="14" ry="11" fill="#2E7D32" />
        <ellipse cx="8" cy="2" rx="14" ry="11" fill="#2E7D32" />
        <ellipse cx="0" cy="-2" rx="12" ry="9" fill="#388E3C" />
      </g>
      
      <g transform="translate(95, 125)">
        <ellipse cx="0" cy="8" rx="17" ry="13" fill="#1B5E20" />
        <ellipse cx="-8" cy="2" rx="14" ry="11" fill="#2E7D32" />
        <ellipse cx="8" cy="2" rx="14" ry="11" fill="#2E7D32" />
        <ellipse cx="0" cy="-2" rx="12" ry="9" fill="#388E3C" />
      </g>
      
      {/* "On Track" Sign - wooden stake with checkmark */}
      <g transform="translate(170, 95)">
        {/* Stake */}
        <rect x="-2" y="20" width="4" height="35" fill="#6D4C41" rx="1" />
        
        {/* Sign background */}
        <rect x="-18" y="0" width="36" height="28" rx="3" fill="#FFF8E1" />
        <rect x="-18" y="0" width="36" height="28" rx="3" fill="none" stroke="#8D6E63" strokeWidth="1.5" />
        
        {/* Checkmark */}
        <path
          d="M-8 12 L-3 17 L8 6"
          stroke="#4CAF50"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
      
      {/* Shadow */}
      <ellipse cx="120" cy="170" rx="80" ry="8" fill="#000" opacity="0.08" />
    </svg>
  );
}
