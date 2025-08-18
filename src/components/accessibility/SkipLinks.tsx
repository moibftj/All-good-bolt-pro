import React from 'react';

interface SkipLink {
  href: string;
  label: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
}

const defaultLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
  { href: '#footer', label: 'Skip to footer' }
];

export function SkipLinks({ links = defaultLinks }: SkipLinksProps) {
  return (
    <nav 
      className="skip-links" 
      aria-label="Skip navigation links"
      style={{
        position: 'absolute',
        top: '-100px',
        left: 0,
        zIndex: 9999,
        width: '100%'
      }}
    >
      <ul 
        style={{ 
          listStyle: 'none', 
          margin: 0, 
          padding: 0,
          display: 'flex',
          gap: '1rem'
        }}
      >
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="skip-link"
              style={{
                position: 'absolute',
                left: '-9999px',
                background: '#1976D2',
                color: 'white',
                padding: '0.5rem 1rem',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: '0 0 4px 4px',
                border: '2px solid #1976D2',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.left = '0';
                e.currentTarget.style.position = 'static';
              }}
              onBlur={(e) => {
                e.currentTarget.style.left = '-9999px';
                e.currentTarget.style.position = 'absolute';
              }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// CSS-in-JS alternative for better styling control
export function SkipLinksStyled({ links = defaultLinks }: SkipLinksProps) {
  return (
    <>
      <style jsx>{`
        .skip-links {
          position: absolute;
          top: -100px;
          left: 0;
          z-index: 9999;
          width: 100%;
        }
        
        .skip-links ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          gap: 1rem;
        }
        
        .skip-link {
          position: absolute;
          left: -9999px;
          background: #1976D2;
          color: white;
          padding: 0.5rem 1rem;
          text-decoration: none;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 0 0 4px 4px;
          border: 2px solid #1976D2;
          transition: all 0.3s ease;
        }
        
        .skip-link:focus {
          left: 0;
          position: static;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          outline: 2px solid #fff;
          outline-offset: 2px;
        }
        
        .skip-link:hover:focus {
          background: #1565C0;
          border-color: #1565C0;
        }
      `}</style>
      <nav className="skip-links" aria-label="Skip navigation links">
        <ul>
          {links.map((link, index) => (
            <li key={index}>
              <a href={link.href} className="skip-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}