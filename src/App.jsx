import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';

// Auth pages
import Login          from './pages/Login';
import Register       from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// HR pages
import HRDashboard  from './pages/HRDashboard';
import Jobs         from './pages/Jobs';
import Candidates   from './pages/Candidates';
import Pipeline     from './pages/Pipeline';
import Interviews   from './pages/Interviews';
import Offers       from './pages/Offers';
import Analytics    from './pages/Analytics';
import Notifications from './pages/Notifications';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers     from './pages/AdminUsers';

// Candidate pages
import CandidateDashboard from './pages/CandidateDashboard';
import BrowseJobs         from './pages/BrowseJobs';
import MyApplications     from './pages/MyApplications';

// App decides which screen to show based on login state and role
function App() {
  const { user } = useAuth();

  // Which auth screen to show when not logged in
  const [authScreen, setAuthScreen] = useState('login'); // 'login' | 'register' | 'forgot'

  // If not logged in, show auth screens
  if (!user) {
    if (authScreen === 'register') return <Register onGoLogin={() => setAuthScreen('login')} />;
    if (authScreen === 'forgot')   return <ForgotPassword onGoLogin={() => setAuthScreen('login')} />;
    return (
      <Login
        onGoRegister={() => setAuthScreen('register')}
        onGoForgot={()   => setAuthScreen('forgot')}
      />
    );
  }

  // Logged in – show role-based routes
  return (
    <AppLayout>
      <Routes>

        {/* HR Routes */}
        {user.role === 'hr' && (
          <>
            <Route path="/hr"               element={<HRDashboard />} />
            <Route path="/hr/jobs"          element={<Jobs />} />
            <Route path="/hr/candidates"    element={<Candidates />} />
            <Route path="/hr/pipeline"      element={<Pipeline />} />
            <Route path="/hr/interviews"    element={<Interviews />} />
            <Route path="/hr/offers"        element={<Offers />} />
            <Route path="/hr/analytics"     element={<Analytics />} />
            <Route path="/hr/notifications" element={<Notifications />} />
            <Route path="*"                 element={<Navigate to="/hr" replace />} />
          </>
        )}

        {/* Admin Routes */}
        {user.role === 'admin' && (
          <>
            <Route path="/admin"               element={<AdminDashboard />} />
            <Route path="/admin/users"         element={<AdminUsers />} />
            <Route path="/admin/jobs"          element={<Jobs />} />
            <Route path="/admin/analytics"     element={<Analytics />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="*"                    element={<Navigate to="/admin" replace />} />
          </>
        )}

        {/* Candidate Routes */}
        {user.role === 'candidate' && (
          <>
            <Route path="/candidate"                element={<CandidateDashboard />} />
            <Route path="/candidate/jobs"           element={<BrowseJobs />} />
            <Route path="/candidate/applications"   element={<MyApplications />} />
            <Route path="/candidate/notifications"  element={<Notifications />} />
            <Route path="*"                         element={<Navigate to="/candidate" replace />} />
          </>
        )}

      </Routes>
    </AppLayout>
  );
}

export default App;

