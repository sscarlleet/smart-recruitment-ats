import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

import HRDashboard from './pages/HRDashboard';
import Jobs from './pages/Jobs';
import Candidates from './pages/Candidates';
import Pipeline from './pages/Pipeline';
import Interviews from './pages/Interviews';
import Offers from './pages/Offers';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';

import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';

import CandidateDashboard from './pages/CandidateDashboard';
import BrowseJobs from './pages/BrowseJobs';
import MyApplications from './pages/MyApplications';

function App() {
  const { user } = useAuth();
  const [authScreen, setAuthScreen] = useState('login');

  if (!user) {
    if (authScreen === 'register') {
      return <Register onGoLogin={() => setAuthScreen('login')} />;
    }

    if (authScreen === 'forgot') {
      return <ForgotPassword onGoLogin={() => setAuthScreen('login')} />;
    }

    return (
      <Login
        onGoRegister={() => setAuthScreen('register')}
        onGoForgot={() => setAuthScreen('forgot')}
      />
    );
  }

  const role = user.role?.toLowerCase();

  return (
    <AppLayout>
      <Routes>

        {role === 'hr' && (
          <>
            <Route path="/hr" element={<HRDashboard />} />
            <Route path="/hr/jobs" element={<Jobs />} />
            <Route path="/hr/candidates" element={<Candidates />} />
            <Route path="/hr/pipeline" element={<Pipeline />} />
            <Route path="/hr/interviews" element={<Interviews />} />
            <Route path="/hr/offers" element={<Offers />} />
            <Route path="/hr/analytics" element={<Analytics />} />
            <Route path="/hr/notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="/hr" replace />} />
          </>
        )}

        {role === 'admin' && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/jobs" element={<Jobs />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        )}

        {role === 'candidate' && (
          <>
            <Route path="/candidate" element={<CandidateDashboard />} />
            <Route path="/candidate/jobs" element={<BrowseJobs />} />
            <Route path="/candidate/applications" element={<MyApplications />} />
            <Route path="/candidate/notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="/candidate" replace />} />
          </>
        )}

        {!['admin', 'hr', 'candidate'].includes(role) && (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}

      </Routes>
    </AppLayout>
  );
}

export default App;
