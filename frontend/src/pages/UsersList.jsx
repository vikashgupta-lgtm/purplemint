import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Edit2, Trash2, Plus, X } from 'lucide-react';

const UsersList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals Data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'User', status: 'active' });

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (usr = null) => {
    setEditingUser(usr);
    if (usr) {
      setFormData({ name: usr.name, email: usr.email, password: '', role: usr.role, status: usr.status });
    } else {
      setFormData({ name: '', email: '', password: '', role: 'User', status: 'active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, formData);
      } else {
        await api.post('/users', formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>User Management</h1>
        {user.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => openModal()} style={{ width: 'auto' }}>
            <Plus size={18} /> Add User
          </button>
        )}
      </div>

      <div className="glass-panel table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((usr) => (
              <tr key={usr._id}>
                <td>
                  <div style={{ fontWeight: '500' }}>{usr.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Created by {usr.createdBy?.name || 'System'}
                  </div>
                </td>
                <td>{usr.email}</td>
                <td>
                  <span className={`badge badge-${usr.role}`}>{usr.role}</span>
                </td>
                <td>
                  <span className={`badge badge-${usr.status}`}>{usr.status}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* Role Guards */}
                    {((user.role === 'Admin') || (user.role === 'Manager' && usr.role !== 'Admin')) && (
                      <button 
                        onClick={() => openModal(usr)} 
                        className="btn btn-sm"
                        style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                    )}
                    {user.role === 'Admin' && usr._id !== user._id && (
                      <button 
                         onClick={() => handleDelete(usr._id)}
                         className="btn btn-sm"
                         style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: 'var(--surface-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2>{editingUser ? 'Edit User' : 'Add User'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              {(!editingUser || formData.password !== undefined) && (
                <div className="form-group">
                  <label className="form-label">{editingUser ? 'New Password (Leave blank to keep current)' : 'Password'}</label>
                  <input type="password" className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!editingUser} />
                </div>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} disabled={user.role !== 'Admin'} style={{ appearance: 'none', background: 'var(--surface-hover)' }}>
                    <option value="User">User</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ appearance: 'none', background: 'var(--surface-hover)' }}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)} style={{ background: 'var(--surface-hover)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>{editingUser ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
