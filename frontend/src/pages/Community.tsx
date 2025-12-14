import Layout from '../components/Layout';
import BackButton from '../components/BackButton';

export default function Community() {
  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-6)' }}>
        <BackButton to="/dashboard" label="Back to Dashboard" />
        
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-12) var(--space-6)',
          backgroundColor: 'var(--color-bg-muted)',
          borderRadius: 'var(--radius-xl)',
          marginTop: 'var(--space-6)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🌎</div>
          <h1 style={{ 
            margin: '0 0 var(--space-4) 0',
            fontSize: '2.5rem',
            color: 'var(--color-text)'
          }}>
            Community
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '600px',
            margin: '0 auto var(--space-8) auto',
            lineHeight: '1.8'
          }}>
            Connect with fellow growers, share your garden journey, learn from others, 
            and build a sustainable growing community together.
          </p>
          
          <div style={{
            display: 'inline-block',
            padding: 'var(--space-4) var(--space-6)',
            backgroundColor: 'var(--color-primary-light)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--color-primary)',
            color: 'var(--color-primary)',
            fontWeight: 'var(--font-weight-semibold)'
          }}>
            Coming Soon
          </div>
          
          <div style={{
            marginTop: 'var(--space-8)',
            fontSize: '0.95rem',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.8'
          }}>
            <p>Features in development:</p>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 'var(--space-4) 0 0 0',
              display: 'grid',
              gap: 'var(--space-2)'
            }}>
              <li>🌱 Share garden updates and photos</li>
              <li>💬 Connect with local growers</li>
              <li>📚 Community knowledge base</li>
              <li>🎓 Learn from experienced gardeners</li>
              <li>🌍 Regional growing groups</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
