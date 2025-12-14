import React, { useState } from 'react';
import { soilApi } from '../../../lib/api';
import { EVENT_TYPES } from '../../../types/soil';
import '../../../styles/forms.css';

interface AddSoilEventFormProps {
  scopeType: 'garden' | 'bed';
  scopeId: string;
  onSuccess: () => void;
  onCancel: () => void;
  prefillType?: string;
  prefillAmount?: string;
}

export default function AddSoilEventForm({ 
  scopeType, 
  scopeId, 
  onSuccess, 
  onCancel,
  prefillType,
  prefillAmount 
}: AddSoilEventFormProps) {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    eventType: (prefillType || 'amendment') as 'amendment' | 'compost' | 'mulch' | 'lime' | 'sulfur' | 'fertilizer',
    amount: prefillAmount || '',
    eventDate: today,
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventType) {
      newErrors.eventType = 'Event type is required';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required';
    }

    if (new Date(formData.eventDate) > new Date()) {
      newErrors.eventDate = 'Event date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSubmitting(true);
    try {
      await soilApi.addEvent({
        scopeType,
        scopeId,
        eventType: formData.eventType as any,
        amount: formData.amount,
        eventDate: new Date(formData.eventDate).toISOString(),
        notes: formData.notes || undefined,
      });
      onSuccess();
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.message || 'Failed to save event' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="soil-form">
      <div className="form-group">
        <label htmlFor="eventType">Event Type *</label>
        <select
          id="eventType"
          value={formData.eventType}
          onChange={(e) => setFormData({ ...formData, eventType: e.target.value as any })}
          className={errors.eventType ? 'error' : ''}
        >
          {EVENT_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        {errors.eventType && <span className="error-text">{errors.eventType}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount *</label>
        <input
          type="text"
          id="amount"
          placeholder="e.g., 2 cups, 5 lbs, 1 bag"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className={errors.amount ? 'error' : ''}
        />
        {errors.amount && <span className="error-text">{errors.amount}</span>}
        <small className="help-text">Enter amount in any unit (cups, pounds, bags, etc.)</small>
      </div>

      <div className="form-group">
        <label htmlFor="eventDate">Event Date *</label>
        <input
          type="date"
          id="eventDate"
          max={today}
          value={formData.eventDate}
          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
          className={errors.eventDate ? 'error' : ''}
        />
        {errors.eventDate && <span className="error-text">{errors.eventDate}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Brand, source, or other details..."
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
          {submitting ? 'Saving...' : 'Save Amendment'}
        </button>
      </div>
    </form>
  );
}
