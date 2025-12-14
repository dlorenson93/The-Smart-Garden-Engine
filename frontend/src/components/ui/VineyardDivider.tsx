import '../../styles/theme.css';

interface VineyardDividerProps {
  style?: 'subtle' | 'terrace' | 'vine' | 'image';
}

export default function VineyardDivider({ style = 'subtle' }: VineyardDividerProps) {
  if (style === 'subtle') {
    return (
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, transparent 0%, var(--color-gray-200) 50%, transparent 100%)',
        margin: 'var(--space-8) 0',
        opacity: 0.5
      }} />
    );
  }

  if (style === 'terrace') {
    return (
      <div style={{
        height: '24px',
        position: 'relative',
        margin: 'var(--space-8) 0',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 60px,
              var(--color-gray-200) 60px,
              var(--color-gray-200) 62px,
              transparent 62px,
              transparent 100px
            ),
            linear-gradient(
              180deg,
              transparent 0%,
              var(--color-gray-100) 50%,
              transparent 100%
            )
          `,
          opacity: 0.3
        }} />
      </div>
    );
  }

  if (style === 'vine') {
    return (
      <div style={{
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'var(--space-8) 0',
        position: 'relative',
        backgroundImage: 'url(/images/vineyard.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.95) 100%)',
        }} />
        <div style={{
          position: 'relative',
          fontSize: 'var(--text-lg)',
          backgroundColor: 'transparent',
          padding: '0 var(--space-4)',
          opacity: 0.6
        }}>
          🍃
        </div>
      </div>
    );
  }

  return null;
}
