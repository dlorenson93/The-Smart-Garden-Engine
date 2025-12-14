import DashboardCard from '../DashboardCard';

interface ForecastMiniCardProps {
  weather: any;
  onViewDetails: () => void;
}

export default function ForecastMiniCard({ weather, onViewDetails }: ForecastMiniCardProps) {
  if (!weather) return null;

  return (
    <DashboardCard
      title="7-Day Forecast"
      subtitle="Quick overview"
      glass={true}
      onClick={onViewDetails}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '0.5rem'
      }}>
        {weather.forecast.slice(0, 7).map((day: any, idx: number) => (
          <div
            key={idx}
            style={{
              textAlign: 'center',
              padding: '0.5rem',
              backgroundColor: 'rgba(243, 244, 246, 0.5)',
              borderRadius: '8px'
            }}
          >
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#6b7280',
              marginBottom: '0.25rem'
            }}>
              {day.dayOfWeek.substring(0, 3)}
            </div>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
              {day.icon}
            </div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              {day.high}°
            </div>
            {day.precipitationChance > 0 && (
              <div style={{
                fontSize: '0.7rem',
                color: '#3b82f6',
                marginTop: '0.25rem'
              }}>
                💧{day.precipitationChance}%
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{
        marginTop: '1rem',
        textAlign: 'center',
        color: '#10b981',
        fontSize: '0.875rem',
        fontWeight: '600'
      }}>
        Click for full forecast →
      </div>
    </DashboardCard>
  );
}
