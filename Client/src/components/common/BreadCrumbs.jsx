import React from 'react';
import { useNavigate } from 'react-router-dom';

const Breadcrumbs = ({ items, className = "" }) => {
  const navigate = useNavigate();

  return (
    <nav className={`text-sm font-sans text-brand-text mb-6 flex items-center gap-1.5 ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        const handleClick = () => {
          if (item.onClick) {
            item.onClick();
          } else if (item.path) {
            navigate(item.path);
          }
        };

        const isClickable = !isLast;

        return (
          <React.Fragment key={index}>
            <span
              className={`transition-colors ${
                isLast
                  ? 'text-brand-charcoal font-semibold truncate max-w-40'
                  : 'hover:text-brand-cedar cursor-pointer'
              }`}
              onClick={isClickable ? handleClick : undefined}
            >
              {item.label}
            </span>
            {!isLast && <span className="text-brand-surface-dim">/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;