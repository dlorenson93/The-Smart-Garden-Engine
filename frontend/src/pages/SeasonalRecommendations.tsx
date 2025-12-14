import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import AIBadge from '../components/AIBadge';
import DidYouKnow from '../components/DidYouKnow';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

interface Crop {
  id: string;
  name: string;
  category: string;
  daysToMaturity: number;
  sunRequirement: string;
  difficulty: string;
  spacingInRow: number | null;
  spacingBetweenRows: number | null;
  minHardinessZone: number | null;
  maxHardinessZone: number | null;
  frostTolerant: boolean;
}

interface RecommendationData {
  zone: string;
  month: number;
  crops: Crop[];
  frostDates: {
    lastFrost: string | null;
    firstFrost: string | null;
  };
}

export default function SeasonalRecommendations() {
  const [data, setData] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/recommendations/seasonal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
      setError('');
    } catch (err: any) {
      console.error('Recommendations error:', err);
      const errorMsg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to load recommendations';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1>🌱 Seasonal Planting Recommendations</h1>
        <p>Loading recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>🌱 Seasonal Planting Recommendations</h1>
        <div className="card" style={{ backgroundColor: '#fee2e2', borderColor: '#ef4444', padding: '1rem' }}>
          <h3 style={{ marginTop: 0 }}>Error Loading Recommendations</h3>
          <p>{error}</p>
          {error.includes('ZIP code') && (
            <Link to="/profile/setup">
              <button style={{ marginTop: '1rem' }}>Update Profile with ZIP Code</button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <h1>🌱 Seasonal Planting Recommendations</h1>
        <div className="card">
          <p>No data available</p>
          <button onClick={loadRecommendations}>Retry</button>
        </div>
      </div>
    );
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <Layout>
      <BackButton to="/dashboard" label="Back to Dashboard" />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>🌱 Seasonal Planting Recommendations</h1>
        <AIBadge text="AI-Powered" />
      </div>
      
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              Your USDA Zone
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
              {data.zone}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              Current Month
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {monthNames[data.month - 1]}
            </div>
          </div>
          {data.frostDates?.lastFrost && (
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                Last Spring Frost
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                {data.frostDates.lastFrost}
              </div>
            </div>
          )}
          {data.frostDates?.firstFrost && (
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                First Fall Frost
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                {data.frostDates.firstFrost}
              </div>
            </div>
          )}
        </div>
      </div>

      <h2>Recommended Crops for This Month</h2>
      
      {!data.crops || data.crops.length === 0 ? (
        <div className="card" style={{ padding: '2rem', backgroundColor: '#fef3c7', borderColor: '#f59e0b' }}>
          <h3 style={{ marginTop: 0 }}>⚠️ No Crops Available</h3>
          <p>No crops found in the database for {monthNames[data.month - 1]} in zone {data.zone}.</p>
          <p>This likely means the database hasn't been seeded with crop data yet.</p>
          <p><strong>To fix this:</strong></p>
          <ol style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
            <li>Open a terminal in the backend directory</li>
            <li>Run: <code style={{ backgroundColor: '#fff', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>npm run seed</code></li>
            <li>Refresh this page</li>
          </ol>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {data.crops.map((crop) => (
            <div key={crop.id} className="card">
              <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
                {crop.name}
                <span style={{ 
                  marginLeft: '0.5rem', 
                  fontSize: '0.75rem', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '0.25rem',
                  backgroundColor: crop.difficulty === 'easy' ? '#d1fae5' : crop.difficulty === 'medium' ? '#fed7aa' : '#fecaca',
                  color: crop.difficulty === 'easy' ? '#065f46' : crop.difficulty === 'medium' ? '#92400e' : '#991b1b'
                }}>
                  {crop.difficulty}
                </span>
              </h3>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Category: {crop.category}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem', marginTop: '1rem' }}>
                <div>
                  <strong>Days to Maturity:</strong>
                  <div>{crop.daysToMaturity}</div>
                </div>
                <div>
                  <strong>Sunlight:</strong>
                  <div>{crop.sunRequirement}</div>
                </div>
                {crop.spacingInRow && (
                  <div>
                    <strong>Spacing:</strong>
                    <div>{crop.spacingInRow}" in row</div>
                  </div>
                )}
                {crop.frostTolerant && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      fontSize: '0.75rem'
                    }}>
                      ❄️ Frost Tolerant
                    </span>
                  </div>
                )}
              </div>

              {crop.minHardinessZone && crop.maxHardinessZone && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  Hardiness Zones: {crop.minHardinessZone} - {crop.maxHardinessZone}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <DidYouKnow />
    </Layout>
  );
}
