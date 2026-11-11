import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import { SAMPLE_JOBS, SAMPLE_CANDIDATES, DEMO_USERS } from '../data/sampleData';

// AdminDashboard – overview for the Admin role
function AdminDashboard() {
  const totalHR   = DEMO_USERS.filter((u) => u.role === 'hr').length;
  const totalCand = DEMO_USERS.filter((u) => u.role === 'candidate').length;
  const totalJobs = SAMPLE_JOBS.length;
  const totalApps = SAMPLE_CANDIDATES.length;

  return (
    <div>
      {/* Stats – each card links to its page */}
      <div className="stats-grid">
        <StatCard label="HR Users"           value={totalHR}   icon={Users}     color="#1e3a8a" bgColor="#eff6ff" link="/admin/users" />
        <StatCard label="Candidates"         value={totalCand} icon={Users}     color="#0ea5e9" bgColor="#f0f9ff" link="/admin/users" />
        <StatCard label="Total Jobs"         value={totalJobs} icon={Briefcase} color="#8b5cf6" bgColor="#f5f3ff" link="/admin/jobs" />
        <StatCard label="Total Applications" value={totalApps} icon={FileText}  color="#10b981" bgColor="#f0fdf4" link="/admin/analytics" />
      </div>

      {/* Recent activity */}
      <div className="dashboard-grid">
        <div className="card">
          <h3 className="card-title">All Users</h3>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>
              {DEMO_USERS.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight:600 }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role==='admin'?'badge-purple':u.role==='hr'?'badge-blue':'badge-green'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3 className="card-title">Job Overview</h3>
          <table className="data-table">
            <thead><tr><th>Title</th><th>Department</th><th>Status</th></tr></thead>
            <tbody>
              {SAMPLE_JOBS.map((j) => (
                <tr key={j.id}>
                  <td style={{ fontWeight:600 }}>{j.title}</td>
                  <td>{j.department}</td>
                  <td>
                    <span className={`badge ${j.status==='Open'?'badge-green':j.status==='Draft'?'badge-yellow':'badge-red'}`}>
                      {j.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
