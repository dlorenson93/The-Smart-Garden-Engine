import { ReactNode } from 'react';
import Button from './Button';
import '../../styles/theme.css';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  exampleHint?: string;
}

export default function EmptyState({
  icon = '🌱',
  title,
  description,
  primaryAction,
  secondaryAction,
  exampleHint
}: EmptyStateProps) {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-12) var(--space-6)',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <div style={{
        fontSize: '4rem',
        marginBottom: 'var(--space-4)',
        opacity: 0.8
      }}>
        {icon}
      </div>
      
      <h3 className="h3" style={{
        margin: 0,
        marginBottom: 'var(--space-2)',
        color: 'var(--color-gray-900)'
      }}>
        {title}
      </h3>
      
      <p className="body" style={{
        margin: 0,
        marginBottom: 'var(--space-6)',
        color: 'var(--color-gray-600)'
      }}>
        {description}
      </p>
      
      {(primaryAction || secondaryAction) && (
        <div style={{
          display: 'flex',
          gap: 'var(--space-3)',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {primaryAction && (
            <Button
              variant="primary"
              size="lg"
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              size="lg"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
      
      {exampleHint && (
        <p className="muted" style={{
          marginTop: 'var(--space-4)',
          fontSize: 'var(--text-xs)',
          fontStyle: 'italic'
        }}>
          💡 {exampleHint}
        </p>
      )}
    </div>
  );
}
