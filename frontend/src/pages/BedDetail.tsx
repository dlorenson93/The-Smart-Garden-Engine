import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import { bedsApi, cropsApi, plantingsApi } from '../lib/api';

export default function BedDetail() {
  const { id } = useParams<{ id: string }>();
  const [bed, setBed] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [allCrops, setAllCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [plantingForm, setPlantingForm] = useState({
    cropId: '',
    variety: '',
    plantingDate: new Date().toISOString().split('T')[0],
    quantity: '1',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadBed();
    loadRecommendations();
    loadAllCrops();
  }, [id]);

  const loadBed = async () => {
    try {
      const response = await bedsApi.get(id!);
      setBed(response.data);
    } catch (error) {
      console.error('Error loading bed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const response = await cropsApi.getRecommendations(id!);
      console.log('Loaded recommendations:', response.data);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setRecommendations(null);
    }
  };

  const loadAllCrops = async () => {
    try {
      const response = await cropsApi.getAll();
      console.log('Loaded crops:', response.data);
      setAllCrops(response.data || []);
    } catch (error) {
      console.error('Error loading crops:', error);
      setAllCrops([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await plantingsApi.create({
        gardenId: bed.garden.id,
        bedId: id!,
        cropId: plantingForm.cropId,
        variety: plantingForm.variety || undefined,
        plantingDate: plantingForm.plantingDate,
        quantity: parseInt(plantingForm.quantity),
      });
      setPlantingForm({
        cropId: '',
        variety: '',
        plantingDate: new Date().toISOString().split('T')[0],
        quantity: '1',
      });
      setShowForm(false);
      loadBed();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create planting');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading bed...</div>
      </Layout>
    );
  }

  if (!bed) {
    return (
      <Layout>
        <div className="error">Bed not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <BackButton to={`/gardens/${bed.garden.id}`} label={`Back to ${bed.garden.name}`} />

      <div style={{ margin: '1rem 0' }}>
        <h1>{bed.name}</h1>
        <p>
          <strong>Garden:</strong> {bed.garden.name} | <strong>Size:</strong>{' '}
          {bed.length} × {bed.width} ft | <strong>Sun:</strong> {bed.sunExposure}
        </p>
        {bed.notes && <p>{bed.notes}</p>}
      </div>

      <div className="flex justify-between" style={{ alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Plantings ({bed.plantings?.length || 0})</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Planting'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>Add Planting</h3>
          {recommendations && recommendations.recommendations && (
            <p style={{ marginBottom: '1rem' }}>
              <small>
                Showing crops recommended for{' '}
                <strong>{bed.sunExposure} sun</strong> and your{' '}
                <strong>{recommendations.userExperienceLevel}</strong> experience
                level ({recommendations.recommendations.length} crops available)
              </small>
            </p>
          )}
          {!recommendations?.recommendations && allCrops.length > 0 && (
            <p style={{ marginBottom: '1rem' }}>
              <small>
                Showing all available crops ({allCrops.length} crops)
              </small>
            </p>
          )}
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="cropId">Crop</label>
              <select
                id="cropId"
                value={plantingForm.cropId}
                onChange={(e) =>
                  setPlantingForm({ ...plantingForm, cropId: e.target.value })
                }
                required
              >
                <option value="">Select a crop...</option>
                {(recommendations?.recommendations || allCrops).map((crop: any) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name} ({crop.category}) - {crop.daysToMaturity} days - {crop.difficulty}
                  </option>
                ))}
              </select>
              {(recommendations?.recommendations || allCrops).length === 0 && (
                <small style={{ color: '#dc2626', fontSize: '0.875rem' }}>
                  ⚠️ No crops available. Make sure crops are seeded in the database.
                </small>
              )}
              {(recommendations?.recommendations || allCrops).length > 0 && (
                <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  {recommendations?.recommendations ? '✓ Showing recommended crops' : `${allCrops.length} crops available`}
                </small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="variety">Variety (Optional)</label>
              <input
                id="variety"
                type="text"
                placeholder="e.g., Cherry, Beefsteak, Roma"
                value={plantingForm.variety}
                onChange={(e) =>
                  setPlantingForm({ ...plantingForm, variety: e.target.value })
                }
              />
              <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Specify the variety if you want to track different types (e.g., "Cherry Tomato")
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="plantingDate">Planting Date</label>
              <input
                id="plantingDate"
                type="date"
                value={plantingForm.plantingDate}
                onChange={(e) =>
                  setPlantingForm({ ...plantingForm, plantingDate: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={plantingForm.quantity}
                onChange={(e) =>
                  setPlantingForm({ ...plantingForm, quantity: e.target.value })
                }
                required
              />
            </div>
            <button type="submit">Create Planting</button>
          </form>
        </div>
      )}

      {bed.plantings?.length === 0 ? (
        <div className="card text-center">
          <h3>No plantings yet</h3>
          <p>Add your first planting to this bed!</p>
          <button onClick={() => setShowForm(true)}>Add Planting</button>
        </div>
      ) : (
        <div className="card-grid">
          {bed.plantings?.map((planting: any) => {
            const analytics = planting.analytics;
            const today = new Date();
            const harvestStart = new Date(planting.expectedHarvestStart);
            const isReady = analytics && analytics.harvestStatus === 'ready';
            
            return (
              <div key={planting.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{planting.crop.name}</h3>
                    {planting.variety && (
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>
                        {planting.variety}
                      </p>
                    )}
                  </div>
                  {analytics && (
                    <span style={{ fontSize: '1.5rem' }}>{analytics.growthStage.icon}</span>
                  )}
                </div>
                
                <p style={{ margin: '0.5rem 0' }}>
                  <span className={`badge ${planting.crop.difficulty}`}>
                    {planting.crop.difficulty}
                  </span>
                  <span className="badge">{planting.crop.category}</span>
                  {isReady && <span className="badge" style={{ backgroundColor: '#10b981', color: 'white' }}>Ready!</span>}
                </p>

                {/* Analytics Summary */}
                {analytics && (
                  <div style={{ 
                    backgroundColor: '#f9fafb', 
                    padding: '0.75rem', 
                    borderRadius: '6px', 
                    margin: '0.75rem 0',
                    fontSize: '0.875rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#6b7280' }}>🌱 {analytics.daysSincePlanting} days</span>
                      <span style={{ color: analytics.healthStatus.color, fontWeight: '600' }}>
                        {analytics.healthStatus.icon} {analytics.healthStatus.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {analytics.growthStage.name} • {Math.round(analytics.growthStage.percentage)}%
                    </div>
                    {analytics.harvestStatus === 'upcoming' && (
                      <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem' }}>
                        Harvest in {analytics.daysToHarvest} days
                      </div>
                    )}
                  </div>
                )}

                {/* Standard Info */}
                <p style={{ fontSize: '0.875rem', margin: '0.5rem 0' }}>
                  <strong>Planted:</strong> {new Date(planting.plantingDate).toLocaleDateString()}
                </p>
                <p style={{ fontSize: '0.875rem', margin: '0.5rem 0' }}>
                  <strong>Quantity:</strong> {planting.quantity}
                </p>

                {/* Next Task */}
                {planting.nextTask && (
                  <div style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.5rem', 
                    backgroundColor: '#fef3c7', 
                    borderRadius: '4px',
                    marginTop: '0.5rem'
                  }}>
                    <strong>Next:</strong> {planting.nextTask.title} <br/>
                    <span style={{ color: '#92400e' }}>
                      {new Date(planting.nextTask.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <Link to={`/plantings/${planting.id}`}>
                  <button style={{ width: '100%', marginTop: '0.5rem' }}>View Details</button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
