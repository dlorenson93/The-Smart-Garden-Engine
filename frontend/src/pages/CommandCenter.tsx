import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import { plantingsApi, tasksApi, seedsApi, photosApi } from '../lib/api';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

interface Task {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  completed: boolean;
  skippedByWeather: boolean;
  weatherReason?: string;
  planting: {
    crop: { name: string };
  };
}

interface Planting {
  id: string;
  crop: { name: string };
  plantingDate: string;
  expectedHarvestStart: string;
  healthStatus: string;
  garden: { name: string };
}

interface Seed {
  id: string;
  cropName: string;
  quantity: number;
  unit: string;
  expirationDate?: string;
}

interface Photo {
  id: string;
  url: string;
  type: string;
  createdAt: string;
  planting?: {
    crop: { name: string };
  };
}

export default function CommandCenter() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [plantings, setPlantings] = useState<Planting[]>([]);
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksRes, plantingsRes, seedsRes, photosRes] = await Promise.all([
        tasksApi.getAll('upcoming'),
        plantingsApi.getAll(),
        seedsApi.getAll(),
        photosApi.getAll(),
      ]);

      setTasks(tasksRes.data);
      setPlantings(plantingsRes.data);
      setSeeds(seedsRes.data);
      setPhotos(photosRes.data.slice(0, 6)); // Recent 6 photos
    } catch (error) {
      console.error('Error loading command center data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlantingsByStage = () => {
    const stages: Record<string, Planting[]> = {
      seedling: [],
      vegetative: [],
      flowering: [],
      fruiting: [],
      ready: [],
    };

    plantings.forEach((planting) => {
      const stage = calculateGrowthStage(planting);
      if (stages[stage]) {
        stages[stage].push(planting);
      }
    });

    return stages;
  };

  const calculateGrowthStage = (planting: Planting): string => {
    const plantingDate = new Date(planting.plantingDate);
    const harvestDate = new Date(planting.expectedHarvestStart);
    const now = new Date();
    
    const totalDays = harvestDate.getTime() - plantingDate.getTime();
    const elapsed = now.getTime() - plantingDate.getTime();
    const percentage = (elapsed / totalDays) * 100;

    if (now >= harvestDate) return 'ready';
    if (percentage < 25) return 'seedling';
    if (percentage < 50) return 'vegetative';
    if (percentage < 75) return 'flowering';
    return 'fruiting';
  };

  const getUpcomingHarvests = () => {
    const today = new Date();
    const twoWeeksFromNow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

    return plantings.filter((planting) => {
      const harvestDate = new Date(planting.expectedHarvestStart);
      return harvestDate >= today && harvestDate <= twoWeeksFromNow;
    });
  };

  const getHealthAlerts = () => {
    return plantings.filter((p) => 
      p.healthStatus === 'struggling' || p.healthStatus === 'diseased'
    );
  };

  const getLowStockSeeds = () => {
    return seeds.filter((s) => s.quantity <= 2);
  };

  const getExpiringSoonSeeds = () => {
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    return seeds.filter((s) => {
      if (!s.expirationDate) return false;
      const exp = new Date(s.expirationDate);
      return exp <= threeMonthsFromNow && exp >= new Date();
    });
  };

  const stageCounts = getPlantingsByStage();
  const upcomingHarvests = getUpcomingHarvests();
  const healthAlerts = getHealthAlerts();
  const lowStockSeeds = getLowStockSeeds();
  const expiringSoonSeeds = getExpiringSoonSeeds();
  const smartWateringTasks = tasks.filter((t) => t.skippedByWeather);

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <BackButton to="/dashboard" label="Back to Dashboard" />
      <div style={{ position: 'relative' }}>
        {/* Vineyard background for garden theme */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '400px',
          backgroundImage: 'url(/images/vineyard.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.04,
          pointerEvents: 'none',
          zIndex: 0
        }} />
      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <PageHeader
          title="🎯 Garden Command Center"
          description="Monitor critical stats, upcoming tasks, and garden health at a glance"
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadData()}
              leftIcon="🔄"
            >
              Refresh
            </Button>
          }
        />

        {/* Top Row - Critical Alerts (Clickable Stat Cards) */}
        <div className="command-center-stats grid-4-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <Card
            variant={activeFilter === 'health' ? 'default' : 'soft'}
            onClick={() => setActiveFilter(activeFilter === 'health' ? null : 'health')}
            style={{ 
              backgroundColor: activeFilter === 'health' ? '#fef3c7' : undefined,
              borderLeft: activeFilter === 'health' ? '4px solid #f59e0b' : undefined,
              cursor: 'pointer'
            }}
          >
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>⚠️ Health Alerts</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-warning-dark)' }}>{healthAlerts.length}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                {activeFilter === 'health' ? 'Click to clear filter' : 'Click to view details'}
              </div>
            </div>
          </Card>

          <Card
            variant={activeFilter === 'watering' ? 'default' : 'soft'}
            onClick={() => setActiveFilter(activeFilter === 'watering' ? null : 'watering')}
            style={{ 
              backgroundColor: activeFilter === 'watering' ? '#dbeafe' : undefined,
              borderLeft: activeFilter === 'watering' ? '4px solid #3b82f6' : undefined,
              cursor: 'pointer'
            }}
          >
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>💧 Smart Watering</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e40af' }}>{smartWateringTasks.length}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                {activeFilter === 'watering' ? 'Auto-adjusted (filtered)' : 'Auto-adjusted today'}
              </div>
            </div>
          </Card>

          <Card
            variant={activeFilter === 'harvest' ? 'default' : 'soft'}
            onClick={() => setActiveFilter(activeFilter === 'harvest' ? null : 'harvest')}
            style={{ 
              backgroundColor: activeFilter === 'harvest' ? '#fce7f3' : undefined,
              borderLeft: activeFilter === 'harvest' ? '4px solid #ec4899' : undefined,
              cursor: 'pointer'
            }}
          >
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>🌾 Harvest Soon</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#9f1239' }}>{upcomingHarvests.length}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                {activeFilter === 'harvest' ? 'Showing upcoming (filtered)' : 'Next 2 weeks'}
              </div>
            </div>
          </Card>

          <Card
            variant={activeFilter === 'seeds' ? 'default' : 'soft'}
            onClick={() => setActiveFilter(activeFilter === 'seeds' ? null : 'seeds')}
            style={{ 
              backgroundColor: activeFilter === 'seeds' ? '#e0e7ff' : undefined,
              borderLeft: activeFilter === 'seeds' ? '4px solid #6366f1' : undefined,
              cursor: 'pointer'
            }}
          >
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>🌱 Seed Warnings</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3730a3' }}>{lowStockSeeds.length + expiringSoonSeeds.length}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                {activeFilter === 'seeds' ? 'Showing warnings (filtered)' : 'Low stock & expiring'}
              </div>
            </div>
          </Card>
        </div>

        {/* Seed Inventory Overview */}
        <Card
          title="🌰 Seed Inventory"
          style={{ marginBottom: '2rem' }}
          actions={
            <Button variant="primary" size="sm" onClick={() => navigate('/seeds')}>
              Manage Seed Inventory →
            </Button>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--color-bg-muted)', 
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌱</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)' }}>{seeds.length}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Total Varieties</div>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: lowStockSeeds.length > 0 ? 'var(--color-danger-light)' : 'var(--color-bg-muted)', 
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: lowStockSeeds.length > 0 ? 'var(--color-danger)' : 'var(--color-text)' }}>{lowStockSeeds.length}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Low Stock</div>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: expiringSoonSeeds.length > 0 ? 'var(--color-warning-light)' : 'var(--color-bg-muted)', 
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🕐</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: expiringSoonSeeds.length > 0 ? 'var(--color-warning-dark)' : 'var(--color-text)' }}>{expiringSoonSeeds.length}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Expiring Soon</div>
            </div>
          </div>
        </Card>

        {/* Active Filter Banner */}
        {activeFilter && (
          <div style={{
            padding: '1rem',
            marginBottom: '1.5rem',
            backgroundColor: 'var(--color-primary-light)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong>Filter active:</strong>{' '}
              {activeFilter === 'health' && '⚠️ Health Alerts'}
              {activeFilter === 'watering' && '💧 Smart Watering'}
              {activeFilter === 'harvest' && '🌾 Upcoming Harvests'}
              {activeFilter === 'seeds' && '🌱 Seed Warnings'}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setActiveFilter(null)}>
              Clear Filter ✕
            </Button>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="command-center-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <style>{`
            @media (min-width: 1024px) {
              .command-center-grid {
                grid-template-columns: 2fr 1fr !important;
              }
            }
          `}</style>
          {/* Left Column - Tasks & Plantings */}
          <div>
            {/* Upcoming Tasks */}
            {(!activeFilter || activeFilter === 'watering') && (
              <Card 
                title="📋 Upcoming Tasks"
                style={{ marginBottom: '1.5rem' }}
                actions={
                  <Button variant="link" size="sm" onClick={() => navigate('/tasks')}>
                    View All →
                  </Button>
                }
              >
                {tasks.length === 0 ? (
                  <EmptyState
                    icon="📋"
                    title="No upcoming tasks"
                    description="All caught up! Check back later for new tasks."
                    primaryAction={{
                      label: 'View All Tasks',
                      onClick: () => navigate('/tasks')
                    }}
                  />
                ) : (
                  <div>
                    {tasks
                      .filter(task => !activeFilter || (activeFilter === 'watering' && task.skippedByWeather))
                      .slice(0, 5)
                      .map((task) => (
                        <div key={task.id} style={{
                          padding: '0.75rem',
                          marginBottom: '0.5rem',
                          backgroundColor: task.skippedByWeather ? 'var(--color-info-light)' : 'var(--color-bg-muted)',
                          borderRadius: 'var(--radius-md)',
                          borderLeft: task.skippedByWeather ? '3px solid var(--color-info)' : 'none'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{task.title}</div>
                              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                                {task.planting.crop.name} • {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                              {task.skippedByWeather && (
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-info)', marginTop: '0.25rem' }}>
                                  💧 {task.weatherReason}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate('/tasks')}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    {activeFilter === 'watering' && tasks.filter(t => t.skippedByWeather).length === 0 && (
                      <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>
                        No smart watering adjustments today
                      </p>
                    )}
                  </div>
                )}
              </Card>
            )}

            {/* Plantings by Stage */}
            {(!activeFilter || activeFilter === 'health' || activeFilter === 'harvest') && (
              <Card title="🌿 Plantings by Stage">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                  {Object.entries(stageCounts).map(([stage, stagePlantings]) => {
                    // Filter logic based on active filter
                    let filteredPlantings = stagePlantings;
                    if (activeFilter === 'health') {
                      filteredPlantings = stagePlantings.filter(p => 
                        p.healthStatus === 'struggling' || p.healthStatus === 'diseased'
                      );
                    } else if (activeFilter === 'harvest') {
                      filteredPlantings = stagePlantings.filter(p => stage === 'ready');
                    }

                    // Skip if no plantings after filter
                    if (activeFilter && filteredPlantings.length === 0) return null;

                    const displayCount = activeFilter ? filteredPlantings.length : stagePlantings.length;
                    const isClickable = displayCount > 0;

                    return (
                      <div 
                        key={stage} 
                        style={{
                          padding: '1rem',
                          backgroundColor: 'var(--color-bg-muted)',
                          borderRadius: 'var(--radius-lg)',
                          textAlign: 'center',
                          cursor: isClickable ? 'pointer' : 'default',
                          transition: 'all 0.2s ease',
                          border: activeFilter && filteredPlantings.length > 0 ? '2px solid var(--color-primary)' : '2px solid transparent',
                          opacity: isClickable ? 1 : 0.5
                        }}
                        onClick={() => {
                          if (isClickable) {
                            // Navigate to gardens page to view plantings
                            navigate('/gardens');
                          }
                        }}
                        onMouseEnter={(e) => {
                          if (isClickable) {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.borderColor = 'var(--color-primary)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (isClickable) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = activeFilter && filteredPlantings.length > 0 ? 'var(--color-primary)' : 'transparent';
                          }
                        }}
                        role={isClickable ? "button" : "presentation"}
                        tabIndex={isClickable ? 0 : -1}
                        onKeyDown={(e) => {
                          if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            navigate('/gardens');
                          }
                        }}
                      >
                        <div style={{ fontSize: '2rem' }}>
                          {stage === 'seedling' && '🌱'}
                          {stage === 'vegetative' && '🌿'}
                          {stage === 'flowering' && '🌸'}
                          {stage === 'fruiting' && '🍅'}
                          {stage === 'ready' && '✅'}
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-bold)', margin: '0.5rem 0' }}>
                          {displayCount}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                          {stage}
                        </div>
                        {isClickable && (
                          <div style={{ fontSize: '0.625rem', color: 'var(--color-primary)', marginTop: '0.25rem', opacity: 0.8 }}>
                            Click to view
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {activeFilter === 'health' && healthAlerts.length === 0 && (
                  <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '1rem' }}>
                    No health alerts - all plantings look healthy! 🎉
                  </p>
                )}
                {activeFilter === 'harvest' && upcomingHarvests.length === 0 && (
                  <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '1rem' }}>
                    No harvests ready in the next 2 weeks
                  </p>
                )}
              </Card>
            )}
          </div>

          {/* Right Column - Quick Insights */}
          <div>
            {/* Recent Photos */}
            {!activeFilter && (
              <Card 
                title="📸 Recent Photos"
                style={{ marginBottom: '1.5rem' }}
                actions={
                  <Button variant="link" size="sm" onClick={() => navigate('/timeline')}>
                    View All →
                  </Button>
                }
              >
                {photos.length === 0 ? (
                  <EmptyState
                    icon="📸"
                    title="No photos yet"
                    description="Start capturing your garden's growth journey"
                    primaryAction={{
                      label: 'Go to Timeline',
                      onClick: () => navigate('/timeline')
                    }}
                    secondaryAction={{
                      label: 'View Gardens',
                      onClick: () => navigate('/gardens')
                    }}
                  />
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {photos.map((photo) => (
                      <div key={photo.id} style={{
                        aspectRatio: '1',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'var(--transition-base)'
                      }}
                      onClick={() => navigate('/timeline')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      >
                        <img
                          src={photo.url}
                          alt="Garden"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Seed Inventory Warnings */}
            {(!activeFilter || activeFilter === 'seeds') && (lowStockSeeds.length > 0 || expiringSoonSeeds.length > 0) && (
              <Card
                title="🌱 Seed Warnings"
                style={{ 
                  backgroundColor: activeFilter === 'seeds' ? '#fef3c7' : undefined,
                  borderLeft: activeFilter === 'seeds' ? '4px solid #f59e0b' : undefined
                }}
                actions={
                  <Button variant="link" size="sm" onClick={() => navigate('/seeds')}>
                    Manage Inventory →
                  </Button>
                }
              >
                {lowStockSeeds.length > 0 && (
                  <div style={{ marginBottom: expiringSoonSeeds.length > 0 ? '1rem' : 0 }}>
                    <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-danger)', marginBottom: '0.5rem', fontWeight: 'var(--font-weight-semibold)' }}>
                      ⚠️ Low Stock
                    </h3>
                    {lowStockSeeds.map((seed) => (
                      <div key={seed.id} style={{
                        padding: '0.5rem',
                        backgroundColor: 'var(--color-danger-light)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '0.25rem',
                        fontSize: 'var(--font-size-sm)'
                      }}>
                        <strong>{seed.cropName}:</strong> {seed.quantity} {seed.unit}
                      </div>
                    ))}
                  </div>
                )}
                {expiringSoonSeeds.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-warning-dark)', marginBottom: '0.5rem', fontWeight: 'var(--font-weight-semibold)' }}>
                      🕐 Expiring Soon
                    </h3>
                    {expiringSoonSeeds.map((seed) => (
                      <div key={seed.id} style={{
                        padding: '0.5rem',
                        backgroundColor: 'var(--color-warning-light)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '0.25rem',
                        fontSize: 'var(--font-size-sm)'
                      }}>
                        <strong>{seed.cropName}:</strong> {seed.expirationDate && new Date(seed.expirationDate).toLocaleDateString()}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
}
