import { ReactNode } from 'react';
import '../../styles/theme.css';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  actions,
  breadcrumb
}: PageHeaderProps) {
  return (
    <div style={{
      marginBottom: 'var(--space-8)',
      paddingBottom: 'var(--space-6)',
      borderBottom: '1px solid var(--border-color)'
    }}>
      {breadcrumb && (
        <div style={{ marginBottom: 'var(--space-3)' }}>
          {breadcrumb}
        </div>
      )}
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 'var(--space-6)',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h1 className="h1" style={{ margin: 0, marginBottom: description ? 'var(--space-2)' : 0 }}>
            {title}
          </h1>
          {description && (
            <p className="muted" style={{
              margin: 0,
              fontSize: 'var(--text-lg)',
              maxWidth: '600px'
            }}>
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div style={{
            display: 'flex',
            gap: 'var(--space-3)',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
