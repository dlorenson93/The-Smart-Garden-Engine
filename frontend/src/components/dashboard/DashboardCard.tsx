import { ReactNode } from 'react';

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  actions?: ReactNode;
  onClick?: () => void;
  children: ReactNode;
  glass?: boolean;
  className?: string;
}

export default function DashboardCard({
  title,
  subtitle,
  icon,
  actions,
  onClick,
  children,
  glass = false,
  className = ''
}: DashboardCardProps) {
  const baseStyles: React.CSSProperties = {
    borderRadius: '16px',
    padding: '1.5rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden'
  };

  const glassStyles: React.CSSProperties = glass ? {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
  } : {
    backgroundColor: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    border: '1px solid rgba(0, 0, 0, 0.05)'
  };

  const hoverStyles = onClick ? {
    transform: 'translateY(-4px)',
    boxShadow: glass 
      ? '0 12px 40px rgba(0, 0, 0, 0.15)' 
      : '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)'
  } : {};

  return (
    <div
      onClick={onClick}
      className={`dashboard-card ${className}`}
      style={{
        ...baseStyles,
        ...glassStyles
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          Object.assign(e.currentTarget.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = glassStyles.boxShadow as string;
        }
      }}
      onMouseDown={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseUp={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)';
        }
      }}
    >
      {(title || icon || actions) && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <div style={{ flex: 1 }}>
            {icon && (
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {icon}
              </div>
            )}
            {title && (
              <h3 style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: subtitle ? '0.25rem' : 0
              }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{
                margin: 0,
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div style={{ marginLeft: '1rem' }}>
              {actions}
            </div>
          )}
        </div>
      )}
      <div>
        {children}
      </div>
    </div>
  );
}
