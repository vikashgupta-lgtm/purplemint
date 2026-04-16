import { useAuth } from '../context/AuthContext';
import { User, Shield, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome, {user.name}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Here is your system overview.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ p: '1rem', background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <User color="#60a5fa" size={32} />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-secondary)' }}>Your Role</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '600' }}>{user.role}</p>
          </div>
        </div>
        
        <div className="glass-panel card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ p: '1rem', background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <Activity color="#34d399" size={32} />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-secondary)' }}>Account Status</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '600', textTransform: 'capitalize' }}>{user.status}</p>
          </div>
        </div>

        {(user.role === 'Admin' || user.role === 'Manager') && (
          <div className="glass-panel card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ p: '1rem', background: 'rgba(168, 85, 247, 0.2)', padding: '1rem', borderRadius: '50%' }}>
              <Shield color="#c084fc" size={32} />
            </div>
            <div>
              <h3 style={{ color: 'var(--text-secondary)' }}>Access Level</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: '600' }}>Privileged</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
