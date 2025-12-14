import React, { useState } from 'react';
import { soilApi } from '../../../lib/api';
import { SoilProfile, SOIL_TYPES, DRAINAGE_OPTIONS } from '../../../types/soil';
import '../../../styles/forms.css';

interface EditSoilProfileFormProps {
  scopeType: 'garden' | 'bed';
  scopeId: string;
  currentProfile: SoilProfile | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditSoilProfileForm({ 
  scopeType, 
  scopeId, 
  currentProfile,
  onSuccess, 
  onCancel 
}: EditSoilProfileFormProps) {
  const [formData, setFormData] = useState({
    soilType: currentProfile?.soilType || '',
    texture: currentProfile?.texture || '',
    drainage: (currentProfile?.drainage || '') as '' | 'poor' | 'average' | 'well',
    ph: currentProfile?.ph?.toString() || '',
    organicMatter: currentProfile?.organicMatter?.toString() || '',
    notes: currentProfile?.notes || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (formData.ph) {
      const phValue = parseFloat(formData.ph);
      if (isNaN(phValue) || phValue < 3.0 || phValue > 9.0) {
        newErrors.ph = 'pH must be between 3.0 and 9.0';
      }
    }

    if (formData.organicMatter) {
      const omValue = parseFloat(formData.organicMatter);
      if (isNaN(omValue) || omValue < 0 || omValue > 100) {
        newErrors.organicMatter = 'Organic matter must be between 0 and 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSubmitting(true);
    try {
      await soilApi.updateProfile(scopeType, scopeId, {
        soilType: formData.soilType || undefined,
        texture: formData.texture || undefined,
        drainage: (formData.drainage || undefined) as any,
        ph: formData.ph ? parseFloat(formData.ph) : undefined,
        organicMatter: formData.organicMatter ? parseFloat(formData.organicMatter) : undefined,
        notes: formData.notes || undefined,
      });
      onSuccess();
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.message || 'Failed to save profile' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="soil-form">
      <div className="form-group">
        <label htmlFor="soilType">Soil Type</label>
        <select
          id="soilType"
          value={formData.soilType}
          onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
        >
          <option value="">Select soil type...</option>
          {SOIL_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <small className="help-text">General classification of your soil</small>
      </div>

      <div className="form-group">
        <label htmlFor="texture">Texture</label>
        <input
          type="text"
          id="texture"
          placeholder="e.g., sandy loam, clay loam"
          value={formData.texture}
          onChange={(e) => setFormData({ ...formData, texture: e.target.value })}
        />
        <small className="help-text">More specific texture description</small>
      </div>

      <div className="form-group">
        <label>Drainage</label>
        <div className="radio-group">
          {DRAINAGE_OPTIONS.map(option => (
            <label key={option.value} className="radio-label">
              <input
                type="radio"
                name="drainage"
                value={option.value}
                checked={formData.drainage === option.value}
                onChange={(e) => setFormData({ ...formData, drainage: e.target.value as any })}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        <small className="help-text">How quickly water drains through your soil</small>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ph">pH Level</label>
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
          <small className="help-text">3.0-9.0 range (neutral is 7.0)</small>
        </div>

        <div className="form-group">
          <label htmlFor="organicMatter">Organic Matter %</label>
          <input
            type="number"
            id="organicMatter"
            step="0.1"
            min="0"
            max="100"
            placeholder="e.g., 5.0"
            value={formData.organicMatter}
            onChange={(e) => setFormData({ ...formData, organicMatter: e.target.value })}
            className={errors.organicMatter ? 'error' : ''}
          />
          {errors.organicMatter && <span className="error-text">{errors.organicMatter}</span>}
          <small className="help-text">Percentage of organic content</small>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Additional observations about your soil..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      {errors.submit && <div className="error-banner">{errors.submit}</div>}

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}
