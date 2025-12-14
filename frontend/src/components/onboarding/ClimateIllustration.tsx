import React from 'react';

/**
 * Climate Illustration - Sprout emerging from soil
 */
export default function ClimateIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: '280px', height: 'auto' }}
    >
      {/* Sun rays */}
      <g opacity="0.3">
        <line x1="100" y1="20" x2="100" y2="35" stroke="#FFB74D" strokeWidth="3" strokeLinecap="round" />
        <line x1="140" y1="30" x2="132" y2="42" stroke="#FFB74D" strokeWidth="3" strokeLinecap="round" />
        <line x1="165" y1="55" x2="153" y2="63" stroke="#FFB74D" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="30" x2="68" y2="42" stroke="#FFB74D" strokeWidth="3" strokeLinecap="round" />
        <line x1="35" y1="55" x2="47" y2="63" stroke="#FFB74D" strokeWidth="3" strokeLinecap="round" />
      </g>
      
      {/* Sun */}
      <circle cx="100" cy="45" r="18" fill="#FFC107" />
      <circle cx="100" cy="45" r="15" fill="#FFD54F" />
      
      {/* Soil mound */}
      <ellipse cx="100" cy="150" rx="70" ry="30" fill="#8D6E63" />
      <ellipse cx="100" cy="145" rx="68" ry="28" fill="#A1887F" />
      
      {/* Shadow under soil */}
      <ellipse cx="100" cy="180" rx="60" ry="6" fill="#000" opacity="0.08" />
      
      {/* Sprout stem */}
      <path
        d="M100 150 L100 85"
        stroke="#7CB342"
        strokeWidth="5"
        strokeLinecap="round"
      />
      
      {/* Left main leaf */}
      <ellipse
        cx="75"
        cy="100"
        rx="20"
        ry="12"
        fill="#8BC34A"
        transform="rotate(-25 75 100)"
      />
      <ellipse
        cx="75"
        cy="100"
        rx="18"
        ry="10"
        fill="#9CCC65"
        transform="rotate(-25 75 100)"
      />
      
      {/* Right main leaf */}
      <ellipse
        cx="125"
        cy="100"
        rx="20"
        ry="12"
        fill="#8BC34A"
        transform="rotate(25 125 100)"
      />
      <ellipse
        cx="125"
        cy="100"
        rx="18"
        ry="10"
        fill="#9CCC65"
        transform="rotate(25 125 100)"
      />
      
      {/* Top small leaves */}
      <ellipse
        cx="88"
        cy="78"
        rx="12"
        ry="8"
        fill="#AED581"
        transform="rotate(-35 88 78)"
      />
      <ellipse
        cx="112"
        cy="78"
        rx="12"
        ry="8"
        fill="#AED581"
        transform="rotate(35 112 78)"
      />
      
      {/* Leaf veins */}
      <line x1="75" y1="100" x2="80" y2="95" stroke="#7CB342" strokeWidth="1" opacity="0.4" />
      <line x1="75" y1="100" x2="80" y2="105" stroke="#7CB342" strokeWidth="1" opacity="0.4" />
      <line x1="125" y1="100" x2="120" y2="95" stroke="#7CB342" strokeWidth="1" opacity="0.4" />
      <line x1="125" y1="100" x2="120" y2="105" stroke="#7CB342" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}
