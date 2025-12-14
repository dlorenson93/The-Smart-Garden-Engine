import { featureFlags } from '../config/features';

export default function AIBadge({ text = 'AI-Enhanced' }: { text?: string }) {
  if (!featureFlags.showAIBadges) return null;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.25rem 0.5rem',
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: 'bold'
    }}>
      <span>✨</span>
      {text}
    </span>
  );
}
