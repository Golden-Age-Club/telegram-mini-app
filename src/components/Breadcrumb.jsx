import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items, className = '' }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className={`breadcrumb ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight size={14} className="breadcrumb-separator mx-2" />
          )}
          
          {item.href ? (
            <a
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                item.onClick?.();
              }}
              className={`breadcrumb-item ${
                index === items.length - 1 ? 'active' : ''
              }`}
            >
              {item.icon && <item.icon size={14} className="mr-1" />}
              {item.label}
            </a>
          ) : (
            <span
              className={`breadcrumb-item ${
                index === items.length - 1 ? 'active' : ''
              }`}
            >
              {item.icon && <item.icon size={14} className="mr-1" />}
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

// Common breadcrumb configurations
export const createBreadcrumbs = {
  home: () => [
    { label: 'Home', icon: Home, href: '/', onClick: () => window.location.hash = '/' }
  ],
  
  game: (gameName) => [
    { label: 'Home', icon: Home, href: '/', onClick: () => window.location.hash = '/' },
    { label: 'Games', href: '/games', onClick: () => window.location.hash = '/games' },
    { label: gameName || 'Game' }
  ],
  
  wallet: () => [
    { label: 'Home', icon: Home, href: '/', onClick: () => window.location.hash = '/' },
    { label: 'Wallet' }
  ],
  
  profile: () => [
    { label: 'Home', icon: Home, href: '/', onClick: () => window.location.hash = '/' },
    { label: 'Profile' }
  ],
  
  custom: (items) => items
};

export default Breadcrumb;