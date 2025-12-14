import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { soilApi, gardensApi } from '../lib/api';
import { SoilProfile, SoilInsights, SoilTest, SoilEvent } from '../types/soil';
import BackButton from '../components/BackButton';
import SoilHealthScore from '../components/soil/SoilHealthScore';
import Modal from '../components/ui/Modal';
import ScopeSelectorGrid from '../components/soil/ScopeSelectorGrid';
import AddSoilTestForm from '../components/soil/forms/AddSoilTestForm';
import AddSoilEventForm from '../components/soil/forms/AddSoilEventForm';
import EditSoilProfileForm from '../components/soil/forms/EditSoilProfileForm';
import ExpandableCropCard from '../components/soil/ExpandableCropCard';
import { CropLegend, SmartInsightBanner, getScoreMeaning, generateSmartInsight, getCropCategory } from '../components/soil/CropFitHelpers';
import '../styles/soil.css';

type Tab = 'overview' | 'tests' | 'amendments' | 'crop-fit';

export default function Soil() {
  const navigate = useNavigate();
  const { scopeType: paramScopeType, scopeId: paramScopeId } = useParams();
  
  const [selectedScope, setSelectedScope] = useState<{ type: 'garden' | 'bed' | null; id: string | null }>({
    type: (paramScopeType as 'garden' | 'bed') || null,
    id: paramScopeId || null,
  });
  const [profile, setProfile] = useState<SoilProfile | null>(null);
  const [insights, setInsights] = useState<SoilInsights | null>(null);
  const [tests, setTests] = useState<SoilTest[]>([]);
  const [events, setEvents] = useState<SoilEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [gardens, setGardens] = useState<any[]>([]);
  
  // Modal states
  const [testFormOpen, setTestFormOpen] = useState(false);
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [profileFormOpen, setProfileFormOpen] = useState(false);
  const [prefillEventData, setPrefillEventData] = useState<{ type?: string; amount?: string }>({});

  // Check for tab query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['overview', 'tests', 'amendments', 'crop-fit'].includes(tab)) {
      setActiveTab(tab as Tab);
      // Clear query param
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Load gardens and beds for selector
  useEffect(() => {
    const loadGardens = async () => {
      try {
        const { data: gardensData } = await gardensApi.getAll();
        
        // Load beds for each garden
        const gardensWithBeds = await Promise.all(
          gardensData.map(async (garden: any) => {
            try {
              const { data: beds } = await gardensApi.getBeds(garden.id);
              return { ...garden, beds };
            } catch {
              return { ...garden, beds: [] };
            }
          })
        );
        
        setGardens(gardensWithBeds);
      } catch (error) {
        console.error('Failed to load gardens:', error);
      }
    };
    loadGardens();
  }, []);

  // Load soil data when scope changes
  useEffect(() => {
    if (selectedScope.type && selectedScope.id) {
      loadSoilData();
    }
  }, [selectedScope]);

  const loadSoilData = async () => {
    if (!selectedScope.type || !selectedScope.id) return;
    
    setLoading(true);
    try {
      const [profileRes, insightsRes, testsRes, eventsRes] = await Promise.all([
        soilApi.getProfile(selectedScope.type, selectedScope.id),
        soilApi.getInsights(selectedScope.type, selectedScope.id),
        soilApi.getTests(selectedScope.type, selectedScope.id),
        soilApi.getEvents(selectedScope.type, selectedScope.id),
      ]);
      
      setProfile(profileRes.data);
      setInsights(insightsRes.data);
      setTests(testsRes.data);
      setEvents(eventsRes.data);
    } catch (error) {
      console.error('Failed to load soil data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScopeChange = (type: 'garden' | 'bed', id: string, name: string) => {
    setSelectedScope({ type, id });
    navigate(`/${type}s/${id}/soil`);
  };

  const extractEventType = (actionTitle: string): string => {
    const title = actionTitle.toLowerCase();
    if (title.includes('lime')) return 'lime';
    if (title.includes('sulfur')) return 'sulfur';
    if (title.includes('compost')) return 'compost';
    if (title.includes('fertilizer')) return 'fertilizer';
    if (title.includes('mulch')) return 'mulch';
    return 'amendment';
  };

  const extractAmount = (howTo: string): string => {
    // Try to extract amount like "5 lbs", "2 cups", etc.
    const match = howTo.match(/(\d+(?:\.\d+)?)\s*(lbs?|cups?|bags?|pounds?|tablespoons?|gallons?)/i);
    return match ? match[0] : '';
  };

  const handleMarkActionDone = (action: any) => {
    setPrefillEventData({
      type: extractEventType(action.title),
      amount: extractAmount(action.howTo),
    });
    setEventFormOpen(true);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">Loading soil data...</div>
      </div>
    );
  }

  if (!selectedScope.type || !selectedScope.id) {
    return (
      <div className="page-container">
        <div className="soil-header">
          <h1>Soil Intelligence</h1>
          <p className="subtitle">Understand your soil and get actionable recommendations</p>
        </div>
        
        <div className="empty-state">
          <div className="empty-icon">🌱</div>
          <h2>Choose a Garden or Bed</h2>
          <p>Select a location to view and manage soil data</p>
          
          {gardens.length === 0 ? (
            <button onClick={() => navigate('/gardens')} className="btn btn-primary">
              Create Your First Garden
            </button>
          ) : (
            <ScopeSelectorGrid gardens={gardens} onSelect={handleScopeChange} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <BackButton to="/dashboard" label="Back to Dashboard" />
      <div className="soil-header">
        <h1>Soil Intelligence</h1>
        <p className="subtitle">{selectedScope.type === 'garden' ? 'Garden' : 'Bed'} Soil Analysis</p>
      </div>

      {/* Summary Card */}
      {insights && (
        <div className="soil-summary-card">
          <div className="summary-left">
            <SoilHealthScore score={insights.score} size="large" />
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280', 
                margin: '0.5rem 0',
                lineHeight: '1.5'
              }}>
                {getScoreMeaning(insights.score)}
              </p>
              <button
                onClick={() => setActiveTab('amendments')}
                style={{
                  marginTop: '0.75rem',
                  padding: '0.625rem 1.25rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0.75rem auto 0'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
              >
                Improve Soil →
              </button>
            </div>
          </div>
          
          <div className="summary-right">
            <button 
              className="btn btn-secondary btn-small" 
              onClick={() => setProfileFormOpen(true)}
              style={{ 
                marginBottom: '16px', 
                alignSelf: 'flex-start',
                fontWeight: '600'
              }}
            >
              ✏️ Edit Profile
            </button>
            <div className="summary-stats">
              {profile?.soilType && (
                <div className="stat-item">
                  <span className="stat-label">Soil Type</span>
                  <span className="stat-value">{profile.soilType}</span>
                </div>
              )}
              {profile?.drainage && (
                <div className="stat-item">
                  <span className="stat-label">Drainage</span>
                  <span className="stat-value">{profile.drainage}</span>
                </div>
              )}
              {profile?.ph !== null && profile?.ph !== undefined && (
                <div className="stat-item">
                  <span className="stat-label">pH</span>
                  <span className="stat-value">{profile.ph.toFixed(1)}</span>
                </div>
              )}
              {tests.length > 0 && (
                <div className="stat-item">
                  <span className="stat-label">Last Test</span>
                  <span className="stat-value" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {new Date(tests[0].testDate).toLocaleDateString()}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'tests' ? 'active' : ''}`}
          onClick={() => setActiveTab('tests')}
        >
          Tests
        </button>
        <button
          className={`tab ${activeTab === 'amendments' ? 'active' : ''}`}
          onClick={() => setActiveTab('amendments')}
        >
          Amendments
        </button>
        <button
          className={`tab ${activeTab === 'crop-fit' ? 'active' : ''}`}
          onClick={() => setActiveTab('crop-fit')}
        >
          Crop Fit
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && insights && (
          <div className="overview-tab">
            {/* Warnings */}
            {insights.warnings.length > 0 && (
              <div className="warnings-section">
                <h3>⚠️ Warnings</h3>
                {insights.warnings.map((warning, i) => (
                  <div key={i} className="warning-item">{warning}</div>
                ))}
              </div>
            )}

            {/* Summary Bullets */}
            <div className="summary-section">
              <h3>📊 Summary</h3>
              <ul className="summary-bullets">
                {insights.summaryBullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>

            {/* Recommended Actions */}
            <div className="actions-section">
              <h3>✅ Recommended Actions</h3>
              {insights.recommendedActions.length === 0 ? (
                <p className="empty-text">No actions needed - soil looks great!</p>
              ) : (
                <div className="actions-grid">
                  {insights.recommendedActions.map((action, i) => (
                    <div key={i} className={`action-card priority-${action.priority}`}>
                      <div className="action-header">
                        <h4>{action.title}</h4>
                        <span className={`priority-badge priority-${action.priority}`}>
                          {action.priority}
                        </span>
                      </div>
                      <p className="action-reason">{action.reason}</p>
                      <p className="action-howto">{action.howTo}</p>
                      <div className="action-buttons" style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button 
                          className="btn btn-secondary btn-small"
                          onClick={() => handleMarkActionDone(action)}
                          style={{
                            fontWeight: '600'
                          }}
                        >
                          ✓ I Did This
                        </button>
                        {action.linkToMarketplace && (
                          <button className="btn btn-small">🛒 Shop Products</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="tests-tab">
            <div className="tab-header">
              <h3>Soil Tests</h3>
              <button className="btn btn-primary" onClick={() => setTestFormOpen(true)}>
                + Add Test
              </button>
            </div>
            
            {tests.length === 0 ? (
              <div className="empty-state-small">
                <p>No soil tests recorded yet</p>
                <button className="btn btn-secondary" onClick={() => setTestFormOpen(true)}>
                  Log Your First Test
                </button>
              </div>
            ) : (
              <div className="tests-list">
                {tests.map(test => (
                  <div key={test.id} className="test-card">
                    <div className="test-date">
                      {new Date(test.testDate).toLocaleDateString()}
                    </div>
                    <div className="test-values">
                      {test.ph && <span>pH: {test.ph.toFixed(1)}</span>}
                      {test.nitrogen && <span>N: {test.nitrogen}</span>}
                      {test.phosphorus && <span>P: {test.phosphorus}</span>}
                      {test.potassium && <span>K: {test.potassium}</span>}
                      {test.moisture && <span>Moisture: {test.moisture}%</span>}
                    </div>
                    <div className="test-source">{test.source}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'amendments' && (
          <div className="amendments-tab">
            <div className="tab-header">
              <h3>Soil Amendments</h3>
              <button className="btn btn-primary" onClick={() => setEventFormOpen(true)}>
                + Log Amendment
              </button>
            </div>
            
            {events.length === 0 ? (
              <div className="empty-state-small">
                <p>No amendments recorded yet</p>
              </div>
            ) : (
              <div className="events-list">
                {events.map(event => (
                  <div key={event.id} className="event-card">
                    <div className="event-date">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </div>
                    <div className="event-type">{event.eventType}</div>
                    <div className="event-amount">{event.amount}</div>
                    {event.notes && <div className="event-notes">{event.notes}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'crop-fit' && insights && (
          <div className="crop-fit-tab">
            <h3>Crop Suitability</h3>
            <p className="tab-description">
              Based on your soil conditions, here's how well different crops will grow:
            </p>
            
            {insights.cropFit.length === 0 ? (
              <div className="empty-state-small">
                <p>Complete your soil profile to see crop recommendations</p>
              </div>
            ) : (
              <>
                {/* Smart Insight Banner */}
                <SmartInsightBanner insight={generateSmartInsight(insights.cropFit, profile)} />
                
                {/* Crop Fit Legend */}
                <CropLegend showAvoid={insights.cropFit.some(c => c.fitLevel === 'avoid')} />
                
                {/* Grouped Crop Cards */}
                {(() => {
                  // Group crops by category
                  const grouped: Record<string, typeof insights.cropFit> = {};
                  insights.cropFit.forEach(crop => {
                    const category = getCropCategory(crop.cropName);
                    if (!grouped[category]) grouped[category] = [];
                    grouped[category].push(crop);
                  });
                  
                  // Sort categories: show categories with more 'great' crops first
                  const sortedCategories = Object.entries(grouped).sort((a, b) => {
                    const aGreat = a[1].filter(c => c.fitLevel === 'great').length;
                    const bGreat = b[1].filter(c => c.fitLevel === 'great').length;
                    return bGreat - aGreat;
                  });
                  
                  return sortedCategories.map(([category, crops]) => (
                    <div key={category} style={{ marginBottom: '2rem' }}>
                      <h4 style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '1rem',
                        paddingBottom: '0.5rem',
                        borderBottom: '2px solid #e5e7eb'
                      }}>
                        {category}
                      </h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1rem'
                      }}>
                        {crops.map((crop, i) => (
                          <ExpandableCropCard
                            key={i}
                            cropName={crop.cropName}
                            fitLevel={crop.fitLevel}
                            reason={crop.reason}
                            currentPH={profile?.ph}
                          />
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal 
        isOpen={testFormOpen} 
        onClose={() => setTestFormOpen(false)} 
        title="Add Soil Test"
        size="large"
      >
        <AddSoilTestForm
          scopeType={selectedScope.type!}
          scopeId={selectedScope.id!}
          onSuccess={() => {
            setTestFormOpen(false);
            loadSoilData();
          }}
          onCancel={() => setTestFormOpen(false)}
        />
      </Modal>

      <Modal 
        isOpen={eventFormOpen} 
        onClose={() => {
          setEventFormOpen(false);
          setPrefillEventData({});
        }} 
        title="Log Soil Amendment"
        size="medium"
      >
        <AddSoilEventForm
          scopeType={selectedScope.type!}
          scopeId={selectedScope.id!}
          prefillType={prefillEventData.type}
          prefillAmount={prefillEventData.amount}
          onSuccess={() => {
            setEventFormOpen(false);
            setPrefillEventData({});
            loadSoilData();
          }}
          onCancel={() => {
            setEventFormOpen(false);
            setPrefillEventData({});
          }}
        />
      </Modal>

      <Modal 
        isOpen={profileFormOpen} 
        onClose={() => setProfileFormOpen(false)} 
        title="Edit Soil Profile"
        size="large"
      >
        <EditSoilProfileForm
          scopeType={selectedScope.type!}
          scopeId={selectedScope.id!}
          currentProfile={profile}
          onSuccess={() => {
            setProfileFormOpen(false);
            loadSoilData();
          }}
          onCancel={() => setProfileFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
