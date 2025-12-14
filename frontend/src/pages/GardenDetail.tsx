import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import GardenLayout from '../components/GardenLayout';
import AIAssistant from '../components/AIAssistant';
import GardenTab from '../components/dashboard/GardenTab';
import { gardensApi } from '../lib/api';

export default function GardenDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [garden, setGarden] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'beds' | 'layout' | 'ai'>('overview');
  const [showForm, setShowForm] = useState(false);
  const [bedForm, setBedForm] = useState({
    name: '',
    length: '',
    width: '',
    sunExposure: 'full',
    notes: '',
  });
  const [bedNamePreset, setBedNamePreset] = useState('');
  const [customBedName, setCustomBedName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadGarden();
  }, [id]);

  const loadGarden = async () => {
    try {
      const response = await gardensApi.get(id!);
      setGarden(response.data);
    } catch (error) {
      console.error('Error loading garden:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Determine final bed name based on preset or custom input
    const finalBedName = bedNamePreset === 'Other (Custom)' ? customBedName.trim() : bedNamePreset;
    
    if (!finalBedName) {
      setError('Please select a bed name or enter a custom name');
      return;
    }

    try {
      await gardensApi.createBed(id!, {
        ...bedForm,
        name: finalBedName,
        length: parseFloat(bedForm.length),
        width: parseFloat(bedForm.width),
      });
      setBedForm({ name: '', length: '', width: '', sunExposure: 'full', notes: '' });
      setBedNamePreset('');
      setCustomBedName('');
      setShowForm(false);
      loadGarden();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create bed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this garden?')) {
      return;
    }

    try {
      await gardensApi.delete(id!);
      navigate('/gardens');
    } catch (error) {
      console.error('Error deleting garden:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading garden...</div>
      </Layout>
    );
  }

  if (!garden) {
    return (
      <Layout>
        <div className="error">Garden not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <BackButton to="/gardens" label="Back to Gardens" />

      <div className="flex justify-between" style={{ alignItems: 'center', margin: '1rem 0' }}>
        <div>
          <h1>{garden.name}</h1>
          {garden.description && <p>{garden.description}</p>}
        </div>
        <button className="btn-danger" onClick={handleDelete}>
          Delete Garden
        </button>
      </div>

      {/* Garden Health Section */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>🌱 Garden Health</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
          <Link to={`/gardens/${id}/soil`} style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: 'var(--color-bg-muted)',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid transparent',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)';
            }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌍</div>
              <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text)' }}>Soil Intelligence</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                View soil health & data
              </div>
            </div>
          </Link>
          <Link to="/seeds" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: 'var(--color-bg-muted)',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid transparent',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)';
            }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌰</div>
              <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text)' }}>Seed Inventory</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                Manage your seeds
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        <button
          className={activeTab === 'overview' ? 'tab-active' : 'tab'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'beds' ? 'tab-active' : 'tab'}
          onClick={() => setActiveTab('beds')}
        >
          Beds List
        </button>
        <button
          className={activeTab === 'layout' ? 'tab-active' : 'tab'}
          onClick={() => setActiveTab('layout')}
        >
          Garden Layout
        </button>
        <button
          className={activeTab === 'ai' ? 'tab-active' : 'tab'}
          onClick={() => setActiveTab('ai')}
        >
          AI Assistant
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && <GardenTab />}

      {/* Beds Tab */}
      {activeTab === 'beds' && (
        <>
          <div className="flex justify-between" style={{ alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Beds ({garden.beds?.length || 0})</h2>
            <button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ New Bed'}
            </button>
          </div>

          {showForm && (
            <div className="card">
              <h3>Create New Bed</h3>
              {error && <div className="error">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="bedNamePreset">Bed Name</label>
                  <select
                    id="bedNamePreset"
                    value={bedNamePreset}
                    onChange={(e) => {
                      setBedNamePreset(e.target.value);
                      if (e.target.value !== 'Other (Custom)') {
                        setCustomBedName('');
                      }
                    }}
                    required
                    aria-describedby="bedNamePresetHelper"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      fontSize: '1rem',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <option value="">Select a bed name/type…</option>
                    <option value="Bed 1">Bed 1</option>
                    <option value="Bed 2">Bed 2</option>
                    <option value="Bed 3">Bed 3</option>
                    <option value="Raised Bed">Raised Bed</option>
                    <option value="Container">Container</option>
                    <option value="Herb Bed">Herb Bed</option>
                    <option value="Salad Greens">Salad Greens</option>
                    <option value="Tomatoes">Tomatoes</option>
                    <option value="Peppers">Peppers</option>
                    <option value="Flowers">Flowers</option>
                    <option value="Nursery">Nursery</option>
                    <option value="Test Plot">Test Plot</option>
                    <option value="Compost Area">Compost Area</option>
                    <option value="Other (Custom)">Other (Custom)</option>
                  </select>
                  <div 
                    id="bedNamePresetHelper"
                    style={{
                      fontSize: '0.875rem',
                      color: '#666',
                      marginTop: '0.25rem'
                    }}
                  >
                    Pick a preset to keep bed names consistent (choose Other to customize).
                  </div>
                  
                  {bedNamePreset === 'Other (Custom)' && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <label htmlFor="customBedName" style={{
                        display: 'block',
                        marginBottom: '0.25rem',
                        fontWeight: '500',
                        fontSize: '0.875rem'
                      }}>
                        Custom Bed Name
                      </label>
                      <input
                        id="customBedName"
                        type="text"
                        value={customBedName}
                        onChange={(e) => setCustomBedName(e.target.value)}
                        required
                        placeholder="Enter your custom bed name"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="length">Length (ft)</label>
                    <input
                      id="length"
                      type="number"
                      step="0.1"
                      value={bedForm.length}
                      onChange={(e) => setBedForm({ ...bedForm, length: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="width">Width (ft)</label>
                    <input
                      id="width"
                      type="number"
                      step="0.1"
                      value={bedForm.width}
                      onChange={(e) => setBedForm({ ...bedForm, width: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="sunExposure">Sun Exposure</label>
                  <select
                    id="sunExposure"
                    value={bedForm.sunExposure}
                    onChange={(e) => setBedForm({ ...bedForm, sunExposure: e.target.value })}
                  >
                    <option value="full">Full Sun</option>
                    <option value="partial">Partial Sun</option>
                    <option value="shade">Shade</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="notes">Notes (optional)</label>
                  <textarea
                    id="notes"
                    value={bedForm.notes}
                    onChange={(e) => setBedForm({ ...bedForm, notes: e.target.value })}
                    rows={2}
                  />
                </div>
                <button type="submit">Create Bed</button>
              </form>
            </div>
          )}

          {garden.beds?.length === 0 ? (
            <div className="card text-center">
              <h3>No beds yet</h3>
              <p>Add a bed to start planting!</p>
              <button onClick={() => setShowForm(true)}>Create Bed</button>
            </div>
          ) : (
            <div className="card-grid">
              {garden.beds?.map((bed: any) => (
                <div key={bed.id} className="card">
                  <h3>{bed.name}</h3>
                  <p>
                    <strong>Size:</strong> {bed.length} × {bed.width} ft
                  </p>
                  <p>
                    <strong>Sun:</strong> {bed.sunExposure}
                  </p>
                  <p>
                    <strong>Plantings:</strong> {bed._count?.plantings || 0}
                  </p>
                  {bed.notes && <p><small>{bed.notes}</small></p>}
                  <Link to={`/beds/${bed.id}`}>
                    <button style={{ width: '100%' }}>View & Add Plantings</button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Layout Tab */}
      {activeTab === 'layout' && (
        <div className="card">
          <GardenLayout gardenId={id!} />
        </div>
      )}

      {/* AI Assistant Tab */}
      {activeTab === 'ai' && (
        <div className="card">
          <AIAssistant gardenId={id!} />
        </div>
      )}

      <style>{`
        .tabs {
          display: flex;
          gap: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .tab, .tab-active {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.2s;
        }

        .tab:hover {
          color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }

        .tab-active {
          color: #10b981;
          border-bottom-color: #10b981;
        }
      `}</style>
    </Layout>
  );
}
