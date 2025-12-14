import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/command-center', label: 'Command Center', icon: '🎯', highlight: true },
    { path: '/gardens', label: 'Gardens', icon: '🏡' },
    { path: '/tasks', label: 'Tasks', icon: '✅' },
    { path: '/timeline', label: 'Timeline', icon: '📅' },
    { path: '/search', label: 'Search', icon: '🔍' },
  ];

  const secondaryLinks = [
    { path: '/terra', label: 'Terra Marketplace', icon: '🌾', badge: 'PREVIEW' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-app, #f5f5f5)' }}>
      {/* Header */}
      <nav style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderBottom: '2px solid var(--color-border-light)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}>
          {/* Logo */}
          <Link 
            to="/dashboard" 
            style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              color: '#10b981',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            🌱 Terra Plantari
          </Link>

          {/* Desktop Navigation */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-1)',
            flex: 1,
            justifyContent: 'center'
          }} className="desktop-nav">
            {navLinks.slice(0, 6).map(link => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: isActive(link.path) ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                  color: isActive(link.path) ? 'var(--color-primary)' : 'var(--color-text)',
                  backgroundColor: isActive(link.path) ? 'var(--color-primary-light)' : 'transparent',
                  transition: 'var(--transition-base)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {link.label}
                {link.highlight && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    fontSize: '0.6rem',
                    padding: '0.15rem 0.35rem',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 'var(--font-weight-bold)'
                  }}>
                    NEW
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {/* User Pill Dropdown */}
            <div style={{ position: 'relative' }} className="desktop-nav">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-3)',
                  backgroundColor: userMenuOpen ? 'var(--color-primary-light)' : 'var(--color-bg-muted)',
                  border: `1px solid ${userMenuOpen ? 'var(--color-primary)' : 'var(--color-border-light)'}`,
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  transition: 'var(--transition-base)',
                  height: '44px',
                  minWidth: '44px'
                }}
                onMouseEnter={(e) => {
                  if (!userMenuOpen) {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!userMenuOpen) {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)';
                  }
                }}
              >
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
                <span style={{ 
                  maxWidth: '120px', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap' 
                }}>
                  {user?.email?.split('@')[0] || 'User'}
                </span>
                <span style={{ 
                  fontSize: '0.7rem',
                  transition: 'var(--transition-base)',
                  transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                  ▼
                </span>
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + var(--space-2))',
                  right: 0,
                  backgroundColor: 'var(--color-bg-primary)',
                  boxShadow: 'var(--shadow-lg)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border-light)',
                  minWidth: '220px',
                  overflow: 'hidden',
                  zIndex: 1000
                }}>
                  {/* User Info Header */}
                  <div style={{
                    padding: 'var(--space-4)',
                    borderBottom: '1px solid var(--color-border-light)',
                    backgroundColor: 'var(--color-bg-muted)'
                  }}>
                    <div style={{ 
                      fontWeight: 'var(--font-weight-semibold)', 
                      fontSize: 'var(--font-size-sm)',
                      marginBottom: 'var(--space-1)'
                    }}>
                      {user?.email?.split('@')[0] || 'User'}
                    </div>
                    <div style={{ 
                      fontSize: 'var(--font-size-xs)', 
                      color: 'var(--color-text-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {user?.email}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div style={{ padding: 'var(--space-2)' }}>
                    <Link
                      to="/profile/setup"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius-md)',
                        textDecoration: 'none',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text)',
                        transition: 'var(--transition-base)',
                        fontWeight: 'var(--font-weight-medium)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span>👤</span>
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius-md)',
                        textDecoration: 'none',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text)',
                        transition: 'var(--transition-base)',
                        fontWeight: 'var(--font-weight-medium)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span>⚙️</span>
                      <span>Settings</span>
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div style={{
                    padding: 'var(--space-2)',
                    borderTop: '1px solid var(--color-border-light)'
                  }}>
                    <button
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-2) var(--space-3)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-danger)',
                        cursor: 'pointer',
                        transition: 'var(--transition-base)',
                        fontWeight: 'var(--font-weight-medium)',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-danger-light)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                padding: '0.5rem',
                backgroundColor: 'transparent',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                width: '40px',
                height: '40px',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              aria-label="Menu"
            >
              <span style={{
                width: '20px',
                height: '2px',
                backgroundColor: '#374151',
                transition: 'all 0.3s',
                transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none'
              }} />
              <span style={{
                width: '20px',
                height: '2px',
                backgroundColor: '#374151',
                transition: 'all 0.3s',
                opacity: menuOpen ? 0 : 1
              }} />
              <span style={{
                width: '20px',
                height: '2px',
                backgroundColor: '#374151',
                transition: 'all 0.3s',
                transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none'
              }} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: '64px',
            right: 0,
            backgroundColor: 'var(--color-bg-primary)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
            minWidth: '250px',
            maxWidth: '320px',
            border: '2px solid var(--color-border-light)',
            borderTop: 'none'
          }}>
            <div style={{ padding: 'var(--space-4)' }}>
              {/* Primary Links */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ 
                  fontSize: 'var(--font-size-xs)', 
                  fontWeight: 'var(--font-weight-bold)', 
                  color: 'var(--color-text-muted)', 
                  textTransform: 'uppercase',
                  marginBottom: 'var(--space-2)',
                  letterSpacing: '0.05em'
                }}>
                  Main
                </div>
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: isActive(link.path) ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                      color: isActive(link.path) ? 'var(--color-primary)' : 'var(--color-text)',
                      backgroundColor: isActive(link.path) ? 'var(--color-primary-light)' : 'transparent',
                      marginBottom: 'var(--space-1)',
                      transition: 'var(--transition-base)',
                      minHeight: '44px'
                    }}
                  >
                    <span>{link.label}</span>
                    {link.highlight && (
                      <span style={{
                        marginLeft: 'auto',
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.4rem',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 'var(--font-weight-bold)'
                      }}>
                        NEW
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Secondary Links */}
              <div style={{ 
                borderTop: '1px solid var(--color-border-light)', 
                paddingTop: 'var(--space-4)',
                marginBottom: 'var(--space-4)'
              }}>
                <div style={{ 
                  fontSize: 'var(--font-size-xs)', 
                  fontWeight: 'var(--font-weight-bold)', 
                  color: 'var(--color-text-muted)', 
                  textTransform: 'uppercase',
                  marginBottom: 'var(--space-2)',
                  letterSpacing: '0.05em'
                }}>
                  More
                </div>
                {secondaryLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text)',
                      backgroundColor: 'transparent',
                      marginBottom: 'var(--space-1)',
                      transition: 'var(--transition-base)',
                      minHeight: '44px'
                    }}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span style={{
                        marginLeft: 'auto',
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.4rem',
                        backgroundColor: 'var(--color-warning-light)',
                        color: 'var(--color-warning-dark)',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 'var(--font-weight-bold)'
                      }}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* User Section (Mobile) */}
              <div className="mobile-nav" style={{ 
                borderTop: '1px solid var(--color-border-light)', 
                paddingTop: 'var(--space-4)'
              }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  marginBottom: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--color-bg-muted)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <span style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 'var(--font-weight-bold)'
                  }}>
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: 'var(--font-size-sm)', 
                      fontWeight: 'var(--font-weight-semibold)',
                      marginBottom: '2px'
                    }}>
                      {user?.email?.split('@')[0] || 'User'}
                    </div>
                    <div style={{ 
                      fontSize: 'var(--font-size-xs)', 
                      color: 'var(--color-text-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {user?.email}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    backgroundColor: 'var(--color-danger)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    cursor: 'pointer',
                    minHeight: '44px',
                    transition: 'var(--transition-base)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-danger-dark)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-danger)';
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="container">{children}</div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="mobile-tab-bar" style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: '60px',
        background: 'var(--color-bg-primary, #fff)',
        borderTop: '1px solid var(--color-border-light, #e5e7eb)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 100,
        boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
        padding: 0,
        width: '100vw',
        maxWidth: '100vw',
      }}>
        {navLinks.slice(0, 5).map(link => (
          <Link
            key={link.path}
            to={link.path}
            className="mobile-nav"
            style={{
              flex: 1,
              textAlign: 'center',
              textDecoration: 'none',
              color: isActive(link.path) ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: isActive(link.path) ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
              fontSize: '1.3rem',
              padding: '0.5rem 0',
              background: 'none',
              border: 'none',
              outline: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              transition: 'color 0.2s',
            }}
          >
            <span>{link.icon}</span>
            <span style={{ fontSize: '0.7rem', marginTop: 2 }}>{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* Add responsive CSS */}
      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-tab-bar {
            display: flex !important;
          }
          .mobile-nav {
            display: flex !important;
          }
          .hamburger-menu-desktop {
            display: none !important;
          }
        }
        @media (min-width: 1025px) {
          .mobile-nav, .mobile-tab-bar {
            display: none !important;
          }
          .hamburger-menu-desktop {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
