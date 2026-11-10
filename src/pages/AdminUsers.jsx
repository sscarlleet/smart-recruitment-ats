import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import { DEMO_USERS } from '../data/sampleData';

const EMPTY_FORM = { name: '', email: '', role: 'candidate' };

// AdminUsers – Admin can view, add, edit and delete system users
function AdminUsers() {
  const [users, setUsers]         = useState(DEMO_USERS);
  const [search, setSearch]       = useState('');
  const [showForm, setShowForm]   = useState(false);
  const [editUser, setEditUser]   = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  // Filter users by search text
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Open form to add a new user
  function openAdd() {
    setEditUser(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(true);
  }

  // Open form to edit an existing user
  function openEdit(user) {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, role: user.role });
    setErrors({});
    setShowForm(true);
  }

  // Update a form field
  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  // Validate required fields and email format
  function validate() {
    const e = {};
    if (!form.name.trim())  e.name  = 'Full name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    return e;
  }

  // Save user (add or update)
  function handleSave() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    if (editUser) {
      setUsers((prev) =>
        prev.map((u) => u.id === editUser.id ? { ...u, ...form } : u)
      );
      setSuccessMsg('User updated successfully.');
    } else {
      const newUser = { id: Date.now(), ...form, password: 'demo123' };
      setUsers((prev) => [...prev, newUser]);
      setSuccessMsg('User added successfully.');
    }
    setShowForm(false);
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  // Delete a user
  function handleDelete(id) {
    if (!window.confirm('Delete this user?')) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setSuccessMsg('User deleted.');
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  // Pick badge colour by role
  function roleBadge(role) {
    if (role === 'admin')     return 'badge-purple';
    if (role === 'hr')        return 'badge-blue';
    return 'badge-green';
  }

  return (
    <div>
      {successMsg && <div className="success-banner">{successMsg}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">{users.length} total users</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search users…" />
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={15} /> Add User
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          {filtered.length === 0 ? (
            <div className="empty-state"><p>No users found.</p></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id}>
                    <td style={{ color: '#94a3b8' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${roleBadge(u.role)}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-icon" title="Edit" onClick={() => openEdit(u)}>
                          <Pencil size={15} />
                        </button>
                        <button className="btn-icon" title="Delete"
                          onClick={() => handleDelete(u.id)}
                          style={{ color: '#ef4444' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editUser ? 'Edit User' : 'Add New User'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save User</button>
          </>
        }>
        <div className="form-group">
          <label>Full Name *</label>
          <input
            className={`form-control ${errors.name ? 'error' : ''}`}
            placeholder="e.g. Sara HR"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'error' : ''}`}
            placeholder="user@example.com"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            className="form-control"
            value={form.role}
            onChange={(e) => handleChange('role', e.target.value)}>
            <option value="candidate">Candidate</option>
            <option value="hr">HR / Recruiter</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {!editUser && (
          <p style={{ fontSize: 12, color: '#64748b' }}>
            Default password will be set to <strong>demo123</strong>.
            The user should change it after first login.
          </p>
        )}
      </Modal>
    </div>
  );
}

export default AdminUsers;

