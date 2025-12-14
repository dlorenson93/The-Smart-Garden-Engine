import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import { plantingsApi, profileApi, photosApi } from '../lib/api';
import DidYouKnow from '../components/DidYouKnow';
import PhotoUpload from '../components/PhotoUpload';
import PhotoGallery from '../components/PhotoGallery';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

interface Analytics {
  daysSincePlanting: number;
  daysToHarvest: number;
  harvestStatus: 'upcoming' | 'ready' | 'closed';
  growthStage: {
    name: string;
    icon: string;
    percentage: number;
  };
  healthStatus: {
    status: string;
    label: string;
    icon: string;
    color: string;
  };
}

interface FrostAlert {
  type: 'warning' | 'danger';
  message: string;
  date: string;
}

function calculateGrowthStage(plantingDate: Date, harvestStart: Date, harvestEnd: Date): { stage: string; percentage: number } {
  const now = new Date();
  const totalDays = harvestStart.getTime() - plantingDate.getTime();
  const elapsed = now.getTime() - plantingDate.getTime();
  const percentage = Math.min(100, Math.max(0, (elapsed / totalDays) * 100));

  if (now < plantingDate) return { stage: 'Not yet planted', percentage: 0 };
  if (now > harvestEnd) return { stage: 'Harvest complete', percentage: 100 };
  if (now >= harvestStart) return { stage: 'Ready to harvest', percentage: 100 };
  if (percentage < 25) return { stage: 'Seedling', percentage };
  if (percentage < 50) return { stage: 'Vegetative', percentage };
  if (percentage < 75) return { stage: 'Flowering', percentage };
  return { stage: 'Fruiting', percentage };
}

function checkFrostRisk(plantingDate: Date, harvestDate: Date, lastFrost: string | null, firstFrost: string | null): FrostAlert[] {
  const alerts: FrostAlert[] = [];
  const now = new Date();

  if (lastFrost) {
    const lastFrostParts = lastFrost.split(' ');
    const lastFrostDate = new Date(`${lastFrostParts[0]} ${lastFrostParts[1]}, ${now.getFullYear()}`);
    
    if (plantingDate < lastFrostDate) {
      const daysUntil = Math.round((lastFrostDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil > 0 && daysUntil <= 14) {
        alerts.push({
          type: 'danger',
          message: `⚠️ Spring frost expected around ${lastFrost}. Planting may be at risk.`,
          date: lastFrost,
        });
      }
    }
  }

  if (firstFrost) {
    const firstFrostParts = firstFrost.split(' ');
    const firstFrostDate = new Date(`${firstFrostParts[0]} ${firstFrostParts[1]}, ${now.getFullYear()}`);
    
    if (harvestDate > firstFrostDate) {
      const daysUntil = Math.round((firstFrostDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil > 0 && daysUntil <= 30) {
        alerts.push({
          type: 'warning',
          message: `❄️ Fall frost expected around ${firstFrost}. Consider harvesting earlier.`,
          date: firstFrost,
        });
      }
    }
  }

  return alerts;
}

export default function PlantingDetail() {
  const { id } = useParams<{ id: string }>();
  const [planting, setPlanting] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingHealth, setUpdatingHealth] = useState(false);
  const [showHarvestForm, setShowHarvestForm] = useState(false);
  const [harvestForm, setHarvestForm] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    units: 'lbs',
    notes: '',
    surplusFlag: false,
    surplusAmount: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [plantingRes, profileRes, photosRes] = await Promise.all([
        plantingsApi.get(id!),
        profileApi.get(),
        photosApi.getAll({ plantingId: id! }),
      ]);
      setPlanting(plantingRes.data);
      setProfile(profileRes.data);
      setPhotos(photosRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHarvestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await plantingsApi.logHarvest(id!, {
        ...harvestForm,
        amount: parseFloat(harvestForm.amount),
        surplusAmount: harvestForm.surplusAmount
          ? parseFloat(harvestForm.surplusAmount)
          : undefined,
      });
      setHarvestForm({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        units: 'lbs',
        notes: '',
        surplusFlag: false,
        surplusAmount: '',
      });
      setShowHarvestForm(false);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to log harvest');
    }
  };

  const handleHealthStatusChange = async (newStatus: string) => {
    setUpdatingHealth(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/plantings/${id}/health`,
        { healthStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to update health status');
    } finally {
      setUpdatingHealth(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading planting...</div>
      </Layout>
    );
  }

  if (!planting) {
    return (
      <Layout>
        <div className="error">Planting not found</div>
      </Layout>
    );
  }

  const today = new Date();
  const plantingDate = new Date(planting.plantingDate);
  const harvestStart = new Date(planting.expectedHarvestStart);
  const harvestEnd = new Date(planting.expectedHarvestEnd);
  const isHarvestTime = today >= harvestStart && today <= harvestEnd;

  // Calculate growth stage
  const { stage, percentage } = calculateGrowthStage(plantingDate, harvestStart, harvestEnd);

  // Check frost risks
  const frostAlerts = profile ? checkFrostRisk(
    plantingDate,
    harvestEnd,
    profile.lastFrostDate,
    profile.firstFrostDate
  ) : [];

  // Calculate expected yield
  const expectedYield = planting.quantity * (planting.crop.yieldPerPlant || 1);

  return (
    <Layout>
      <BackButton to={`/beds/${planting.bed.id}`} label={`Back to ${planting.bed.name}`} />

      <div style={{ margin: '1rem 0' }}>
        <h1>{planting.crop.name}</h1>
        {planting.variety && (
          <p style={{ fontSize: '1.125rem', color: '#6b7280', fontStyle: 'italic', margin: '0.5rem 0' }}>
            Variety: {planting.variety}
          </p>
        )}
        <p>
          <span className={`badge ${planting.crop.difficulty}`}>
            {planting.crop.difficulty}
          </span>
          <span className="badge">{planting.crop.category}</span>
        </p>
        <p>
          <strong>Location:</strong> {planting.garden.name} → {planting.bed.name}
        </p>
      </div>

      {/* Plant Analytics Section */}
      {planting.analytics && (
        <div className="card" style={{ marginBottom: '1rem', backgroundColor: '#f0fdf4', border: '2px solid #10b981' }}>
          <h2 style={{ marginTop: 0, color: '#059669' }}>📊 Plant Analytics</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {/* Days Since Planting */}
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Days Growing</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                {planting.analytics.daysSincePlanting}
              </div>
            </div>

            {/* Days to Harvest */}
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Est. Harvest</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: planting.analytics.harvestStatus === 'ready' ? '#10b981' : '#059669' }}>
                {planting.analytics.harvestStatus === 'ready' ? '✅ Ready!' :
                 planting.analytics.harvestStatus === 'closed' ? '🚫 Closed' :
                 `In ${planting.analytics.daysToHarvest} days`}
              </div>
            </div>

            {/* Growth Stage */}
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Growth Stage</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {planting.analytics.growthStage.icon} {planting.analytics.growthStage.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {Math.round(planting.analytics.growthStage.percentage)}% complete
              </div>
            </div>

            {/* Health Status */}
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Health Status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{planting.analytics.healthStatus.icon}</span>
                <select
                  value={planting.analytics.healthStatus.status}
                  onChange={(e) => handleHealthStatusChange(e.target.value)}
                  disabled={updatingHealth}
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem',
                    color: planting.analytics.healthStatus.color,
                    fontWeight: '600',
                  }}
                >
                  <option value="healthy">🟢 Healthy</option>
                  <option value="needs_water">🔵 Needs Water</option>
                  <option value="needs_fertilizing">🟡 Needs Fertilizing</option>
                  <option value="stressed">🔴 Stressed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sunlight & Next Task */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #d1f2eb' }}>
            {/* Sunlight */}
            {planting.sunlightInfo && (
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Sunlight Exposure</div>
                <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                  {planting.sunlightInfo.icon} {planting.sunlightInfo.exposure}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {planting.sunlightInfo.estimate}
                </div>
              </div>
            )}

            {/* Next Task */}
            {planting.nextTask ? (
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Next Task</div>
                <Link to="/tasks" style={{ fontSize: '1rem', fontWeight: '600', color: '#059669', textDecoration: 'none' }}>
                  {planting.nextTask.title}
                </Link>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Due: {new Date(planting.nextTask.dueDate).toLocaleDateString()}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Next Task</div>
                <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>No upcoming tasks</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Companion Planting */}
      {(planting.crop.companions || planting.crop.avoid) && (
        <div className="card" style={{ marginBottom: '1rem', backgroundColor: '#f0fdf4', border: '2px solid #10b981' }}>
          <h3 style={{ marginTop: 0, color: '#059669' }}>
            🌿 Companion Planting
          </h3>
          
          {planting.crop.companions && planting.crop.companions !== 'none' && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#059669' }}>
                ✓ Good Companions:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {planting.crop.companions.split(',').map((companion: string) => (
                  <span key={companion} style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#d1fae5',
                    color: '#065f46',
                    borderRadius: '16px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {companion.trim()}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', marginBottom: 0 }}>
                These plants grow well together and can help each other thrive
              </p>
            </div>
          )}
          
          {planting.crop.avoid && planting.crop.avoid !== 'none' && (
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#dc2626' }}>
                ⚠️ Avoid Planting Near:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {planting.crop.avoid.split(',').map((avoid: string) => (
                  <span key={avoid} style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    borderRadius: '16px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {avoid.trim()}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', marginBottom: 0 }}>
                These plants may compete for resources or attract pests
              </p>
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <p>
          <strong>Planted:</strong>{' '}
          {plantingDate.toLocaleDateString()}
        </p>
        <p>
          <strong>Expected Harvest:</strong>{' '}
          {harvestStart.toLocaleDateString()} - {harvestEnd.toLocaleDateString()}
          {isHarvestTime && ' 🎉 Ready to harvest!'}
        </p>
        <p>
          <strong>Quantity:</strong> {planting.quantity}
        </p>
        <p>
          <strong>Expected Yield:</strong> {expectedYield.toFixed(1)} {planting.crop.yieldUnit || 'lbs'}
        </p>
      </div>

      {/* Growth Stage Indicator */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ marginTop: 0 }}>Growth Stage: {stage}</h3>
        <div style={{ 
          width: '100%', 
          height: '24px', 
          backgroundColor: '#e5e7eb', 
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: percentage === 100 ? '#10b981' : '#3b82f6',
            transition: 'width 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            {percentage.toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <h2>Tasks ({planting.tasks?.length || 0})</h2>
          
          {/* Frost Alerts */}
          {frostAlerts.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              {frostAlerts.map((alert, idx) => (
                <div 
                  key={idx}
                  style={{ 
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    borderRadius: '0.5rem',
                    backgroundColor: alert.type === 'danger' ? '#fee2e2' : '#fef3c7',
                    border: `1px solid ${alert.type === 'danger' ? '#ef4444' : '#f59e0b'}`,
                  }}
                >
                  {alert.message}
                </div>
              ))}
            </div>
          )}
          
          {planting.tasks?.length === 0 ? (
            <p>No tasks</p>
          ) : (
            <div>
              {planting.tasks.slice(0, 5).map((task: any) => (
                <div
                  key={task.id}
                  className={`task-item ${task.completed ? 'completed' : ''}`}
                  style={{ marginBottom: '0.5rem' }}
                >
                  <div>
                    <strong>{task.title}</strong>
                    <br />
                    <small>
                      {task.completed ? '✓ Completed' : new Date(task.dueDate).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link to="/tasks">
            <button className="btn-secondary mt-1">View All Tasks</button>
          </Link>
        </div>

        <div className="card">
          <div className="flex justify-between" style={{ alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Harvests ({planting.harvestLogs?.length || 0})</h2>
            <button onClick={() => setShowHarvestForm(!showHarvestForm)}>
              {showHarvestForm ? 'Cancel' : '+ Log Harvest'}
            </button>
          </div>

          {showHarvestForm && (
            <form onSubmit={handleHarvestSubmit} style={{ marginBottom: '1rem' }}>
              {error && <div className="error">{error}</div>}
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  value={harvestForm.date}
                  onChange={(e) =>
                    setHarvestForm({ ...harvestForm, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <div className="flex gap-1">
                  <input
                    id="amount"
                    type="number"
                    step="0.1"
                    value={harvestForm.amount}
                    onChange={(e) =>
                      setHarvestForm({ ...harvestForm, amount: e.target.value })
                    }
                    required
                    style={{ flex: 2 }}
                  />
                  <select
                    value={harvestForm.units}
                    onChange={(e) =>
                      setHarvestForm({ ...harvestForm, units: e.target.value })
                    }
                    style={{ flex: 1 }}
                  >
                    <option value="lbs">lbs</option>
                    <option value="kg">kg</option>
                    <option value="pieces">pieces</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={harvestForm.surplusFlag}
                    onChange={(e) =>
                      setHarvestForm({
                        ...harvestForm,
                        surplusFlag: e.target.checked,
                      })
                    }
                  />{' '}
                  I have surplus to share/sell
                </label>
              </div>
              {harvestForm.surplusFlag && (
                <div className="form-group">
                  <label htmlFor="surplusAmount">Surplus Amount</label>
                  <input
                    id="surplusAmount"
                    type="number"
                    step="0.1"
                    value={harvestForm.surplusAmount}
                    onChange={(e) =>
                      setHarvestForm({
                        ...harvestForm,
                        surplusAmount: e.target.value,
                      })
                    }
                  />
                </div>
              )}
              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  value={harvestForm.notes}
                  onChange={(e) =>
                    setHarvestForm({ ...harvestForm, notes: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <button type="submit">Log Harvest</button>
            </form>
          )}

          {planting.harvestLogs?.length === 0 ? (
            <p>No harvests logged yet</p>
          ) : (
            <div>
              {planting.harvestLogs.map((log: any) => (
                <div key={log.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #ddd' }}>
                  <strong>{new Date(log.date).toLocaleDateString()}</strong>
                  <br />
                  <span>
                    {log.amount} {log.units}
                  </span>
                  {log.surplusFlag && (
                    <>
                      <br />
                      <span className="badge">
                        Surplus: {log.surplusAmount || log.amount} {log.units}
                      </span>
                    </>
                  )}
                  {log.notes && (
                    <>
                      <br />
                      <small>{log.notes}</small>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Photo Journal */}
      <div className="card">
        <div className="card-header" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>📸 Photo Journal</h2>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.875rem' }}>
            Document your plant's growth with photos
          </p>
        </div>
        <div className="card-body">
          <PhotoUpload 
            plantingId={id!} 
            onPhotoAdded={loadData}
          />
          
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Gallery</h3>
            <PhotoGallery 
              photos={photos} 
              onPhotoDeleted={loadData}
            />
          </div>
        </div>
      </div>

      <DidYouKnow />
    </Layout>
  );
}
