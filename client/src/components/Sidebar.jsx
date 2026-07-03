import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiPlusSquare, FiUser, FiX } from 'react-icons/fi';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
  { to: '/tasks/new', label: 'Create Task', icon: <FiPlusSquare /> },
  { to: '/profile', label: 'Profile', icon: <FiUser /> },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {open && <div className="sidebar-overlay hide-desktop" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <button className="icon-btn hide-desktop sidebar-close" onClick={onClose} aria-label="Close menu">
          <FiX size={20} />
        </button>
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
