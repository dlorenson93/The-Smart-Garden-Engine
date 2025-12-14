import React from 'react';

/**
 * Welcome Illustration - Cute Earth character with sprout
 */
export default function WelcomeIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: '280px', height: 'auto' }}
    >
      {/* Earth body - main circle */}
      <circle cx="100" cy="110" r="60" fill="#7DD3C0" />
      
      {/* Continents - simplified green shapes */}
      <path
        d="M80 90C80 90 85 85 90 90C95 95 100 90 105 95C110 100 115 95 118 100C121 105 118 110 115 115"
        fill="#4CAF50"
        opacity="0.8"
      />
      <path
        d="M75 125C75 125 78 120 83 122C88 124 92 120 97 123C102 126 100 130 95 132"
        fill="#4CAF50"
        opacity="0.8"
      />
      <ellipse cx="110" cy="120" rx="12" ry="8" fill="#4CAF50" opacity="0.8" />
      
      {/* Shadow under earth */}
      <ellipse cx="100" cy="175" rx="50" ry="8" fill="#000" opacity="0.08" />
      
      {/* Cute face */}
      <circle cx="85" cy="105" r="4" fill="#333" />
      <circle cx="115" cy="105" r="4" fill="#333" />
      
      {/* Smile */}
      <path
        d="M85 120 Q100 130 115 120"
        stroke="#333"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Rosy cheeks */}
      <circle cx="75" cy="115" r="5" fill="#FF9999" opacity="0.5" />
      <circle cx="125" cy="115" r="5" fill="#FF9999" opacity="0.5" />
      
      {/* Sprout growing from top */}
      <g transform="translate(100, 50)">
        {/* Stem */}
        <rect x="-2" y="0" width="4" height="25" rx="2" fill="#8BC34A" />
        
        {/* Left leaf */}
        <ellipse
          cx="-8"
          cy="12"
          rx="8"
          ry="5"
          fill="#4CAF50"
          transform="rotate(-30 -8 12)"
        />
        
        {/* Right leaf */}
        <ellipse
          cx="8"
          cy="12"
          rx="8"
          ry="5"
          fill="#4CAF50"
          transform="rotate(30 8 12)"
        />
        
        {/* Top leaves */}
        <ellipse
          cx="-5"
          cy="5"
          rx="6"
          ry="4"
          fill="#66BB6A"
          transform="rotate(-40 -5 5)"
        />
        <ellipse
          cx="5"
          cy="5"
          rx="6"
          ry="4"
          fill="#66BB6A"
          transform="rotate(40 5 5)"
        />
      </g>
      
      {/* Sparkles around Earth */}
      <g opacity="0.6">
        <circle cx="45" cy="80" r="2" fill="#FFD700" />
        <circle cx="155" cy="85" r="3" fill="#FFD700" />
        <circle cx="50" cy="140" r="2" fill="#FFD700" />
        <circle cx="150" cy="135" r="2.5" fill="#FFD700" />
      </g>
    </svg>
  );
}
