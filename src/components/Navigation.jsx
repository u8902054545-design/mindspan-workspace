import React from 'react';

const Navigation = ({ navItems, currentIndex, handleNavClick }) => {
  return (
    <nav className="nav-bar fixed bottom-0 left-0 w-full z-50">
      <style>{`
        .nav-bar {
          background-color: #1F1F1F;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.6); 
          height: 80px;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .nav-item {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: transparent;
          border: none;
          outline: none;
          -webkit-tap-highlight-color: transparent; 
        }
        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 32px;
          border-radius: 16px;
          transition: background-color 0.3s cubic-bezier(0.2, 0.0, 0, 1.0), transform 0.1s ease;
          margin-bottom: 4px;
        }
        .nav-label {
          font-size: 11px;
          font-weight: 600;
          color: #C4C7C5;
          transition: color 0.2s;
          letter-spacing: 0.3px;
        }
        .nav-item svg {
          color: #C4C7C5; 
          transition: color 0.2s;
          width: 24px;
          height: 24px;
        }
        .nav-item.active .icon-container {
          background-color: #0000FF; 
        }
        .nav-item.active svg {
          color: #FFFFFF;
        }
        .nav-item.active .nav-label {
          color: #FFFFFF;
        }
        .nav-item:active .icon-container {
          transform: scale(0.95);
        }
      `}</style>
      <div className="flex justify-between items-center h-full max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentIndex === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <div className="icon-container">
                <Icon />
              </div>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
