import DashboardCard from '../DashboardCard';

interface ForecastFullCardProps {
  weather: any;
  weatherError: string;
  loadWeather: () => void;
}

export default function ForecastFullCard({ weather, weatherError, loadWeather }: ForecastFullCardProps) {
  return (
    <DashboardCard
      title="Extended Forecast"
      subtitle="Complete 7-day outlook"
      glass={true}
    >
      {weather ? (
        <div id="forecast">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1rem'
          }}>
            {weather.forecast.map((day: any, idx: number) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(243, 244, 246, 0.5)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid rgba(229, 231, 235, 0.5)'
                }}
              >
                <div style={{
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  color: '#1f2937'
                }}>
                  {day.dayOfWeek}
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '0.75rem'
                }}>
                  {day.icon}
                </div>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '0.25rem'
                }}>
                  {day.high}°
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#9ca3af',
                  marginBottom: '0.5rem'
                }}>
                  Low: {day.low}°
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  {day.condition}
                </div>
                {day.precipitationChance > 0 && (
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#3b82f6',
                    fontWeight: '600'
                  }}>
                    💧 {day.precipitationChance}% rain
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: 'rgba(236, 253, 245, 0.5)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#059669',
            textAlign: 'center'
          }}>
            ✓ Real-time weather from Open-Meteo API
          </div>
        </div>
      ) : weatherError ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>☁️</div>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            {weatherError}
          </p>
          <button
            onClick={loadWeather}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          Loading forecast...
        </div>
      )}
    </DashboardCard>
  );
}
