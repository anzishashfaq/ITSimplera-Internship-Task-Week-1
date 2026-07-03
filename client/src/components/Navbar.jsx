import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiMoon, FiSun, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <button className="icon-btn hide-desktop" onClick={onToggleSidebar} aria-label="Toggle menu">
        <FiMenu size={22} />
      </button>

      <Link to="/dashboard" className="navbar-brand">
        TaskFlow
      </Link>

      <div className="navbar-actions">
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button>

        {user && (
          <div className="navbar-user">
            <button
              className="user-chip"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="User menu"
            >
              <span className="avatar-circle">{user.name?.charAt(0).toUpperCase()}</span>
              <span className="hide-mobile">{user.name}</span>
            </button>

            {menuOpen && (
              <div className="user-dropdown" onMouseLeave={() => setMenuOpen(false)}>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  <FiUser /> Profile
                </Link>
                <button onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
