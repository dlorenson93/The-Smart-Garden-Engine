import { ReactNode, CSSProperties, ButtonHTMLAttributes } from 'react';
import '../../styles/theme.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const baseStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    fontWeight: 'var(--font-semibold)',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all var(--transition-base)',
    fontFamily: 'var(--font-sans)',
    width: fullWidth ? '100%' : 'auto',
    ...style
  };

  const sizeStyles: Record<string, CSSProperties> = {
    sm: {
      padding: 'var(--space-2) var(--space-3)',
      fontSize: 'var(--text-sm)',
      minHeight: '36px',
    },
    md: {
      padding: 'var(--space-3) var(--space-4)',
      fontSize: 'var(--text-base)',
      minHeight: 'var(--touch-target-min)',
    },
    lg: {
      padding: 'var(--space-4) var(--space-6)',
      fontSize: 'var(--text-lg)',
      minHeight: '52px',
    }
  };

  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white)',
    },
    secondary: {
      backgroundColor: 'var(--color-accent)',
      color: 'var(--color-white)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary)',
      border: '2px solid var(--color-primary)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-gray-700)',
      border: '2px solid var(--color-gray-200)',
    },
    link: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary)',
      padding: 0,
      minHeight: 'auto',
    }
  };

  const hoverStyles: Record<string, CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-primary-hover)',
      transform: 'translateY(-1px)',
      boxShadow: 'var(--shadow-md)',
    },
    secondary: {
      backgroundColor: 'var(--color-accent-hover)',
      transform: 'translateY(-1px)',
      boxShadow: 'var(--shadow-md)',
    },
    outline: {
      backgroundColor: 'var(--color-primary-light)',
      borderColor: 'var(--color-primary-hover)',
    },
    ghost: {
      backgroundColor: 'var(--color-gray-100)',
      borderColor: 'var(--color-gray-300)',
    },
    link: {
      textDecoration: 'underline',
    }
  };

  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      disabled={disabled || loading}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
      }}
      onMouseEnter={(e) => !disabled && !loading && Object.assign(e.currentTarget.style, hoverStyles[variant])}
      onMouseLeave={(e) => !disabled && !loading && Object.assign(e.currentTarget.style, {
        ...variantStyles[variant],
        transform: variant === 'link' ? 'none' : 'translateY(0)',
        boxShadow: 'none',
        textDecoration: variant === 'link' ? 'none' : undefined,
      })}
      {...props}
    >
      {loading && <span>⏳</span>}
      {!loading && leftIcon && <span>{leftIcon}</span>}
      <span>{children}</span>
      {!loading && rightIcon && <span>{rightIcon}</span>}
    </button>
  );
}
