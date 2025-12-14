import { ReactNode, CSSProperties } from 'react';
import '../../styles/theme.css';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  backgroundImage?: string;
  height?: {
    desktop: string;
    mobile: string;
  };
  gradientColors?: {
    from: string;
    to: string;
  };
  className?: string;
  style?: CSSProperties;
}

/**
 * PageHero - Premium hero section with subtle background image
 * 
 * Features:
 * - Layered background with image, gradient overlay, and smooth fade
 * - Responsive height (desktop/mobile)
 * - WCAG-compliant text contrast
 * - Smooth transition into content below
 */
export default function PageHero({
  title,
  subtitle,
  actions,
  backgroundImage = '/images/vineyard.png',
  height = { desktop: '200px', mobile: '160px' },
  gradientColors = {
    from: 'rgba(40, 120, 90, 0.70)',
    to: 'rgba(80, 60, 140, 0.65)'
  },
  className = '',
  style
}: PageHeroProps) {
  return (
    <div
      className={`page-hero ${className}`}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        marginBottom: 'var(--space-6)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        height: height.desktop,
        ...style
      }}
    >
      {/* Layer 1: Background Image (Subtle Texture) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.2,
        filter: 'blur(2px)',
        transform: 'scale(1.05)',
      }} />

      {/* Layer 2: Brand Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(135deg, ${gradientColors.from} 0%, ${gradientColors.to} 100%)`,
      }} />

      {/* Layer 3: Smooth Bottom Fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40px',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.8) 100%)',
      }} />

      {/* Layer 4: Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-6)',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 'var(--font-bold)',
            color: 'white',
            marginBottom: subtitle ? 'var(--space-1)' : 0,
            textShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              margin: 0,
              fontSize: 'var(--text-base)',
              color: 'rgba(255,255,255,0.95)',
              textShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div style={{
            display: 'flex',
            gap: 'var(--space-3)',
            flexWrap: 'wrap'
          }}>
            {actions}
          </div>
        )}
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 640px) {
          .page-hero {
            height: ${height.mobile} !important;
          }
          .page-hero h1 {
            font-size: 1.5rem !important;
          }
          .page-hero p {
            font-size: 0.875rem !important;
          }
        }
      `}</style>
    </div>
  );
}
