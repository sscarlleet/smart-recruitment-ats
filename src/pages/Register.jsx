import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Eye, EyeOff } from 'lucide-react';
import '../styles/forms.css';
import '../styles/global.css';

function Register({ onGoLogin }) {
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setSuccess('');
  }

  function validate() {
    const e = {};

    if (form.name.trim().length < 2) {
      e.name = 'Name must contain at least 2 characters.';
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = 'Enter a valid email address.';
    }

    if (form.password.length < 8) {
      e.password = 'Password must contain at least 8 characters.';
    }

    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSuccess('');

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    const result = await register(
      form.name,
      form.email,
      form.password
    );

    setLoading(false);

    if (result.success) {
      setSuccess('Account created successfully! Please sign in.');
      setForm({ name: '', email: '', password: '' });
      setErrors({});
    } else {
      setErrors({ email: result.message });
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <div style={{ background: '#1e3a8a', borderRadius: 10, padding: '10px 14px' }}>
              <Briefcase size={28} color="#fff" />
            </div>
          </div>
          <h1>SmartATS</h1>
          <p>Create your account</p>
        </div>

        {success && <div className="success-banner">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              className={`form-control ${errors.name ? 'error' : ''}`}
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Email address</label>
            <input
              className={`form-control ${errors.email ? 'error' : ''}`}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                className={`form-control ${errors.password ? 'error' : ''}`}
                type={showPw ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <button className="btn-auth" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer-link">
          Already have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onGoLogin(); }}>
            Sign In
          </a>
        </div>

      </div>
    </div>
  );
}

export default Register;

