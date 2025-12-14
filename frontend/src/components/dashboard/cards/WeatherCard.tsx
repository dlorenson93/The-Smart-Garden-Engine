import { Link } from 'react-router-dom';
import DashboardCard from '../DashboardCard';

interface WeatherCardProps {
  weather: any;
  weatherError: string;
  sunInfo: any;
  getCurrentTime: () => string;
  loadWeather: () => void;
}

export default function WeatherCard({ 
  weather, 
  weatherError, 
  sunInfo, 
  getCurrentTime,
  loadWeather
}: WeatherCardProps) {
  return (
    <DashboardCard
      title="Current Weather"
      glass={true}
    >
      {weather ? (
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ fontSize: '4rem' }}>{weather.current.icon}</div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1f2937' }}>
                {weather.current.temp}°F
              </div>
              <div style={{ fontSize: '1rem', color: '#6b7280' }}>
                {weather.current.condition}
              </div>
            </div>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1rem',
            padding: '1rem',
            backgroundColor: 'rgba(243, 244, 246, 0.5)',
            borderRadius: '12px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                Feels Like
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                {weather.current.feelsLike}°F
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                Humidity
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                💧 {weather.current.humidity}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                {sunInfo.event}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                {sunInfo.event === 'Sunrise' ? '🌅' : '🌇'} {sunInfo.time}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                Current Time
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                ⏰ {getCurrentTime()}
              </div>
            </div>
          </div>
        </div>
      ) : weatherError ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>☁️</div>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{weatherError}</p>
          {weatherError.includes('not set') || weatherError.includes('Profile') ? (
            <Link to="/profile/setup">
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Set Up Location
              </button>
            </Link>
          ) : (
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
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          Loading weather...
        </div>
      )}
    </DashboardCard>
  );
}
