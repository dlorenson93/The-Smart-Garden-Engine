import { ReactNode, CSSProperties } from 'react';
import '../../styles/theme.css';

interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'soft' | 'gradient' | 'glass';
  footer?: ReactNode;
  style?: CSSProperties;
}

export default function Card({
  title,
  subtitle,
  actions,
  children,
  className = '',
  onClick,
  variant = 'default',
  footer,
  style
}: CardProps) {
  const baseStyles: CSSProperties = {
    borderRadius: 'var(--radius-xl)',
    padding: 'var(--space-6)',
    transition: 'all var(--transition-base)',
    border: '1px solid var(--border-color)',
    ...style
  };

  const variantStyles: Record<string, CSSProperties> = {
    default: {
      backgroundColor: 'var(--color-white)',
      boxShadow: 'var(--shadow-sm)',
    },
    soft: {
      backgroundColor: 'var(--color-gray-50)',
      border: 'none',
    },
    gradient: {
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
      border: '1px solid rgba(16, 185, 129, 0.1)',
    },
    glass: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: 'var(--shadow-lg)',
    }
  };

  const hoverStyles: CSSProperties = onClick ? {
    cursor: 'pointer',
    transform: 'translateY(-2px)',
    boxShadow: 'var(--shadow-lg)',
  } : {};

  const activeStyles: CSSProperties = onClick ? {
    transform: 'translateY(0px)',
    boxShadow: 'var(--shadow-md)',
  } : {};

  return (
    <div
      className={`card ${className}`}
      onClick={onClick}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
      }}
      onMouseEnter={(e) => onClick && Object.assign(e.currentTarget.style, hoverStyles)}
      onMouseLeave={(e) => onClick && Object.assign(e.currentTarget.style, {
        transform: 'translateY(0)',
        boxShadow: variantStyles[variant].boxShadow || 'var(--shadow-sm)',
      })}
      onMouseDown={(e) => onClick && Object.assign(e.currentTarget.style, activeStyles)}
      onMouseUp={(e) => onClick && Object.assign(e.currentTarget.style, hoverStyles)}
    >
      {(title || subtitle || actions) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--space-4)',
          gap: 'var(--space-4)'
        }}>
          <div style={{ flex: 1 }}>
            {title && (
              <h3 style={{
                margin: 0,
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--color-gray-900)',
                marginBottom: subtitle ? 'var(--space-1)' : 0
              }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="muted" style={{ margin: 0 }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div style={{ flexShrink: 0 }}>
              {actions}
            </div>
          )}
        </div>
      )}
      
      <div>
        {children}
      </div>
      
      {footer && (
        <div style={{
          marginTop: 'var(--space-4)',
          paddingTop: 'var(--space-4)',
          borderTop: '1px solid var(--border-color)'
        }}>
          {footer}
        </div>
      )}
    </div>
  );
}
