import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { gardensApi } from '../lib/api';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';

export default function Gardens() {
  const navigate = useNavigate();
  const [gardens, setGardens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [namePreset, setNamePreset] = useState('');
  const [customName, setCustomName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadGardens();
  }, []);

  const loadGardens = async () => {
    try {
      const response = await gardensApi.getAll();
      setGardens(response.data);
    } catch (error) {
      console.error('Error loading gardens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Determine final name based on preset or custom input
    const finalName = namePreset === 'Other (Custom)' ? customName.trim() : namePreset;
    
    if (!finalName) {
      setError('Please select a garden type or enter a custom name');
      return;
    }

    try {
      const response = await gardensApi.create({ name: finalName, description });
      setName('');
      setNamePreset('');
      setCustomName('');
      setDescription('');
      setShowForm(false);
      loadGardens();
    } catch (err: any) {
      console.error('Error creating garden:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error message:', err.message);
      const errorMsg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to create garden';
      setError(errorMsg);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading gardens...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ position: 'relative' }}>
        {/* Subtle vineyard background overlay */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '300px',
          backgroundImage: 'url(/images/vineyard.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.03,
          pointerEvents: 'none',
          zIndex: 0
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
      <PageHeader
        title="My Gardens"
        description="Manage your garden spaces, beds, and plantings"
        actions={
          <Button
            variant={showForm ? 'ghost' : 'primary'}
            leftIcon={showForm ? undefined : '+'} 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'New Garden'}
          </Button>
        }
      />

      {showForm && (
        <Card title="Create New Garden" style={{ marginBottom: 'var(--space-6)' }}>
          {error && (
            <div style={{
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: 'var(--color-danger-light)',
              color: 'var(--color-danger-dark)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-4)',
              fontSize: 'var(--text-sm)'
            }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label htmlFor="namePreset" style={{
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontWeight: 'var(--font-medium)',
                fontSize: 'var(--text-sm)'
              }}>
                Garden Name
              </label>
              <select
                id="namePreset"
                value={namePreset}
                onChange={(e) => {
                  setNamePreset(e.target.value);
                  if (e.target.value !== 'Other (Custom)') {
                    setCustomName('');
                  }
                }}
                required
                aria-describedby="namePresetHelper"
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: 'var(--text-base)',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                <option value="">Select a garden type/name…</option>
                <option value="Home">Home</option>
                <option value="Backyard">Backyard</option>
                <option value="Front Yard">Front Yard</option>
                <option value="Balcony">Balcony</option>
                <option value="Patio">Patio</option>
                <option value="Raised Beds">Raised Beds</option>
                <option value="Greenhouse">Greenhouse</option>
                <option value="Community Garden">Community Garden</option>
                <option value="Indoor Herb Garden">Indoor Herb Garden</option>
                <option value="Rooftop">Rooftop</option>
                <option value="Other (Custom)">Other (Custom)</option>
              </select>
              <div 
                id="namePresetHelper"
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--space-2)'
                }}
              >
                Pick a preset to keep names consistent (you can choose Other to customize).
              </div>
              
              {namePreset === 'Other (Custom)' && (
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <label htmlFor="customName" style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 'var(--font-medium)',
                    fontSize: 'var(--text-sm)'
                  }}>
                    Custom Garden Name
                  </label>
                  <input
                    id="customName"
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required
                    placeholder="Enter your custom garden name"
                    style={{
                      width: '100%',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: 'var(--text-base)'
                    }}
                  />
                </div>
              )}
            </div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label htmlFor="description" style={{
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontWeight: 'var(--font-medium)',
                fontSize: 'var(--text-sm)'
              }}>
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: 'var(--text-base)',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
            <Button type="submit" variant="primary" size="lg" fullWidth>
              Create Garden
            </Button>
          </form>
        </Card>
      )}

      {gardens.length === 0 ? (
        <EmptyState
          icon="🪴"
          title="No gardens yet"
          description="Create your first garden space to start planning beds and plantings. Gardens help you organize your growing areas and track what you're planting."
          primaryAction={{
            label: 'Create Your First Garden',
            onClick: () => setShowForm(true)
          }}
          exampleHint="Gardens can represent different areas like backyard, front yard, or community plot"
        />
      ) : (
        <div className="gardens-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: 'var(--space-6)'
        }}>
          {gardens.map((garden) => (
            <Card
              key={garden.id}
              title={garden.name}
              subtitle={garden.description}
              onClick={() => navigate(`/gardens/${garden.id}`)}
              variant="default"
            >
              <div style={{
                display: 'flex',
                gap: 'var(--space-6)',
                marginBottom: 'var(--space-4)'
              }}>
                <div>
                  <div style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--color-primary)'
                  }}>
                    {garden.beds?.length || 0}
                  </div>
                  <div className="muted">Beds</div>
                </div>
                <div>
                  <div style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--color-accent)'
                  }}>
                    {garden._count?.plantings || 0}
                  </div>
                  <div className="muted">Plantings</div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="md" 
                fullWidth
                onClick={() => navigate(`/gardens/${garden.id}`)}
              >
                View Details →
              </Button>
            </Card>
          ))}
        </div>
      )}
        </div>
      </div>
    </Layout>
  );
}
