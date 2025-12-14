import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import { seedsApi } from '../lib/api';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';

interface Seed {
  id: string;
  cropName: string;
  variety?: string;
  quantity: number;
  unit: string;
  source?: string;
  purchaseDate?: string;
  expirationDate?: string;
  notes?: string;
  createdAt: string;
}

export default function SeedsInventory() {
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSeed, setEditingSeed] = useState<Seed | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    cropName: '',
    variety: '',
    quantity: '',
    unit: 'packets',
    source: '',
    purchaseDate: '',
    expirationDate: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSeeds();
  }, []);

  const loadSeeds = async () => {
    try {
      const response = await seedsApi.getAll();
      setSeeds(response.data);
    } catch (error) {
      console.error('Error loading seeds:', error);
      setError('Failed to load seed inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingSeed) {
        await seedsApi.update(editingSeed.id, {
          cropName: form.cropName,
          variety: form.variety || undefined,
          quantity: parseInt(form.quantity),
          unit: form.unit as 'packets' | 'seeds' | 'grams' | 'oz',
          source: form.source || undefined,
          purchaseDate: form.purchaseDate || undefined,
          expirationDate: form.expirationDate || undefined,
          notes: form.notes || undefined,
        });
        setSuccess('Seed entry updated successfully!');
      } else {
        await seedsApi.create({
          cropName: form.cropName,
          variety: form.variety || undefined,
          quantity: parseInt(form.quantity),
          unit: form.unit as 'packets' | 'seeds' | 'grams' | 'oz',
          source: form.source || undefined,
          purchaseDate: form.purchaseDate || undefined,
          expirationDate: form.expirationDate || undefined,
          notes: form.notes || undefined,
        });
        setSuccess('Seed entry added successfully!');
      }

      resetForm();
      loadSeeds();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to save seed entry');
    }
  };

  const handleEdit = (seed: Seed) => {
    setEditingSeed(seed);
    setForm({
      cropName: seed.cropName,
      variety: seed.variety || '',
      quantity: seed.quantity.toString(),
      unit: seed.unit,
      source: seed.source || '',
      purchaseDate: seed.purchaseDate ? seed.purchaseDate.split('T')[0] : '',
      expirationDate: seed.expirationDate ? seed.expirationDate.split('T')[0] : '',
      notes: seed.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this seed entry?')) return;

    try {
      await seedsApi.delete(id);
      setSuccess('Seed entry deleted');
      loadSeeds();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to delete seed entry');
    }
  };

  const handleUse = async (id: string, currentQuantity: number) => {
    const amount = prompt('How many to use?', '1');
    if (!amount) return;

    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid positive number');
      return;
    }

    if (numAmount > currentQuantity) {
      alert('Not enough seeds in inventory');
      return;
    }

    try {
      await seedsApi.use(id, numAmount);
      setSuccess(`Used ${numAmount} seeds`);
      loadSeeds();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to update quantity');
    }
  };

  const resetForm = () => {
    setForm({
      cropName: '',
      variety: '',
      quantity: '',
      unit: 'packets',
      source: '',
      purchaseDate: '',
      expirationDate: '',
      notes: '',
    });
    setEditingSeed(null);
    setShowForm(false);
  };

  const filteredSeeds = seeds.filter((seed) =>
    seed.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (seed.variety && seed.variety.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isExpiringSoon = (expirationDate?: string) => {
    if (!expirationDate) return false;
    const exp = new Date(expirationDate);
    const now = new Date();
    const daysUntilExpiration = Math.floor((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 90 && daysUntilExpiration >= 0;
  };

  const isExpired = (expirationDate?: string) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

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
      <PageHeader
        title="🌱 Seed Inventory"
        description="Track seed packets so we can warn you before they expire"
        actions={
          <Button
            variant={showForm ? 'ghost' : 'primary'}
            leftIcon={showForm ? undefined : '+'}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add Seeds'}
          </Button>
        }
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {error && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#d1fae5',
            color: '#065f46',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            {success}
          </div>
        )}

        {showForm && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">
              <h2>{editingSeed ? 'Edit Seed Entry' : 'Add New Seed Entry'}</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="cropName">Crop Name *</label>
                    <input
                      id="cropName"
                      type="text"
                      value={form.cropName}
                      onChange={(e) => setForm({ ...form, cropName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="variety">Variety</label>
                    <input
                      id="variety"
                      type="text"
                      value={form.variety}
                      onChange={(e) => setForm({ ...form, variety: e.target.value })}
                      placeholder="e.g., Cherry, Beefsteak"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="quantity">Quantity *</label>
                    <input
                      id="quantity"
                      type="number"
                      min="0"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="unit">Unit</label>
                    <select
                      id="unit"
                      value={form.unit}
                      onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    >
                      <option value="packets">📦 Packets</option>
                      <option value="seeds">🌱 Seeds</option>
                      <option value="grams">⚖️ Grams</option>
                      <option value="oz">⚖️ Ounces</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="source">Source</label>
                    <input
                      id="source"
                      type="text"
                      value={form.source}
                      onChange={(e) => setForm({ ...form, source: e.target.value })}
                      placeholder="e.g., Local nursery, Online"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="purchaseDate">Purchase Date</label>
                    <input
                      id="purchaseDate"
                      type="date"
                      value={form.purchaseDate}
                      onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="expirationDate">Expiration Date</label>
                    <input
                      id="expirationDate"
                      type="date"
                      value={form.expirationDate}
                      onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                    placeholder="Any additional notes..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit">
                    {editingSeed ? 'Update Entry' : 'Add Entry'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{
                      backgroundColor: '#6b7280',
                      color: 'white'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-body">
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="🔍 Search by crop name or variety..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
            </div>

            {filteredSeeds.length === 0 ? (
              searchTerm ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-gray-500)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🔍</div>
                  <p>No seeds found matching "{searchTerm}"</p>
                </div>
              ) : (
                <EmptyState
                  icon="🌱"
                  title="No seeds in inventory"
                  description="Track seed packets so we can warn you before they expire and help you plan your plantings."
                  primaryAction={{
                    label: 'Add Seeds',
                    onClick: () => setShowForm(true)
                  }}
                  exampleHint="Track varieties, quantities, purchase dates, and expiration dates"
                />
              )
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Crop</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Variety</th>
                      <th style={{ padding: '1rem', textAlign: 'center' }}>Quantity</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Source</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Expires</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSeeds.map((seed) => (
                      <tr
                        key={seed.id}
                        style={{
                          borderBottom: '1px solid #e5e7eb',
                          backgroundColor: isExpired(seed.expirationDate) ? '#fee2e2' : 
                                          isExpiringSoon(seed.expirationDate) ? '#fef3c7' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{seed.cropName}</td>
                        <td style={{ padding: '1rem', color: '#6b7280' }}>{seed.variety || '—'}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: seed.quantity === 0 ? '#fee2e2' : '#d1fae5',
                            color: seed.quantity === 0 ? '#991b1b' : '#065f46',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            fontWeight: 'bold'
                          }}>
                            {seed.quantity} {seed.unit}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: '#6b7280' }}>{seed.source || '—'}</td>
                        <td style={{ padding: '1rem' }}>
                          {seed.expirationDate ? (
                            <span style={{
                              color: isExpired(seed.expirationDate) ? '#991b1b' : 
                                     isExpiringSoon(seed.expirationDate) ? '#92400e' : '#6b7280'
                            }}>
                              {new Date(seed.expirationDate).toLocaleDateString()}
                              {isExpired(seed.expirationDate) && ' ⚠️'}
                              {isExpiringSoon(seed.expirationDate) && !isExpired(seed.expirationDate) && ' 🕐'}
                            </span>
                          ) : '—'}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleUse(seed.id, seed.quantity)}
                              disabled={seed.quantity === 0}
                              style={{
                                padding: '0.5rem 0.75rem',
                                backgroundColor: seed.quantity === 0 ? '#d1d5db' : '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: seed.quantity === 0 ? 'not-allowed' : 'pointer',
                                fontSize: '0.875rem'
                              }}
                            >
                              Use
                            </button>
                            <button
                              onClick={() => handleEdit(seed)}
                              style={{
                                padding: '0.5rem 0.75rem',
                                backgroundColor: '#f59e0b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(seed.id)}
                              style={{
                                padding: '0.5rem 0.75rem',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              <strong>Legend:</strong> 
              <span style={{ marginLeft: '1rem' }}>🕐 = Expires within 90 days</span>
              <span style={{ marginLeft: '1rem' }}>⚠️ = Expired</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
