import { Link } from 'react-router-dom';
import DashboardCard from '../DashboardCard';
import { externalLinks } from '../../../config/features';

export default function SellHarvestCard() {
  return (
    <DashboardCard glass={true}>
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: '12px',
        padding: '1.5rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          fontSize: '8rem',
          opacity: 0.1
        }}>
          🌾
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              Sell Your Harvest
            </h3>
            <span style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#059669',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              COMING SOON
            </span>
          </div>

          <p style={{
            fontSize: '1rem',
            marginBottom: '1.5rem',
            opacity: 0.95,
            lineHeight: 1.6
          }}>
            Soon you'll be able to send surplus harvests directly to Terra Trionfo — 
            a farm-to-table marketplace connecting local growers with buyers.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/terra">
              <button style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'white',
                color: '#059669',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem'
              }}>
                Learn More About Terra →
              </button>
            </Link>

            <a
              href={externalLinks.terraMarketplace}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '0.75rem',
                color: 'white',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '600',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
            >
              Visit Terra Website ↗
            </a>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
