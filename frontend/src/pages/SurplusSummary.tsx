import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import { featureFlags, externalLinks } from '../config/features';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

interface SurplusItem {
  cropId: string;
  cropName: string;
  totalQuantity: number;
  unit: string;
  harvestCount: number;
  lastHarvestDate: string;
}

export default function SurplusSummary() {
  const [surplus, setSurplus] = useState<SurplusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSurplus();
  }, []);

  const loadSurplus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/harvests/surplus`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSurplus(response.data.surplusSummary);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load surplus data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading surplus summary...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <Layout>
      <BackButton to="/dashboard" label="Back to Dashboard" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.25rem 0' }}>🌾 Surplus Harvest Summary</h1>
          <p className="text-muted" style={{ margin: 0 }}>
            Track crops you've harvested in surplus for sharing or preservation
          </p>
        </div>
        {featureFlags.showTerraLink && featureFlags.showTerraComingSoon && surplus.length > 0 && (
          <a
            href={externalLinks.terraMarketplace}
            target="_blank"
            rel="noopener noreferrer"
            title="Full integration coming soon — track surplus now to prepare."
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#10b981',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '0.875rem',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span>🌾 Sell on Terra</span>
            <span style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              fontSize: '0.7rem'
            }}>
              COMING SOON
            </span>
          </a>
        )}
      </div>

      {surplus.length === 0 ? (
        <div className="card text-center" style={{ padding: '2rem' }}>
          <p>No surplus harvests recorded yet.</p>
          <p className="text-muted">
            When logging harvests, mark items as "surplus" to track them here.
          </p>
        </div>
      ) : (
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Crop</th>
                <th style={{ padding: '0.75rem' }}>Total Quantity</th>
                <th style={{ padding: '0.75rem' }}>Harvests</th>
                <th style={{ padding: '0.75rem' }}>Last Harvest</th>
              </tr>
            </thead>
            <tbody>
              {surplus.map((item) => (
                <tr key={item.cropId} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500 }}>
                    {item.cropName}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {item.totalQuantity.toFixed(1)} {item.unit}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {item.harvestCount}
                  </td>
                  <td style={{ padding: '0.75rem', color: '#6b7280' }}>
                    {new Date(item.lastHarvestDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
            <h3 style={{ marginTop: 0, fontSize: '1rem' }}>💡 What to do with surplus:</h3>
            <ul style={{ marginBottom: 0, paddingLeft: '1.5rem' }}>
              <li>Share with neighbors and community</li>
              <li>Preserve by canning, freezing, or dehydrating</li>
              <li>Donate to local food banks</li>
              <li>Trade with other gardeners</li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}
