/**
 * Expandable Crop Card Component for Crop Fit section
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCropPHRange, getSuggestedFix, getCropCategory } from './CropFitHelpers';

interface ExpandableCropCardProps {
  cropName: string;
  fitLevel: 'great' | 'okay' | 'avoid';
  reason: string;
  currentPH?: number;
}

export default function ExpandableCropCard({ cropName, fitLevel, reason, currentPH }: ExpandableCropCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const navigate = useNavigate();
  
  const phRange = getCropPHRange(cropName);
  const suggestedFix = getSuggestedFix(fitLevel, reason, currentPH, cropName);
  const category = getCropCategory(cropName);
  
  const getTips = (): string[] => {
    const tips: string[] = [];
    
    if (fitLevel === 'great') {
      tips.push('Continue regular watering and organic mulching');
      tips.push('Rotate crops annually to prevent nutrient depletion');
      tips.push('Monitor for pests and diseases regularly');
    } else if (fitLevel === 'okay') {
      tips.push('Test soil pH every 6 months to track changes');
      tips.push('Add compost 2-3 weeks before planting');
      tips.push('Consider companion planting to improve growth');
    } else {
      tips.push('Address pH issues before planting');
      tips.push('Build soil health with cover crops');
      tips.push('Consider container growing as an alternative');
    }
    
    return tips;
  };
  
  const handleCreateTask = () => {
    const taskTitle = `Amend soil for ${cropName}`;
    const taskDescription = suggestedFix;
    navigate(`/tasks?prefill=${encodeURIComponent(taskTitle)}&desc=${encodeURIComponent(taskDescription)}`);
  };
  
  const getFitColor = () => {
    switch (fitLevel) {
      case 'great': return '#10b981';
      case 'okay': return '#f59e0b';
      case 'avoid': return '#ef4444';
      default: return '#6b7280';
    }
  };
  
  const getFitIcon = () => {
    switch (fitLevel) {
      case 'great': return '🟢';
      case 'okay': return '🟡';
      case 'avoid': return '🔴';
      default: return '⚪';
    }
  };
  
  return (
    <div style={{
      border: `2px solid ${isExpanded ? getFitColor() : '#e5e7eb'}`,
      borderRadius: '8px',
      backgroundColor: 'white',
      transition: 'all 0.2s ease',
      overflow: 'hidden'
    }}>
      {/* Card Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        style={{
          width: '100%',
          padding: '1rem',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>
              {cropName}
            </span>
            <span style={{
              fontSize: '0.75rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              borderRadius: '4px'
            }}>
              {category}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              padding: '0.25rem 0.75rem',
              backgroundColor: fitLevel === 'great' ? '#d1fae5' : fitLevel === 'okay' ? '#fef3c7' : '#fee2e2',
              color: getFitColor(),
              borderRadius: '12px',
              textTransform: 'uppercase'
            }}>
              {getFitIcon()} {fitLevel}
            </span>
            <span style={{ 
              fontSize: '1.25rem', 
              color: '#9ca3af',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}>
              ▼
            </span>
          </div>
        </div>
        
        <p style={{ 
          fontSize: '0.875rem', 
          color: '#6b7280', 
          margin: 0,
          lineHeight: '1.5'
        }}>
          {reason}
        </p>
      </button>
      
      {/* Expandable Content */}
      {isExpanded && (
        <div style={{
          borderTop: '1px solid #e5e7eb',
          padding: '1rem',
          backgroundColor: '#f9fafb',
          animation: 'slideDown 0.2s ease'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Why Section */}
            <div>
              <h4 style={{ 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Why?
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                {reason}
              </p>
            </div>
            
            {/* Ideal pH Range */}
            <div>
              <h4 style={{ 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Ideal pH Range
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: '#10b981' 
                }}>
                  {phRange.min} - {phRange.max}
                </span>
                {currentPH && (
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    (Current: {currentPH.toFixed(1)})
                  </span>
                )}
              </div>
            </div>
            
            {/* Suggested Fix */}
            <div>
              <h4 style={{ 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Suggested Fix
              </h4>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#374151', 
                margin: 0,
                backgroundColor: 'white',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}>
                {suggestedFix}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateTask();
                }}
                style={{
                  flex: '1',
                  minWidth: '140px',
                  padding: '0.625rem 1rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
              >
                📋 Create Task
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTips(!showTips);
                }}
                style={{
                  flex: '1',
                  minWidth: '140px',
                  padding: '0.625rem 1rem',
                  backgroundColor: 'white',
                  color: '#10b981',
                  border: '2px solid #10b981',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0fdf4';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                💡 {showTips ? 'Hide' : 'View'} Tips
              </button>
            </div>
            
            {/* Tips Panel */}
            {showTips && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                backgroundColor: '#eff6ff',
                border: '1px solid #3b82f6',
                borderRadius: '6px'
              }}>
                <h5 style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: '600', 
                  color: '#1e40af', 
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase'
                }}>
                  Growing Tips
                </h5>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '1.25rem',
                  fontSize: '0.875rem',
                  color: '#1e40af'
                }}>
                  {getTips().map((tip, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
