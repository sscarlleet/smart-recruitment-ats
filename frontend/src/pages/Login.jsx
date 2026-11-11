import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../data/sampleData';
import { Eye, EyeOff, Briefcase } from 'lucide-react';
import '../styles/forms.css';
import '../styles/global.css';

// Login page – shown when no user is logged in
function Login({ onGoRegister, onGoForgot }) {
  const { login } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  // Fill form with demo credentials on click
  function useDemoCredential(demoEmail, demoPassword) {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  }

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    // Simulated slight delay like a real API call
    await new Promise((r) => setTimeout(r, 600));
    const result = login(email, password);
    if (!result.success) setError(result.message);
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <div style={{ display:'flex', justifyContent:'center', marginBottom:8 }}>
            <div style={{ background:'#1e3a8a', borderRadius:10, padding:'10px 14px' }}>
              <Briefcase size={28} color="#fff" />
            </div>
          </div>
          <h1>SmartATS</h1>
          <p>Recruitment & Applicant Tracking System</p>
        </div>

        <h2 className="auth-heading">Welcome back</h2>
        <p className="auth-subheading">Sign in to your account</p>

        {/* Demo credentials */}
        <div className="demo-box">
          <h4>Demo Credentials</h4>
          {DEMO_USERS.map((u) => (
            <div key={u.id} className="demo-credential">
              <span>{u.role.toUpperCase()} – {u.email} / {u.password}</span>
              <button className="demo-use-btn" onClick={() => useDemoCredential(u.email, u.password)}>
                Use
              </button>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && <div className="error-banner">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address</label>
            <input className="form-control" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input className="form-control" type={showPw ? 'text' : 'password'}
                placeholder="Enter password"
                value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="password-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button className="btn-auth" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer-link">
          <span>Don't have an account? </span>
          <a href="#" onClick={(e) => { e.preventDefault(); onGoRegister(); }}>Register</a>
          {'  |  '}
          <a href="#" onClick={(e) => { e.preventDefault(); onGoForgot(); }}>Forgot password?</a>
        </div>
      </div>
    </div>
  );
}

export default Login;

