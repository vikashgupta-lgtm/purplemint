import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Users } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
          System<span style={{ color: 'var(--primary-color)' }}>Admin</span>
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">
          Dashboard
        </Link>
        {(user.role === 'Admin' || user.role === 'Manager') && (
          <Link to="/users" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Users size={16} /> Users
          </Link>
        )}
        <Link to="/profile" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <User size={16} /> Profile
        </Link>
        <button className="btn btn-sm" style={{ background: 'transparent', color: 'var(--danger-color)', border: '1px solid var(--danger-color)' }} onClick={handleLogout}>
          <LogOut size={14} style={{ marginRight: '4px' }}/> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
