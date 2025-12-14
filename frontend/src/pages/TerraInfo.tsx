import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import { externalLinks } from '../config/features';

export default function TerraInfo() {
  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <BackButton to="/dashboard" label="Back to Dashboard" />
        <div style={{ 
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '3rem 2rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>
          🌱 Terra Plantari × Terra Trionfo
        </h1>
        <p style={{ margin: 0, fontSize: '1.25rem', opacity: 0.9 }}>
          Growing Together: From Your Garden to Your Community
        </p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginTop: 0, color: '#10b981' }}>What is Terra Trionfo?</h2>
        <p>
          Terra Trionfo is an Italian-inspired farm-to-table marketplace built on the belief that 
          everything good begins with the land. Our mission is to support growers, artisans, and 
          producers by giving them a place to share the quality and comfort of what they create.
        </p>
        <p style={{ fontStyle: 'italic', color: '#059669', margin: '1rem 0' }}>
          Born of the Land. Built for Growers.
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Authentic Connection:</strong> Share your harvest directly with consumers who value quality</li>
          <li><strong>Grower-First Platform:</strong> Built by growers, for growers—we understand your needs</li>
          <li><strong>Transparent Marketplace:</strong> Set your prices, tell your story, build your reputation</li>
          <li><strong>Community Impact:</strong> Support local food systems and strengthen your regional network</li>
        </ul>
      </div>

      <div className="card" style={{ marginBottom: '2rem', backgroundColor: '#f0fdf4' }}>
        <h2 style={{ marginTop: 0, color: '#059669' }}>How Your Harvest Will Connect</h2>
        <p>
          With our integration into Terra Plantari, the harvest you nurture will soon move 
          seamlessly from your garden to your marketplace profile. As your crops reach maturity, 
          Terra Plantari will automatically update your Terra Trionfo listings with real-time 
          yields, available quantities, and seasonal availability—letting you focus on growing while 
          we handle the connection to consumers.
        </p>
        
        <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ 
              fontSize: '2rem', 
              minWidth: '50px', 
              height: '50px', 
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              1️⃣
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Track Your Growing Journey</h3>
              <p style={{ margin: 0, color: '#6b7280' }}>
                Plan and monitor your crops in Terra Plantari—track planting dates, growth stages, 
                and expected harvest times with precision.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ 
              fontSize: '2rem', 
              minWidth: '50px', 
              height: '50px', 
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              2️⃣
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Automatic Harvest Sync</h3>
              <p style={{ margin: 0, color: '#6b7280' }}>
                As your crops reach maturity and you log harvests, that data flows directly to your 
                Terra Trionfo vendor profile—no duplicate data entry needed.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ 
              fontSize: '2rem', 
              minWidth: '50px', 
              height: '50px', 
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              3️⃣
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Real-Time Inventory Management</h3>
              <p style={{ margin: 0, color: '#6b7280' }}>
                Your Terra listings automatically update with available quantities and seasonal 
                availability. Consumers see what's fresh and ready, while you maintain accurate stock.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ 
              fontSize: '2rem', 
              minWidth: '50px', 
              height: '50px', 
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              4️⃣
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Grow Your Business</h3>
              <p style={{ margin: 0, color: '#6b7280' }}>
                Focus on what you do best—growing quality produce—while the integration handles 
                marketplace logistics, inventory tracking, and wholesale opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginTop: 0, color: '#f59e0b' }}>⏱️ Integration Timeline</h2>
        <p>
          Together, we're creating a future where every grower can share their harvest with the 
          world—efficiently, transparently, and true to the spirit of being Born of the Land.
        </p>
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f0fdf4',
            borderLeft: '4px solid #10b981',
            borderRadius: '4px'
          }}>
            <strong style={{ color: '#059669' }}>Q1 2026:</strong> Harvest data syncing + vendor onboarding
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
              Connect your Terra Plantari harvests to Terra Trionfo and begin your journey 
              as a marketplace vendor.
            </p>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f0fdf4',
            borderLeft: '4px solid #10b981',
            borderRadius: '4px'
          }}>
            <strong style={{ color: '#059669' }}>Q2 2026:</strong> Automatic product creation + inventory tracking
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
              Your logged harvests automatically become marketplace listings with real-time 
              inventory updates. No manual entry required.
            </p>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f0fdf4',
            borderLeft: '4px solid #10b981',
            borderRadius: '4px'
          }}>
            <strong style={{ color: '#059669' }}>Q3 2026:</strong> Wholesale offer generation + distribution compatibility
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
              Scale your operation with wholesale capabilities and connect with regional distributors 
              while maintaining your direct-to-consumer presence.
            </p>
          </div>
        </div>
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          backgroundColor: '#fef3c7',
          borderRadius: '6px',
          borderLeft: '4px solid #f59e0b'
        }}>
          <strong>🌱 Early Access:</strong> Current Terra Plantari users will receive priority 
          onboarding to Terra Trionfo, including dedicated support during the integration rollout and 
          exclusive access to beta features.
        </div>
      </div>

      <div className="card" style={{ 
        textAlign: 'center', 
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white'
      }}>
        <h2 style={{ marginTop: 0 }}>Join the Terra Trionfo Movement</h2>
        <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>
          Visit Terra Trionfo to explore the marketplace, meet fellow growers, and prepare for 
          seamless integration with your Terra Plantari.
        </p>
        <a 
          href={externalLinks.terraMarketplace}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            backgroundColor: 'white',
            color: '#059669',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '1.125rem',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Visit Terra Trionfo →
        </a>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.9 }}>
          Born of the Land. Built for Growers.
        </p>
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.875rem'
      }}>
        <p style={{ margin: 0 }}>
          Have questions about the integration? Contact us at{' '}
          <a href="mailto:support@terraplantari.com" style={{ color: '#10b981' }}>
            support@terraplantari.com
          </a>
        </p>
      </div>
      </div>
    </Layout>
  );
}
