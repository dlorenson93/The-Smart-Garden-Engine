import { ReactNode } from 'react';
import '../../styles/theme.css';

interface PillTab {
  id: string;
  label: string;
  count?: number;
  icon?: string;
}

interface PillTabsProps {
  tabs: PillTab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export default function PillTabs({ tabs, activeTab, onChange }: PillTabsProps) {
  return (
    <div style={{
      display: 'flex',
      gap: 'var(--space-2)',
      flexWrap: 'wrap',
      padding: 'var(--space-1)',
      backgroundColor: 'var(--color-gray-100)',
      borderRadius: 'var(--radius-lg)',
      width: 'fit-content'
    }}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: isActive ? 'var(--color-white)' : 'transparent',
              color: isActive ? 'var(--color-primary)' : 'var(--color-gray-600)',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-base)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              minHeight: '36px',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)')}
            onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span style={{
                padding: '0.125rem 0.5rem',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-bold)',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isActive ? 'var(--color-primary-light)' : 'var(--color-gray-200)',
                color: isActive ? 'var(--color-primary-dark)' : 'var(--color-gray-600)'
              }}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
