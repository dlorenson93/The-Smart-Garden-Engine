import { ReactNode } from 'react';

interface DashboardGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3;
  compact?: boolean;
}

export default function DashboardGrid({ children, columns = 2, compact = false }: DashboardGridProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: columns === 1 ? '1fr' : columns === 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
      gap: compact ? '1rem' : '1.5rem',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: compact ? '1rem' : '2rem 1rem'
    }}
    className="dashboard-grid">
      {children}
    </div>
  );
}
