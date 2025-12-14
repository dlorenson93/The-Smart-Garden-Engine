import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Bed {
  id: string;
  name: string;
  length: number;
  width: number;
  positionX?: number;
  positionY?: number;
  rotation?: number;
  sunExposure: string;
  sunHours?: number;
  plantings: any[];
}

interface Garden {
  id: string;
  name: string;
  width?: number;
  height?: number;
  beds: Bed[];
}

interface GardenLayoutProps {
  gardenId: string;
}

const GardenLayout: React.FC<GardenLayoutProps> = ({ gardenId }) => {
  const [garden, setGarden] = useState<Garden | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBed, setSelectedBed] = useState<string | null>(null);
  const [draggedBed, setDraggedBed] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const SCALE = 20; // pixels per foot
  const DEFAULT_GARDEN_WIDTH = 30; // feet
  const DEFAULT_GARDEN_HEIGHT = 20; // feet

  useEffect(() => {
    loadLayout();
  }, [gardenId]);

  const loadLayout = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
      const response = await axios.get(
        `${apiUrl}/gardens/${gardenId}/layout`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGarden(response.data);
      setError('');
    } catch (err: any) {
      console.error('Garden layout error:', err);
      const errorMsg = err.response?.data?.error?.message || err.response?.data?.error || err.message || 'Failed to load garden layout';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleBedDragStart = (bedId: string, e: React.MouseEvent) => {
    const bed = garden?.beds.find(b => b.id === bedId);
    if (!bed) return;

    setDraggedBed(bedId);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggedBed || !garden) return;

    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - dragOffset.x) / SCALE;
    const y = (e.clientY - rect.top - dragOffset.y) / SCALE;

    setGarden({
      ...garden,
      beds: garden.beds.map(bed =>
        bed.id === draggedBed
          ? { ...bed, positionX: Math.max(0, x), positionY: Math.max(0, y) }
          : bed
      ),
    });
  };

  const handleBedDragEnd = async () => {
    if (!draggedBed || !garden) return;

    const bed = garden.beds.find(b => b.id === draggedBed);
    if (!bed) return;

    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
      await axios.patch(
        `${apiUrl}/beds/${bed.id}/position`,
        {
          positionX: bed.positionX,
          positionY: bed.positionY,
          rotation: bed.rotation || 0,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to save bed position:', err);
    }

    setDraggedBed(null);
  };

  const getSunlightColor = (sunHours?: number, sunExposure?: string): string => {
    if (sunHours !== undefined && sunHours !== null) {
      if (sunHours >= 6) return '#fbbf24'; // full sun - amber
      if (sunHours >= 4) return '#fdba74'; // partial sun - orange
      return '#a3e635'; // shade - lime
    }

    // Fallback to categorical
    switch (sunExposure) {
      case 'full':
        return '#fbbf24';
      case 'partial':
        return '#fdba74';
      case 'shade':
        return '#a3e635';
      default:
        return '#d1d5db';
    }
  };

  if (loading) return <div>Loading garden layout...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!garden) return <div>Garden not found</div>;

  const gardenWidth = garden.width || DEFAULT_GARDEN_WIDTH;
  const gardenHeight = garden.height || DEFAULT_GARDEN_HEIGHT;

  return (
    <div className="garden-layout-container">
      <div className="layout-header">
        <h2>{garden.name} - Layout</h2>
        <p>Drag beds to arrange them. Colors show sunlight hours.</p>
      </div>

      <div className="sunlight-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#fbbf24' }}></span>
          <span>Full Sun (6-8+ hrs)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#fdba74' }}></span>
          <span>Partial Sun (4-6 hrs)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#a3e635' }}></span>
          <span>Shade (2-4 hrs)</span>
        </div>
      </div>

      <div
        className="garden-canvas"
        style={{
          width: gardenWidth * SCALE,
          height: gardenHeight * SCALE,
        }}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleBedDragEnd}
        onMouseLeave={handleBedDragEnd}
      >
        {/* Grid lines */}
        {Array.from({ length: Math.floor(gardenWidth) + 1 }).map((_, i) => (
          <div
            key={`vline-${i}`}
            className="grid-line vertical"
            style={{ left: i * SCALE }}
          />
        ))}
        {Array.from({ length: Math.floor(gardenHeight) + 1 }).map((_, i) => (
          <div
            key={`hline-${i}`}
            className="grid-line horizontal"
            style={{ top: i * SCALE }}
          />
        ))}

        {/* Beds */}
        {garden.beds.map((bed) => {
          const x = (bed.positionX || 0) * SCALE;
          const y = (bed.positionY || 0) * SCALE;
          const w = bed.length * SCALE;
          const h = bed.width * SCALE;
          const isSelected = selectedBed === bed.id;

          return (
            <div
              key={bed.id}
              className={`bed ${isSelected ? 'selected' : ''} ${draggedBed === bed.id ? 'dragging' : ''}`}
              style={{
                left: x,
                top: y,
                width: w,
                height: h,
                background: getSunlightColor(bed.sunHours, bed.sunExposure),
                transform: `rotate(${bed.rotation || 0}deg)`,
              }}
              onMouseDown={(e) => handleBedDragStart(bed.id, e)}
              onClick={() => setSelectedBed(bed.id)}
            >
              <div className="bed-label">
                <div className="bed-name">{bed.name}</div>
                <div className="bed-info">
                  {bed.length}' × {bed.width}'
                  {bed.sunHours !== undefined && bed.sunHours !== null && (
                    <div className="sun-hours">☀️ {bed.sunHours}h</div>
                  )}
                </div>
                {bed.plantings.length > 0 && (
                  <div className="planting-count">
                    🌱 {bed.plantings.length} {bed.plantings.length === 1 ? 'crop' : 'crops'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedBed && (
        <div className="bed-details">
          {(() => {
            const bed = garden.beds.find(b => b.id === selectedBed);
            if (!bed) return null;

            return (
              <div>
                <h3>{bed.name}</h3>
                <p>
                  <strong>Size:</strong> {bed.length}' × {bed.width}'<br />
                  <strong>Position:</strong> ({(bed.positionX || 0).toFixed(1)}, {(bed.positionY || 0).toFixed(1)})<br />
                  <strong>Sun Exposure:</strong> {bed.sunExposure}
                  {bed.sunHours !== undefined && bed.sunHours !== null && ` (${bed.sunHours} hours)`}<br />
                  <strong>Active Plantings:</strong> {bed.plantings.length}
                </p>
                {bed.plantings.length > 0 && (
                  <div>
                    <strong>Crops:</strong>
                    <ul>
                      {bed.plantings.map(p => (
                        <li key={p.id}>
                          {p.crop.name}
                          {p.variety && <span style={{ fontStyle: 'italic', color: '#6b7280' }}> ({p.variety})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      <style>{`
        .garden-layout-container {
          padding: 1.5rem;
        }

        .layout-header {
          margin-bottom: 1.5rem;
        }

        .layout-header h2 {
          margin: 0 0 0.5rem 0;
        }

        .layout-header p {
          margin: 0;
          color: #6b7280;
        }

        .sunlight-legend {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: white;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .legend-color {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          border: 1px solid #d1d5db;
        }

        .garden-canvas {
          position: relative;
          background: #f0fdf4;
          border: 2px solid #22c55e;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          cursor: crosshair;
        }

        .grid-line {
          position: absolute;
          background: rgba(34, 197, 94, 0.1);
        }

        .grid-line.vertical {
          width: 1px;
          height: 100%;
          top: 0;
        }

        .grid-line.horizontal {
          height: 1px;
          width: 100%;
          left: 0;
        }

        .bed {
          position: absolute;
          border: 2px solid #16a34a;
          border-radius: 4px;
          cursor: move;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: box-shadow 0.2s, transform 0.1s;
          user-select: none;
        }

        .bed:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }

        .bed.selected {
          border-color: #2563eb;
          border-width: 3px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          z-index: 11;
        }

        .bed.dragging {
          opacity: 0.8;
          z-index: 12;
        }

        .bed-label {
          text-align: center;
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
          pointer-events: none;
        }

        .bed-name {
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .bed-info {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .sun-hours {
          margin-top: 0.25rem;
        }

        .planting-count {
          margin-top: 0.25rem;
          font-size: 0.75rem;
          opacity: 0.9;
        }

        .bed-details {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .bed-details h3 {
          margin-top: 0;
        }

        .bed-details ul {
          margin: 0.5rem 0 0 0;
          padding-left: 1.5rem;
        }

        .error-message {
          background: #fee2e2;
          color: #991b1b;
          padding: 1rem;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default GardenLayout;
