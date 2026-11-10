import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, CheckCircle, Calendar } from 'lucide-react';
import StatCard from '../components/StatCard';
import { SAMPLE_JOBS, SAMPLE_CANDIDATES, SAMPLE_INTERVIEWS } from '../data/sampleData';

// HRDashboard – overview page for HR/Recruiter role
function HRDashboard() {
  const navigate = useNavigate();

  const openJobs      = SAMPLE_JOBS.filter((j) => j.status === 'Open').length;
  const totalApps     = SAMPLE_CANDIDATES.length;
  const shortlisted   = SAMPLE_CANDIDATES.filter((c) => c.stage === 'Shortlisted' || c.stage === 'Selected').length;
  const interviews    = SAMPLE_INTERVIEWS.filter((i) => i.status === 'Scheduled').length;

  const recentApps    = [...SAMPLE_CANDIDATES].sort((a, b) => b.appliedDate.localeCompare(a.appliedDate)).slice(0, 5);

  // Map stage to badge colour class
  function stageBadge(stage) {
    const map = {
      Applied:'badge-blue', Screening:'badge-yellow', Shortlisted:'badge-purple',
      Interview:'badge-orange', Selected:'badge-green', Offered:'badge-teal', Rejected:'badge-red',
    };
    return map[stage] || 'badge-gray';
  }

  return (
    <div>
      {/* Stats – each card links to its page */}
      <div className="stats-grid">
        <StatCard label="Open Jobs"            value={openJobs}    icon={Briefcase}   color="#1e3a8a" bgColor="#eff6ff" link="/hr/jobs" />
        <StatCard label="Total Applications"   value={totalApps}   icon={Users}       color="#0ea5e9" bgColor="#f0f9ff" link="/hr/candidates" />
        <StatCard label="Shortlisted"          value={shortlisted} icon={CheckCircle} color="#10b981" bgColor="#f0fdf4" link="/hr/pipeline" />
        <StatCard label="Interviews Scheduled" value={interviews}  icon={Calendar}    color="#f59e0b" bgColor="#fffbeb" link="/hr/interviews" />
      </div>

      {/* Recent Applications table */}
      <div className="card">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h3 className="card-title" style={{ marginBottom:0 }}>Recent Applications</h3>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/hr/candidates')}>
            View All →
          </button>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidate</th><th>Applied For</th><th>Date</th><th>Stage</th>
              </tr>
            </thead>
            <tbody>
              {recentApps.map((c) => {
                const job = SAMPLE_JOBS.find((j) => j.id === c.appliedJob);
                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight:600 }}>{c.name}</div>
                      <div style={{ fontSize:12, color:'#64748b' }}>{c.email}</div>
                    </td>
                    <td>{job?.title || '—'}</td>
                    <td>{c.appliedDate}</td>
                    <td><span className={`badge ${stageBadge(c.stage)}`}>{c.stage}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HRDashboard;
