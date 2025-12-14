import { ReactNode } from 'react';
import Button from './Button';
import '../../styles/theme.css';

interface InsightBannerProps {
  status: 'success' | 'info' | 'warning' | 'danger';
  icon?: string;
  message: string;
  detail?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  metric?: {
    value: string | number;
    label: string;
  };
}

export default function InsightBanner({
  status,
  icon,
  message,
  detail,
  action,
  metric
}: InsightBannerProps) {
  const statusConfig = {
    success: {
      bg: 'var(--color-success-light)',
      border: 'var(--color-success)',
      text: 'var(--color-success-dark)',
      defaultIcon: '✓'
    },
    info: {
      bg: 'var(--color-info-light)',
      border: 'var(--color-info)',
      text: 'var(--color-info-dark)',
      defaultIcon: 'ℹ️'
    },
    warning: {
      bg: 'var(--color-warning-light)',
      border: 'var(--color-warning)',
      text: 'var(--color-warning-dark)',
      defaultIcon: '⚠️'
    },
    danger: {
      bg: 'var(--color-danger-light)',
      border: 'var(--color-danger)',
      text: 'var(--color-danger-dark)',
      defaultIcon: '🚨'
    }
  };

  const config = statusConfig[status];
  const displayIcon = icon || config.defaultIcon;

  return (
    <div style={{
      backgroundColor: config.bg,
      border: `2px solid ${config.border}`,
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-4) var(--space-6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      flexWrap: 'wrap',
      boxShadow: 'var(--shadow-sm)',
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        flex: 1
      }}>
        <div style={{
          fontSize: 'var(--text-2xl)',
          flexShrink: 0
        }}>
          {displayIcon}
        </div>
        
        <div style={{ flex: 1 }}>
          <p style={{
            margin: 0,
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-semibold)',
            color: config.text
          }}>
            {message}
          </p>
          {detail && (
            <p style={{
              margin: 0,
              marginTop: 'var(--space-1)',
              fontSize: 'var(--text-sm)',
              color: config.text,
              opacity: 0.8
            }}>
              {detail}
            </p>
          )}
        </div>
      </div>
      
      {(metric || action) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)'
        }}>
          {metric && (
            <div style={{
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: config.border
              }}>
                {metric.value}
              </div>
              <div style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-gray-600)',
                marginTop: 'var(--space-1)'
              }}>
                {metric.label}
              </div>
            </div>
          )}
          {action && (
            <Button
              variant="outline"
              size="sm"
              onClick={action.onClick}
              style={{
                borderColor: config.border,
                color: config.text
              }}
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
