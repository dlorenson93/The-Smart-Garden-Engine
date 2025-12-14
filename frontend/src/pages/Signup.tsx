import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password);
      navigate('/profile/setup');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-10%',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }} />

      <div className="form-container" style={{
        background: 'white',
        maxWidth: '440px',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo and Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '0.5rem',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
          }}>🌱</div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.25rem'
          }}>Terra Plantari</h1>
          <p style={{
            color: '#6b7280',
            fontSize: '0.875rem',
            margin: 0
          }}>Start your gardening journey</p>
        </div>

        {error && (
          <div style={{
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            border: '2px solid #fca5a5',
            color: '#991b1b',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" style={{
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.875rem',
              marginBottom: '0.5rem'
            }}>Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                borderColor: '#d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" style={{
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.875rem',
              marginBottom: '0.5rem'
            }}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              style={{
                borderColor: '#d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" style={{
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.875rem',
              marginBottom: '0.5rem'
            }}>Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              required
              style={{
                borderColor: '#d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              width: '100%',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              padding: '0.875rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)',
              transform: loading ? 'none' : 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }
            }}
          >
            {loading ? '🔄 Creating account...' : '🌱 Sign Up'}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '0.875rem',
            margin: 0
          }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{
                color: '#10b981',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#10b981'}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
