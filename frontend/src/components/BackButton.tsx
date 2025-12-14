import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  label?: string;
}

export default function BackButton({ to, label = 'Back' }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'transparent',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        color: '#6b7280',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'all 0.2s',
        marginBottom: '1rem',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f9fafb';
        e.currentTarget.style.borderColor = '#9ca3af';
        e.currentTarget.style.color = '#374151';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.borderColor = '#d1d5db';
        e.currentTarget.style.color = '#6b7280';
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>←</span>
      {label}
    </button>
  );
}
