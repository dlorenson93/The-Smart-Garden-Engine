import { useState, useEffect } from 'react';
import factsData from '../data/facts.json';
import { featureFlags } from '../config/features';

export default function DidYouKnow() {
  const [fact, setFact] = useState('');

  useEffect(() => {
    if (featureFlags.showDidYouKnowFacts) {
      const randomFact = factsData.facts[Math.floor(Math.random() * factsData.facts.length)];
      setFact(randomFact);
    }
  }, []);

  if (!featureFlags.showDidYouKnowFacts || !fact) return null;

  return (
    <div style={{
      padding: '1rem',
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '6px',
      marginTop: '1.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.5rem' }}>💡</span>
        <div>
          <strong style={{ color: '#059669' }}>Did You Know?</strong>
          <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
            {fact}
          </p>
        </div>
      </div>
    </div>
  );
}
