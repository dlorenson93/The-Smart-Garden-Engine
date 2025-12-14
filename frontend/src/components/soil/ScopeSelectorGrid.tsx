import React from 'react';

interface Garden {
  id: string;
  name: string;
  beds?: Array<{ id: string; name: string }>;
}

interface ScopeSelectorGridProps {
  gardens: Garden[];
  onSelect: (type: 'garden' | 'bed', id: string, name: string) => void;
}

export default function ScopeSelectorGrid({ gardens, onSelect }: ScopeSelectorGridProps) {
  return (
    <div className="scope-selector-grid">
      {gardens.map(garden => (
        <div key={garden.id} className="scope-group">
          <button
            className="scope-card garden-card"
            onClick={() => onSelect('garden', garden.id, garden.name)}
          >
            <span className="scope-icon">🏡</span>
            <span className="scope-name">{garden.name}</span>
          </button>

          {garden.beds && garden.beds.length > 0 && (
            <div className="beds-grid">
              {garden.beds.map(bed => (
                <button
                  key={bed.id}
                  className="scope-card bed-card"
                  onClick={() => onSelect('bed', bed.id, bed.name)}
                >
                  <span className="scope-icon">🌿</span>
                  <span className="scope-name">{bed.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
