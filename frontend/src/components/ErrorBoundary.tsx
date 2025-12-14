import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '2rem',
          maxWidth: '600px',
          margin: '2rem auto',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌱</div>
          <h1 style={{ color: '#991b1b', marginBottom: '1rem' }}>Oops! Something went wrong</h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            We encountered an unexpected error. Please refresh the page and try again.
          </p>
          {this.state.error && process.env.NODE_ENV === 'development' && (
            <details style={{
              textAlign: 'left',
              background: '#fee2e2',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Error Details
              </summary>
              <pre style={{ overflow: 'auto', fontSize: '0.875rem' }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
