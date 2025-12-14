import { useState, useRef } from 'react';
import { photosApi } from '../lib/api';

interface PhotoUploadProps {
  plantingId?: string;
  gardenId?: string;
  onPhotoAdded?: () => void;
}

export default function PhotoUpload({ plantingId, gardenId, onPhotoAdded }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [caption, setCaption] = useState('');
  const [type, setType] = useState<'progress' | 'harvest' | 'problem' | 'general'>('progress');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        
        try {
          await photosApi.create({
            url: base64,
            caption: caption || undefined,
            type,
            plantingId,
            gardenId,
          });
          
          setCaption('');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          
          if (onPhotoAdded) {
            onPhotoAdded();
          }
        } catch (err: any) {
          setError(err.response?.data?.error?.message || 'Failed to upload photo');
        } finally {
          setUploading(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError('Failed to read image file');
      setUploading(false);
    }
  };

  return (
    <div style={{ 
      padding: '1rem', 
      backgroundColor: '#f9fafb', 
      border: '2px dashed #d1d5db',
      borderRadius: '8px'
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
          📸 Add Photo
        </label>
        
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          style={{ 
            width: '100%', 
            padding: '0.5rem', 
            marginBottom: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #d1d5db'
          }}
        >
          <option value="progress">📈 Progress Photo</option>
          <option value="harvest">🍅 Harvest Photo</option>
          <option value="problem">⚠️ Problem/Issue</option>
          <option value="general">📷 General Photo</option>
        </select>
        
        <input
          type="text"
          placeholder="Add a caption (optional)..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '0.5rem', 
            marginBottom: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #d1d5db'
          }}
        />
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          style={{ display: 'block', marginBottom: '0.5rem' }}
        />
        
        {uploading && (
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            ⏳ Uploading...
          </div>
        )}
        
        {error && (
          <div style={{ 
            color: '#dc2626', 
            fontSize: '0.875rem',
            padding: '0.5rem',
            backgroundColor: '#fee2e2',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
        
        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
          Max size: 5MB. Supported: JPG, PNG, GIF
        </div>
      </div>
    </div>
  );
}
