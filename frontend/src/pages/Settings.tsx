import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import BackButton from '../components/BackButton';

interface Settings {
  // Watering Intelligence
  rainThresholdMm: number;
  rainChancePercent: number;
  wateringFrequencyDays: number;
  
  // Frost Alerts
  frostAlertDays: number;
  frostAlertEnabled: boolean;
  
  // Seed Inventory
  seedLowStockThreshold: number;
  seedExpiryWarningMonths: number;
  
  // Notifications (future use)
  notifyTasks: boolean;
  notifyHarvest: boolean;
  notifyWeather: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  rainThresholdMm: 2.5,
  rainChancePercent: 70,
  wateringFrequencyDays: 2,
  frostAlertDays: 14,
  frostAlertEnabled: true,
  seedLowStockThreshold: 2,
  seedExpiryWarningMonths: 3,
  notifyTasks: true,
  notifyHarvest: true,
  notifyWeather: true,
};

export default function Settings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const stored = localStorage.getItem('gardenSettings');
    if (stored) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('gardenSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Reset all settings to defaults?')) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.removeItem('gardenSettings');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <BackButton to="/dashboard" label="Back to Dashboard" />
        <h1 style={{ marginBottom: '2rem' }}>⚙️ Rules & Settings</h1>

        {saved && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#d1fae5',
            color: '#065f46',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            ✅ Settings saved successfully!
          </div>
        )}

        {/* Watering Intelligence */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header" style={{ backgroundColor: '#dbeafe' }}>
            <h2 style={{ margin: 0, color: '#1e40af' }}>💧 Watering Intelligence</h2>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
              Control when the system automatically adjusts watering tasks
            </p>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="rainThreshold">
                Rain Threshold (mm)
                <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '0.5rem' }}>
                  Skip watering if it rained more than this amount
                </span>
              </label>
              <input
                id="rainThreshold"
                type="number"
                step="0.1"
                value={settings.rainThresholdMm}
                onChange={(e) => setSettings({ ...settings, rainThresholdMm: parseFloat(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="rainChance">
                Rain Chance Threshold (%)
                <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '0.5rem' }}>
                  Skip watering if forecast shows higher chance
                </span>
              </label>
              <input
                id="rainChance"
                type="number"
                min="0"
                max="100"
                value={settings.rainChancePercent}
                onChange={(e) => setSettings({ ...settings, rainChancePercent: parseInt(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="wateringFreq">
                Default Watering Frequency (days)
                <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '0.5rem' }}>
                  How often to water by default
                </span>
              </label>
              <input
                id="wateringFreq"
                type="number"
                min="1"
                max="14"
                value={settings.wateringFrequencyDays}
                onChange={(e) => setSettings({ ...settings, wateringFrequencyDays: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Frost Alerts */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header" style={{ backgroundColor: '#fef3c7' }}>
            <h2 style={{ margin: 0, color: '#92400e' }}>❄️ Frost Alerts</h2>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
              Get warnings about potential frost damage
            </p>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.frostAlertEnabled}
                  onChange={(e) => setSettings({ ...settings, frostAlertEnabled: e.target.checked })}
                  style={{ width: 'auto' }}
                />
                Enable frost alerts
              </label>
            </div>

            {settings.frostAlertEnabled && (
              <div className="form-group">
                <label htmlFor="frostAlertDays">
                  Alert Window (days)
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '0.5rem' }}>
                    Show alerts this many days before frost date
                  </span>
                </label>
                <input
                  id="frostAlertDays"
                  type="number"
                  min="1"
                  max="30"
                  value={settings.frostAlertDays}
                  onChange={(e) => setSettings({ ...settings, frostAlertDays: parseInt(e.target.value) })}
                />
              </div>
            )}
          </div>
        </div>

        {/* Seed Inventory */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header" style={{ backgroundColor: '#e0e7ff' }}>
            <h2 style={{ margin: 0, color: '#3730a3' }}>🌱 Seed Inventory</h2>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
              Control warning thresholds for seed stock
            </p>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="seedLowStock">
                Low Stock Threshold
                <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '0.5rem' }}>
                  Warn when quantity drops to or below this number
                </span>
              </label>
              <input
                id="seedLowStock"
                type="number"
                min="0"
                value={settings.seedLowStockThreshold}
                onChange={(e) => setSettings({ ...settings, seedLowStockThreshold: parseInt(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="seedExpiry">
                Expiry Warning (months)
                <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '0.5rem' }}>
                  Warn when seeds expire within this timeframe
                </span>
              </label>
              <input
                id="seedExpiry"
                type="number"
                min="1"
                max="12"
                value={settings.seedExpiryWarningMonths}
                onChange={(e) => setSettings({ ...settings, seedExpiryWarningMonths: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header" style={{ backgroundColor: '#d1fae5' }}>
            <h2 style={{ margin: 0, color: '#065f46' }}>🔔 Notifications</h2>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
              Choose what updates you want to receive
            </p>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.notifyTasks}
                  onChange={(e) => setSettings({ ...settings, notifyTasks: e.target.checked })}
                  style={{ width: 'auto' }}
                />
                Task reminders
              </label>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.notifyHarvest}
                  onChange={(e) => setSettings({ ...settings, notifyHarvest: e.target.checked })}
                  style={{ width: 'auto' }}
                />
                Harvest windows
              </label>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.notifyWeather}
                  onChange={(e) => setSettings({ ...settings, notifyWeather: e.target.checked })}
                  style={{ width: 'auto' }}
                />
                Weather alerts
              </label>
            </div>

            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: '#fef3c7',
              borderRadius: '6px',
              fontSize: '0.875rem',
              color: '#92400e'
            }}>
              <strong>Note:</strong> Browser notifications coming soon! These settings will be ready when that feature launches.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
          <button
            onClick={handleReset}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </Layout>
  );
}
