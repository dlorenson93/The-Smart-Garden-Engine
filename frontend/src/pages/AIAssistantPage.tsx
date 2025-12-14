import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import AIAssistant from '../components/AIAssistant';

export default function AIAssistantPage() {
  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <BackButton to="/dashboard" label="Back to Dashboard" />
        
        <div style={{
          marginTop: 'var(--space-6)',
          marginBottom: 'var(--space-4)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            marginBottom: 'var(--space-6)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>🤖</div>
            <h1 style={{ 
              margin: '0 0 var(--space-2) 0',
              fontSize: '2rem',
              fontWeight: 'var(--font-weight-bold)'
            }}>
              AI Garden Assistant
            </h1>
            <p style={{ 
              margin: 0,
              opacity: 0.95,
              fontSize: '1.125rem',
              lineHeight: '1.6'
            }}>
              Get personalized gardening advice powered by your garden data
            </p>
          </div>

          <AIAssistant />
        </div>
      </div>
    </Layout>
  );
}
