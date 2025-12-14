import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';

export default function CommunityCard() {
  const navigate = useNavigate();

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: 'var(--space-6)'
    }}>
      <div style={{
        fontSize: '2.5rem',
        marginBottom: 'var(--space-4)',
        textAlign: 'center'
      }}>
        🌎
      </div>
      
      <h3 style={{
        margin: '0 0 var(--space-3) 0',
        fontSize: '1.25rem',
        color: 'var(--color-text)',
        textAlign: 'center'
      }}>
        Community
      </h3>
      
      <p style={{
        margin: '0 0 var(--space-5) 0',
        color: 'var(--color-text-secondary)',
        fontSize: '0.95rem',
        lineHeight: '1.6',
        textAlign: 'center',
        flex: 1
      }}>
        Connect with growers, share updates, and learn together.
      </p>
      
      <Button
        variant="outline"
        size="md"
        fullWidth
        onClick={() => navigate('/community')}
        style={{
          borderColor: 'var(--color-primary)',
          color: 'var(--color-primary)'
        }}
      >
        Explore Community
      </Button>
    </div>
  );
}
