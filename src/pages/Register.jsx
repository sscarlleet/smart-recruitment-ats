import { useState } from 'react';
import { Briefcase, Eye, EyeOff } from 'lucide-react';
import '../styles/forms.css';
import '../styles/global.css';

// Register page – demo only, does not save to a backend
function Register({ onGoLogin }) {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'candidate' });
  const [showPw, setShowPw]   = useState(false);
  const [errors, setErrors]   = useState({});
  const [success, setSuccess] = useState('');

  // Update a single field in the form object
  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  // Basic validation
  function validate() {
    const e = {};
    if (!form.name.trim())     e.name     = 'Full name is required.';
    if (!form.email.trim())    e.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    return e;
  }

  // Submit handler
  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setSuccess('Account created! This is a demo – please use the sample login credentials to sign in.');
    setForm({ name:'', email:'', password:'', role:'candidate' });
  }

  const roles = ['candidate', 'hr', 'admin'];

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{ display:'flex', justifyContent:'center', marginBottom:8 }}>
            <div style={{ background:'#1e3a8a', borderRadius:10, padding:'10px 14px' }}>
              <Briefcase size={28} color="#fff" />
            </div>
          </div>
          <h1>SmartATS</h1>
          <p>Create your account</p>
        </div>

        {success && <div className="success-banner">{success}</div>}

        {/* Role selector */}
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:13, fontWeight:500, color:'#334155', display:'block', marginBottom:6 }}>
            Select Role
          </label>
          <div className="role-chips">
            {roles.map((r) => (
              <button key={r} type="button"
                className={`role-chip ${form.role === r ? 'selected' : ''}`}
                onClick={() => handleChange('role', r)}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className={`form-control ${errors.name ? 'error' : ''}`}
              type="text" placeholder="Your full name"
              value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Email address</label>
            <input className={`form-control ${errors.email ? 'error' : ''}`}
              type="email" placeholder="you@example.com"
              value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input className={`form-control ${errors.password ? 'error' : ''}`}
                type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
                value={form.password} onChange={(e) => handleChange('password', e.target.value)} />
              <button type="button" className="password-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <button className="btn-auth" type="submit">Create Account</button>
        </form>

        <div className="auth-footer-link">
          Already have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onGoLogin(); }}>Sign In</a>
        </div>
      </div>
    </div>
  );
}

export default Register;

