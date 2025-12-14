import { useState } from 'react';
import { photosApi } from '../lib/api';

interface Photo {
  id: string;
  url: string;
  caption?: string;
  type: string;
  createdAt: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  onPhotoDeleted?: () => void;
}

export default function PhotoGallery({ photos, onPhotoDeleted }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (photoId: string) => {
    if (!confirm('Delete this photo?')) return;
    
    setDeleting(photoId);
    try {
      await photosApi.delete(photoId);
      if (onPhotoDeleted) {
        onPhotoDeleted();
      }
      if (selectedPhoto?.id === photoId) {
        setSelectedPhoto(null);
      }
    } catch (err) {
      alert('Failed to delete photo');
    } finally {
      setDeleting(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'progress': return '📈';
      case 'harvest': return '🍅';
      case 'problem': return '⚠️';
      default: return '📷';
    }
  };

  if (photos.length === 0) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        color: '#9ca3af',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
      }}>
        No photos yet. Add your first photo above!
      </div>
    );
  }

  return (
    <>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '1rem'
      }}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            style={{
              position: 'relative',
              aspectRatio: '1',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '2px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onClick={() => setSelectedPhoto(photo)}
          >
            <img
              src={photo.url}
              alt={photo.caption || 'Garden photo'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              backgroundColor: 'white',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}>
              {getTypeIcon(photo.type)}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            style={{
              maxWidth: '90%',
              maxHeight: '80%',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption || 'Garden photo'}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
            <div style={{
              marginTop: '1rem',
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{getTypeIcon(selectedPhoto.type)}</span>
                <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {selectedPhoto.type}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: '#6b7280' }}>
                  {new Date(selectedPhoto.createdAt).toLocaleDateString()}
                </span>
              </div>
              {selectedPhoto.caption && (
                <p style={{ margin: '0.5rem 0', color: '#374151' }}>
                  {selectedPhoto.caption}
                </p>
              )}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => handleDelete(selectedPhoto.id)}
                  disabled={deleting === selectedPhoto.id}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: deleting === selectedPhoto.id ? 'not-allowed' : 'pointer',
                    opacity: deleting === selectedPhoto.id ? 0.6 : 1
                  }}
                >
                  {deleting === selectedPhoto.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
