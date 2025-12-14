import React, { useState } from 'react';
import { soilApi } from '../../../lib/api';
import { TEST_SOURCES } from '../../../types/soil';
import '../../../styles/forms.css';

interface AddSoilTestFormProps {
  scopeType: 'garden' | 'bed';
  scopeId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddSoilTestForm({ scopeType, scopeId, onSuccess, onCancel }: AddSoilTestFormProps) {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    testDate: today,
    ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    moisture: '',
    salinity: '',
    source: 'manual' as 'manual' | 'kit' | 'lab' | 'sensor',
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.testDate) {
      newErrors.testDate = 'Test date is required';
    }

    if (new Date(formData.testDate) > new Date()) {
      newErrors.testDate = 'Test date cannot be in the future';
    }

    if (formData.ph) {
      const phValue = parseFloat(formData.ph);
      if (isNaN(phValue) || phValue < 3.0 || phValue > 9.0) {
        newErrors.ph = 'pH must be between 3.0 and 9.0';
      }
    }

    if (formData.moisture) {
      const moistureValue = parseFloat(formData.moisture);
      if (isNaN(moistureValue) || moistureValue < 0 || moistureValue > 100) {
        newErrors.moisture = 'Moisture must be between 0 and 100';
      }
    }

    // At least one value must be provided
    if (!formData.ph && !formData.nitrogen && !formData.phosphorus && 
        !formData.potassium && !formData.moisture && !formData.salinity) {
      newErrors.values = 'At least one test value is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSubmitting(true);
    try {
      await soilApi.addTest({
        scopeType,
        scopeId,
        testDate: new Date(formData.testDate).toISOString(),
        ph: formData.ph ? parseFloat(formData.ph) : undefined,
        nitrogen: formData.nitrogen ? parseFloat(formData.nitrogen) : undefined,
        phosphorus: formData.phosphorus ? parseFloat(formData.phosphorus) : undefined,
        potassium: formData.potassium ? parseFloat(formData.potassium) : undefined,
        moisture: formData.moisture ? parseFloat(formData.moisture) : undefined,
        salinity: formData.salinity ? parseFloat(formData.salinity) : undefined,
        source: formData.source as any,
        notes: formData.notes || undefined,
      });
      onSuccess();
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.message || 'Failed to save test' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="soil-form">
      <div className="form-group">
        <label htmlFor="testDate">Test Date *</label>
        <input
          type="date"
          id="testDate"
          max={today}
          value={formData.testDate}
          onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
          className={errors.testDate ? 'error' : ''}
        />
        {errors.testDate && <span className="error-text">{errors.testDate}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ph">pH</label>
          <input
            type="number"
            id="ph"
            step="0.1"
            min="3.0"
            max="9.0"
            placeholder="e.g., 6.5"
            value={formData.ph}
            onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
            className={errors.ph ? 'error' : ''}
          />
          {errors.ph && <span className="error-text">{errors.ph}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="moisture">Moisture %</label>
          <input
            type="number"
            id="moisture"
            step="1"
            min="0"
            max="100"
            placeholder="e.g., 45"
            value={formData.moisture}
            onChange={(e) => setFormData({ ...formData, moisture: e.target.value })}
            className={errors.moisture ? 'error' : ''}
          />
          {errors.moisture && <span className="error-text">{errors.moisture}</span>}
        </div>
      </div>

      <div className="form-section-title">NPK Values (optional)</div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nitrogen">Nitrogen (N)</label>
          <input
            type="number"
            id="nitrogen"
            step="0.1"
            placeholder="ppm"
            value={formData.nitrogen}
            onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phosphorus">Phosphorus (P)</label>
          <input
            type="number"
            id="phosphorus"
            step="0.1"
            placeholder="ppm"
            value={formData.phosphorus}
            onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="potassium">Potassium (K)</label>
          <input
            type="number"
            id="potassium"
            step="0.1"
            placeholder="ppm"
            value={formData.potassium}
            onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="salinity">Salinity (optional)</label>
        <input
          type="number"
          id="salinity"
          step="0.1"
          placeholder="EC or ppm"
          value={formData.salinity}
          onChange={(e) => setFormData({ ...formData, salinity: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="source">Test Source *</label>
        <select
          id="source"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
        >
          {TEST_SOURCES.map(source => (
            <option key={source.value} value={source.value}>{source.label}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Additional observations..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      {errors.values && <div className="error-banner">{errors.values}</div>}
      {errors.submit && <div className="error-banner">{errors.submit}</div>}

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Test'}
        </button>
      </div>
    </form>
  );
}
