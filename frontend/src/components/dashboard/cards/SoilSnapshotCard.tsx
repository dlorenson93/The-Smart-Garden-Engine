import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { soilApi } from '../../../lib/api';
import SoilHealthScore from '../../soil/SoilHealthScore';
import { getScoreMeaning } from '../../soil/CropFitHelpers';

interface SoilProfile {
  id: string;
  scopeType: 'garden' | 'bed';
  scopeId: string;
  soilType?: string;
  drainage?: string;
  ph?: number;
  tests?: Array<{ testDate: string }>;
}

export default function SoilSnapshotCard() {
  const [profiles, setProfiles] = useState<SoilProfile[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSoilData();
  }, []);

  const loadSoilData = async () => {
    try {
      const { data } = await soilApi.getUserSummary();
      setProfiles(data);

      // Get insights for first profile if available
      if (data.length > 0) {
        const firstProfile = data[0];
        const insightsRes = await soilApi.getInsights(
          firstProfile.scopeType,
          firstProfile.scopeId
        );
        setInsights(insightsRes.data);
      }
    } catch (error) {
      console.error('Failed to load soil data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-card">
        <div className="card-header">
          <h3>🌍 Soil Intelligence</h3>
        </div>
        <div className="card-body">
          <p className="loading-text">Loading soil data...</p>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="dashboard-card soil-intelligence-card" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        border: '2px dashed #d1fae5'
      }}>
        <div className="card-header">
          <h3>🌍 Soil Intelligence</h3>
        </div>
        <div className="card-body" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
          <p style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Start Tracking Your Soil
          </p>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#6b7280',
            marginBottom: '1.5rem',
            lineHeight: '1.5'
          }}>
            Monitor pH levels, nutrients, and get crop recommendations based on your soil conditions
          </p>
          <Link 
            to="/soil" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#10b981',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'background-color 0.2s',
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
          >
            Set Up Soil Profile →
          </Link>
        </div>
      </div>
    );
  }

  const firstProfile = profiles[0];
  const latestTest = firstProfile.tests && firstProfile.tests.length > 0
    ? firstProfile.tests[0]
    : null;
  
  // Get top crop fit recommendations
  const topCrops = insights?.cropFit?.filter((c: any) => c.fitLevel === 'great').slice(0, 3) || [];
  const hasWarnings = insights?.warnings && insights.warnings.length > 0;
  const hasRecommendations = insights?.recommendedActions && insights.recommendedActions.length > 0;

  return (
    <div className="dashboard-card soil-intelligence-card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h3>🌍 Soil Intelligence</h3>
          {profiles.length > 1 && (
            <span style={{
              fontSize: '0.75rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              borderRadius: '12px',
              fontWeight: '600'
            }}>
              {profiles.length} locations
            </span>
          )}
        </div>
      </div>
      
      <div className="card-body">
        {insights && (
          <div className="soil-snapshot-content">
            {/* Score and Quick Stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="soil-score-section">
                <SoilHealthScore score={insights.score} size="medium" showLabel={false} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '700', 
                  color: '#1f2937',
                  marginBottom: '0.25rem'
                }}>
                  {insights.score >= 80 ? 'Excellent' : insights.score >= 65 ? 'Good' : insights.score >= 50 ? 'Fair' : 'Needs Work'}
                </div>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280', 
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {getScoreMeaning(insights.score)}
                </p>
              </div>
            </div>
            
            {/* Key Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}>
              {firstProfile.ph !== null && firstProfile.ph !== undefined && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>pH Level</div>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    color: '#10b981'
                  }}>
                    {firstProfile.ph.toFixed(1)}
                  </div>
                </div>
              )}
              {firstProfile.soilType && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Soil Type</div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: '#374151'
                  }}>
                    {firstProfile.soilType}
                  </div>
                </div>
              )}
              {firstProfile.drainage && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Drainage</div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: '#374151',
                    textTransform: 'capitalize'
                  }}>
                    {firstProfile.drainage}
                  </div>
                </div>
              )}
              {latestTest && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Last Test</div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: '600', 
                    color: '#374151'
                  }}>
                    {new Date(latestTest.testDate).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            {/* Top Crops or Warning */}
            {topCrops.length > 0 ? (
              <div style={{
                padding: '0.875rem',
                backgroundColor: '#d1fae5',
                borderRadius: '8px',
                border: '1px solid #10b981'
              }}>
                <div style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: '600', 
                  color: '#065f46',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  🌟 Best Crops for Your Soil
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem' 
                }}>
                  {topCrops.map((crop: any, idx: number) => (
                    <span key={idx} style={{
                      fontSize: '0.875rem',
                      padding: '0.25rem 0.625rem',
                      backgroundColor: 'white',
                      color: '#065f46',
                      borderRadius: '12px',
                      fontWeight: '500',
                      border: '1px solid #10b981'
                    }}>
                      {crop.cropName}
                    </span>
                  ))}
                </div>
              </div>
            ) : hasWarnings ? (
              <div className="soil-warnings">
                <span className="warning-icon">⚠️</span>
                <span className="warning-text">{insights.warnings[0]}</span>
              </div>
            ) : null}

            {/* Quick Actions */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: hasRecommendations ? '1fr 1fr' : '1fr',
              gap: '0.5rem' 
            }}>
              <Link 
                to="/soil" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
              >
                View Details →
              </Link>
              {hasRecommendations && (
                <Link 
                  to="/soil?tab=amendments" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    color: '#10b981',
                    textDecoration: 'none',
                    border: '2px solid #10b981',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  📋 {insights.recommendedActions.length} Actions
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
