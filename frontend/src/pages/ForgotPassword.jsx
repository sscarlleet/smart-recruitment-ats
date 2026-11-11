import { useState } from 'react';
import { Briefcase } from 'lucide-react';
import '../styles/forms.css';
import '../styles/global.css';

// Forgot Password page – demo only, shows a success message
function ForgotPassword({ onGoLogin }) {
  const [email, setEmail]     = useState('');
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email.'); return; }
    setError('');
    setSuccess(`Password reset link sent to ${email} (demo – no real email is sent).`);
  }

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
          <p>Reset your password</p>
        </div>

        <h2 className="auth-heading">Forgot Password</h2>
        <p className="auth-subheading">Enter your email and we'll send a reset link.</p>

        {error   && <div className="error-banner">{error}</div>}
        {success && <div className="success-banner">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address</label>
            <input className="form-control" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} />
          </div>
          <button className="btn-auth" type="submit">Send Reset Link</button>
        </form>

        <div className="auth-footer-link">
          <a href="#" onClick={(e) => { e.preventDefault(); onGoLogin(); }}>← Back to Sign In</a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

