import { Link } from 'react-router-dom';
import DashboardCard from '../DashboardCard';

interface RecentHarvestsCardProps {
  plantings: any[];
  photos: any[];
}

export default function RecentHarvestsCard({ plantings, photos }: RecentHarvestsCardProps) {
  // Get recent harvests from plantings
  const recentHarvests = plantings
    .filter(p => p.harvestLogs && p.harvestLogs.length > 0)
    .flatMap(p => p.harvestLogs.map((h: any) => ({ ...h, planting: p })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const hasHarvests = recentHarvests.length > 0;
  const hasPhotos = photos.length > 0;

  return (
    <DashboardCard
      title={hasHarvests ? "Recent Harvests" : "Photo Journal"}
      subtitle={hasHarvests ? "Latest harvest entries" : "Recent garden photos"}
      glass={true}
    >
      {hasHarvests ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            {recentHarvests.map((harvest, idx) => (
              <Link
                key={idx}
                to={`/plantings/${harvest.planting.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: 'rgba(236, 253, 245, 0.5)',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                        🍅 {harvest.planting.crop.name}
                        {harvest.planting.variety && (
                          <span style={{ fontWeight: 'normal', color: '#6b7280', fontStyle: 'italic' }}>
                            {' '}({harvest.planting.variety})
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {harvest.amount} {harvest.units}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      {new Date(harvest.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/surplus">
            <button style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'transparent',
              color: '#10b981',
              border: '2px solid #10b981',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              View All Harvests
            </button>
          </Link>
        </>
      ) : hasPhotos ? (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            {photos.slice(0, 3).map((photo) => (
              <Link
                key={photo.id}
                to={photo.plantingId ? `/plantings/${photo.plantingId}` : '/gardens'}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  aspectRatio: '1',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  {photo.url ? (
                    <img 
                      src={photo.url} 
                      alt={photo.caption || 'Garden photo'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    '📸'
                  )}
                </div>
              </Link>
            ))}
          </div>
          <Link to="/timeline">
            <button style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'transparent',
              color: '#ec4899',
              border: '2px solid #ec4899',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              View Photo Journal
            </button>
          </Link>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            No harvests or photos yet
          </p>
          <Link to="/gardens">
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Start Growing
            </button>
          </Link>
        </div>
      )}
    </DashboardCard>
  );
}
