import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import { plantingsApi, seedsApi } from '../lib/api';
import { companionData } from '../../../backend/src/data/companion-planting';

interface SearchResult {
  id: string;
  type: 'planting' | 'seed' | 'problem' | 'companion';
  title: string;
  subtitle: string;
  description: string;
  linkTo?: string;
  icon: string;
  matchScore: number;
  metadata?: any;
}

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'plantings' | 'seeds' | 'problems' | 'companions'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveSearch = (query: string) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    saveSearch(query);

    try {
      const searchResults: SearchResult[] = [];
      const lowerQuery = query.toLowerCase();

      // Search plantings
      const plantingsRes = await plantingsApi.getAll();
      plantingsRes.data.forEach((planting: any) => {
        const cropName = planting.crop.name.toLowerCase();
        const gardenName = planting.garden.name.toLowerCase();
        const bedName = planting.bed?.name?.toLowerCase() || '';
        const notes = (planting.notes || '').toLowerCase();

        let matchScore = 0;
        if (cropName.includes(lowerQuery)) matchScore += 10;
        if (gardenName.includes(lowerQuery)) matchScore += 5;
        if (bedName.includes(lowerQuery)) matchScore += 5;
        if (notes.includes(lowerQuery)) matchScore += 3;

        if (matchScore > 0) {
          searchResults.push({
            id: `planting-${planting.id}`,
            type: 'planting',
            title: planting.crop.name,
            subtitle: `${planting.garden.name} • ${planting.status}`,
            description: `Planted ${new Date(planting.plantingDate).toLocaleDateString()}`,
            linkTo: `/plantings/${planting.id}`,
            icon: '🌱',
            matchScore,
            metadata: { planting }
          });
        }
      });

      // Search seeds
      const seedsRes = await seedsApi.getAll();
      seedsRes.data.forEach((seed: any) => {
        const variety = seed.variety.toLowerCase();
        const supplier = (seed.supplier || '').toLowerCase();
        const notes = (seed.notes || '').toLowerCase();

        let matchScore = 0;
        if (variety.includes(lowerQuery)) matchScore += 10;
        if (supplier.includes(lowerQuery)) matchScore += 5;
        if (notes.includes(lowerQuery)) matchScore += 3;

        if (matchScore > 0) {
          searchResults.push({
            id: `seed-${seed.id}`,
            type: 'seed',
            title: seed.variety,
            subtitle: `${seed.quantity} ${seed.units}${seed.supplier ? ` • ${seed.supplier}` : ''}`,
            description: seed.expiryDate 
              ? `Expires: ${new Date(seed.expiryDate).toLocaleDateString()}`
              : 'No expiry date',
            icon: '🌰',
            matchScore,
            metadata: { seed }
          });
        }
      });

      // Search companion planting data
      const companionCrops = Object.keys(companionData);
      companionCrops.forEach(crop => {
        if (crop.toLowerCase().includes(lowerQuery)) {
          const data = companionData[crop];
          const companions = data.companions.split(',').slice(0, 3);
          searchResults.push({
            id: `companion-${crop}`,
            type: 'companion',
            title: crop,
            subtitle: 'Companion planting information',
            description: `Good companions: ${companions.join(', ')}${data.companions.split(',').length > 3 ? '...' : ''}`,
            icon: '🌿',
            matchScore: 8,
            metadata: { crop, data }
          });
        }
      });

      // Search common problems (basic keyword matching)
      const commonProblems = [
        { keyword: 'pest', title: 'Pest Management', description: 'Identify and manage garden pests', icon: '🐛' },
        { keyword: 'disease', title: 'Plant Diseases', description: 'Common plant diseases and treatments', icon: '🦠' },
        { keyword: 'yellow', title: 'Yellowing Leaves', description: 'Possible nutrient deficiency or overwatering', icon: '🍂' },
        { keyword: 'wilt', title: 'Wilting Plants', description: 'Check watering, soil drainage, and root health', icon: '🥀' },
        { keyword: 'aphid', title: 'Aphids', description: 'Small sap-sucking insects, use neem oil or insecticidal soap', icon: '🐛' },
        { keyword: 'mold', title: 'Mold & Fungus', description: 'Improve air circulation, reduce humidity', icon: '🍄' },
        { keyword: 'slug', title: 'Slugs & Snails', description: 'Use beer traps, diatomaceous earth, or copper barriers', icon: '🐌' },
        { keyword: 'drought', title: 'Drought Stress', description: 'Water deeply, mulch heavily, choose drought-tolerant varieties', icon: '☀️' },
        { keyword: 'frost', title: 'Frost Damage', description: 'Use row covers, water before frost, harvest frost-sensitive crops', icon: '❄️' },
      ];

      commonProblems.forEach(problem => {
        if (problem.keyword.includes(lowerQuery) || problem.title.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            id: `problem-${problem.keyword}`,
            type: 'problem',
            title: problem.title,
            subtitle: 'Common garden problem',
            description: problem.description,
            icon: problem.icon,
            matchScore: 7,
            metadata: { problem }
          });
        }
      });

      // Sort by match score
      searchResults.sort((a, b) => b.matchScore - a.matchScore);

      setResults(searchResults);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = activeTab === 'all' 
    ? results 
    : results.filter(r => {
        if (activeTab === 'companions') return r.type === 'companion';
        if (activeTab === 'plantings') return r.type === 'planting';
        if (activeTab === 'seeds') return r.type === 'seed';
        if (activeTab === 'problems') return r.type === 'problem';
        return false;
      });

  const getTabCount = (type: string) => {
    if (type === 'all') return results.length;
    if (type === 'companions') return results.filter(r => r.type === 'companion').length;
    return results.filter(r => r.type === type).length;
  };

  const quickSearches = [
    'tomatoes',
    'watering',
    'pests',
    'companions',
    'harvest'
  ];

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <BackButton to="/dashboard" label="Back to Dashboard" />
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>🔍 Search & Explore</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Search across plantings, seeds, problems, and companion planting data
          </p>
        </div>

        {/* Search Input */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              placeholder="Search for crops, seeds, problems, or companions..."
              style={{
                width: '100%',
                padding: '1rem 3rem 1rem 1rem',
                fontSize: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                outline: 'none'
              }}
            />
            <button
              onClick={() => handleSearch(searchQuery)}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '0.5rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Search
            </button>
          </div>

          {/* Quick Searches */}
          {!searchQuery && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Quick searches:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {quickSearches.map(qs => (
                  <button
                    key={qs}
                    onClick={() => {
                      setSearchQuery(qs);
                      handleSearch(qs);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                      border: '2px solid #86efac',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: '#15803d',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 3px rgba(34, 197, 94, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(34, 197, 94, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(34, 197, 94, 0.1)';
                    }}
                  >
                    {qs}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {!searchQuery && recentSearches.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Recent searches:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {recentSearches.map(rs => (
                  <button
                    key={rs}
                    onClick={() => {
                      setSearchQuery(rs);
                      handleSearch(rs);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                      border: '2px solid #d8b4fe',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: '#6b21a8',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 3px rgba(139, 92, 246, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(139, 92, 246, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(139, 92, 246, 0.1)';
                    }}
                  >
                    🕒 {rs}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {searchQuery && (
          <>
            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '2rem',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '0.5rem'
            }}>
              <button
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: activeTab === 'all' ? '#10b981' : 'transparent',
                  color: activeTab === 'all' ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '6px 6px 0 0',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'all' ? 'bold' : 'normal'
                }}
              >
                All ({getTabCount('all')})
              </button>
              <button
                onClick={() => setActiveTab('plantings')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: activeTab === 'plantings' ? '#10b981' : 'transparent',
                  color: activeTab === 'plantings' ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '6px 6px 0 0',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'plantings' ? 'bold' : 'normal'
                }}
              >
                🌱 Plantings ({getTabCount('plantings')})
              </button>
              <button
                onClick={() => setActiveTab('seeds')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: activeTab === 'seeds' ? '#a855f7' : 'transparent',
                  color: activeTab === 'seeds' ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '6px 6px 0 0',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'seeds' ? 'bold' : 'normal'
                }}
              >
                🌰 Seeds ({getTabCount('seeds')})
              </button>
              <button
                onClick={() => setActiveTab('companions')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: activeTab === 'companions' ? '#3b82f6' : 'transparent',
                  color: activeTab === 'companions' ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '6px 6px 0 0',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'companions' ? 'bold' : 'normal'
                }}
              >
                🌿 Companions ({getTabCount('companions')})
              </button>
              <button
                onClick={() => setActiveTab('problems')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: activeTab === 'problems' ? '#ef4444' : 'transparent',
                  color: activeTab === 'problems' ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '6px 6px 0 0',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'problems' ? 'bold' : 'normal'
                }}
              >
                🐛 Problems ({getTabCount('problems')})
              </button>
            </div>

            {/* Results List */}
            {loading ? (
              <div className="card">
                <div className="card-body" style={{ textAlign: 'center', padding: '3rem' }}>
                  <p>Searching...</p>
                </div>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="card">
                <div className="card-body" style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: '#9ca3af', fontSize: '1.125rem', marginBottom: '1rem' }}>
                    No results found for "{searchQuery}"
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                    Try different keywords or use quick searches above
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredResults.map(result => (
                  <div
                    key={result.id}
                    className="card"
                    style={{
                      cursor: result.linkTo ? 'pointer' : 'default',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onClick={() => result.linkTo && (window.location.href = result.linkTo)}
                  >
                    <div className="card-body" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                        <div style={{
                          fontSize: '2rem',
                          width: '3rem',
                          height: '3rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '8px'
                        }}>
                          {result.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: 0, marginBottom: '0.25rem', fontSize: '1.125rem' }}>
                            {result.title}
                          </h3>
                          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            {result.subtitle}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
                            {result.description}
                          </p>
                          {result.linkTo && (
                            <div style={{ marginTop: '0.75rem' }}>
                              <span style={{
                                fontSize: '0.875rem',
                                color: '#10b981',
                                fontWeight: 'bold'
                              }}>
                                View details →
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
