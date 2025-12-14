import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import { profileApi } from '../lib/api';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [gardenType, setGardenType] = useState('backyard');
  const [climateZone, setClimateZone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [usdaZone, setUsdaZone] = useState('');
  const [lastFrostDate, setLastFrostDate] = useState('');
  const [firstFrostDate, setFirstFrostDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if profile already exists
    const loadProfile = async () => {
      try {
        console.log('[ProfileSetup] Loading existing profile...');
        const response = await profileApi.get();
        const profile = response.data;
        console.log('[ProfileSetup] Profile loaded:', profile);
        
        // Check if profile has actual data (id will be null for new/empty profiles)
        if (profile && profile.id) {
          setName(profile.name || '');
          setLocation(profile.location || '');
          setExperienceLevel(profile.experienceLevel || 'beginner');
          setGardenType(profile.gardenType || 'backyard');
          setClimateZone(profile.climateZone || '');
          setPostalCode(profile.postalCode || '');
          setUsdaZone(profile.usdaZone || '');
          setLastFrostDate(profile.lastFrostDate || '');
          setFirstFrostDate(profile.firstFrostDate || '');
          setIsEdit(true);
          console.log('[ProfileSetup] Loaded existing profile data');
        } else {
          console.log('[ProfileSetup] No existing profile found - showing blank form');
        }
      } catch (err: any) {
        console.error('[ProfileSetup] Error loading profile:', err);
      } finally {
        setLoadingProfile(false);
      }
    };
    
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data: any = { name, location, experienceLevel, gardenType };
      if (climateZone) data.climateZone = climateZone;
      if (postalCode) data.postalCode = postalCode;

      console.log('[ProfileSetup] Saving profile:', data);
      const response = await profileApi.upsert(data);
      const updatedProfile = response.data;
      console.log('[ProfileSetup] Profile saved:', updatedProfile);

      // Update zone info from response
      if (updatedProfile.usdaZone) setUsdaZone(updatedProfile.usdaZone);
      if (updatedProfile.lastFrostDate) setLastFrostDate(updatedProfile.lastFrostDate);
      if (updatedProfile.firstFrostDate) setFirstFrostDate(updatedProfile.firstFrostDate);
      
      // Update localStorage user object to refresh other components
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        user.hasProfile = true;
        localStorage.setItem('user', JSON.stringify(user));
      }

      setSuccess('Profile saved successfully!');
      setIsEdit(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      console.error('[ProfileSetup] Error saving profile:', err);
      setError(err.response?.data?.error?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <Layout>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
          <div style={{ fontSize: '1.25rem', color: '#6b7280' }}>Loading your profile...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {isEdit && <BackButton to="/dashboard" label="Back to Dashboard" />}
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
            {isEdit ? '⚙️ Edit Your Profile' : '🌱 Complete Your Profile'}
          </h1>
          <p style={{ margin: 0, opacity: 0.9 }}>
            {isEdit 
              ? 'Update your information for personalized recommendations' 
              : 'Tell us about yourself to get personalized growing recommendations'}
          </p>
        </div>

        {error && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#fee2e2',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            marginBottom: '1rem',
            color: '#991b1b'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#d1fae5',
            border: '1px solid #10b981',
            borderRadius: '8px',
            marginBottom: '1rem',
            color: '#065f46'
          }}>
            ✓ {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Information Card */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ marginTop: 0, color: '#10b981', fontSize: '1.5rem' }}>👤 Basic Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                style={{ fontSize: '1rem', padding: '0.75rem' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                placeholder="e.g., Portland, Oregon"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                style={{ fontSize: '1rem', padding: '0.75rem' }}
              />
              <small style={{ color: '#6b7280' }}>City and state for local growing information</small>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="experienceLevel">Experience Level</label>
                <select
                  id="experienceLevel"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  style={{ fontSize: '1rem', padding: '0.75rem' }}
                >
                  <option value="beginner">🌱 Beginner</option>
                  <option value="intermediate">🌿 Intermediate</option>
                  <option value="advanced">🌳 Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="gardenType">Garden Type</label>
                <select
                  id="gardenType"
                  value={gardenType}
                  onChange={(e) => setGardenType(e.target.value)}
                  style={{ fontSize: '1rem', padding: '0.75rem' }}
                >
                  <option value="balcony">🪴 Balcony/Container</option>
                  <option value="backyard">🏡 Backyard Garden</option>
                  <option value="small_farm">🚜 Small Farm</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location & Climate Card */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ marginTop: 0, color: '#10b981', fontSize: '1.5rem' }}>📍 Location & Climate</h2>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
              Add your ZIP code for accurate frost dates, weather forecasts, and GPS coordinates
            </p>

            <div className="form-group">
              <label htmlFor="postalCode">
                ZIP Code <span style={{ color: '#10b981', fontWeight: 'bold' }}>⭐ Recommended</span>
              </label>
              <input
                id="postalCode"
                type="text"
                placeholder="e.g., 97201"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                style={{ fontSize: '1rem', padding: '0.75rem' }}
              />
              <small style={{ color: '#6b7280' }}>
                Auto-detects USDA zone, frost dates, GPS coordinates, and enables weather features
              </small>
            </div>

            {usdaZone && (
              <div style={{ 
                padding: '1rem', 
                backgroundColor: '#f0fdf4', 
                border: '2px solid #10b981', 
                borderRadius: '8px', 
                marginBottom: '1rem' 
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#059669' }}>
                  ✓ Location Detected
                </div>
                <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.95rem' }}>
                  <div><strong>USDA Hardiness Zone:</strong> {usdaZone}</div>
                  {lastFrostDate && (
                    <div><strong>🌸 Last Spring Frost:</strong> {lastFrostDate}</div>
                  )}
                  {firstFrostDate && (
                    <div><strong>❄️ First Fall Frost:</strong> {firstFrostDate}</div>
                  )}
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="climateZone">USDA Hardiness Zone (Optional)</label>
              <select
                id="climateZone"
                value={climateZone}
                onChange={(e) => setClimateZone(e.target.value)}
                style={{ fontSize: '1rem', padding: '0.75rem' }}
              >
                <option value="">Auto-detect or select manually...</option>
                <option value="3">Zone 3 (-40°F to -30°F)</option>
                <option value="4">Zone 4 (-30°F to -20°F)</option>
                <option value="5">Zone 5 (-20°F to -10°F)</option>
                <option value="6">Zone 6 (-10°F to 0°F)</option>
                <option value="7">Zone 7 (0°F to 10°F)</option>
                <option value="8">Zone 8 (10°F to 20°F)</option>
                <option value="9">Zone 9 (20°F to 30°F)</option>
                <option value="10">Zone 10 (30°F to 40°F)</option>
                <option value="11">Zone 11 (40°F+)</option>
              </select>
              <small style={{ color: '#6b7280' }}>
                Manually override if auto-detection is incorrect
              </small>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            {isEdit && (
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                backgroundColor: loading ? '#9ca3af' : '#10b981',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '💾 Saving...' : isEdit ? '✓ Update Profile' : '🚀 Get Started'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
