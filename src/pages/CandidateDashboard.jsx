import { useAuth } from '../context/AuthContext';
import { FileText, Briefcase, Calendar, CheckCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import { SAMPLE_CANDIDATES, SAMPLE_JOBS, SAMPLE_INTERVIEWS, SAMPLE_OFFERS } from '../data/sampleData';

// CandidateDashboard – overview for the candidate (John Doe) account
function CandidateDashboard() {
  const { user } = useAuth();

  // For the demo, we link to the sample candidate with the same name
  const myCandidate = SAMPLE_CANDIDATES.find((c) => c.name.toLowerCase().includes('john')) || SAMPLE_CANDIDATES[0];
  const myJob       = SAMPLE_JOBS.find((j) => j.id === myCandidate?.appliedJob);
  const myInterview = SAMPLE_INTERVIEWS.find((i) => i.candidateId === myCandidate?.id);
  const myOffer     = SAMPLE_OFFERS.find((o) => o.candidateId === myCandidate?.id);

  function stageBadge(stage) {
    const map = { Applied:'badge-blue', Screening:'badge-yellow', Shortlisted:'badge-purple',
      Interview:'badge-orange', Selected:'badge-green', Offered:'badge-teal', Rejected:'badge-red' };
    return map[stage] || 'badge-gray';
  }

  return (
    <div>
      {/* Welcome */}
      <div className="card" style={{ marginBottom:20, background:'linear-gradient(135deg,#1e3a8a,#3b82f6)', color:'#fff' }}>
        <h2 style={{ fontSize:20, fontWeight:700, marginBottom:4 }}>Welcome back, {user?.name}! 👋</h2>
        <p style={{ opacity:0.85 }}>Here's a quick overview of your job application status.</p>
      </div>

      {/* Stats – each card links to its page */}
      <div className="stats-grid">
        <StatCard label="Applications Submitted" value={1}  icon={FileText}    color="#1e3a8a" bgColor="#eff6ff" link="/candidate/applications" />
        <StatCard label="Open Jobs Available"     value={SAMPLE_JOBS.filter(j=>j.status==='Open').length} icon={Briefcase} color="#0ea5e9" bgColor="#f0f9ff" link="/candidate/jobs" />
        <StatCard label="Interviews Scheduled"    value={myInterview ? 1 : 0} icon={Calendar}   color="#f59e0b" bgColor="#fffbeb" link="/candidate/applications" />
        <StatCard label="Offers Received"         value={myOffer ? 1 : 0}     icon={CheckCircle} color="#10b981" bgColor="#f0fdf4" link="/candidate/applications" />
      </div>

      {/* Application status */}
      <div className="dashboard-grid">
        <div className="card">
          <h3 className="card-title">My Application</h3>
          {myCandidate ? (
            <div>
              <p><strong>Job:</strong> {myJob?.title || '—'}</p>
              <p style={{ marginTop:8 }}><strong>Department:</strong> {myJob?.department}</p>
              <p style={{ marginTop:8 }}><strong>Applied On:</strong> {myCandidate.appliedDate}</p>
              <p style={{ marginTop:8 }}><strong>Current Stage:</strong>{' '}
                <span className={`badge ${stageBadge(myCandidate.stage)}`}>{myCandidate.stage}</span>
              </p>
            </div>
          ) : <p>No applications yet.</p>}
        </div>

        <div className="card">
          <h3 className="card-title">Interview Details</h3>
          {myInterview ? (
            <div>
              <p><strong>Date:</strong> {myInterview.date}</p>
              <p style={{ marginTop:8 }}><strong>Time:</strong> {myInterview.time}</p>
              <p style={{ marginTop:8 }}><strong>Type:</strong> {myInterview.type}</p>
              <p style={{ marginTop:8 }}><strong>Interviewer:</strong> {myInterview.interviewer}</p>
              <p style={{ marginTop:8 }}><strong>Status:</strong>{' '}
                <span className={`badge ${myInterview.status==='Scheduled'?'badge-blue':'badge-green'}`}>{myInterview.status}</span>
              </p>
              {myInterview.link && <p style={{ marginTop:8 }}><strong>Link:</strong> <a href={myInterview.link} style={{ color:'#0ea5e9' }}>{myInterview.link}</a></p>}
            </div>
          ) : <p style={{ color:'#94a3b8' }}>No interview scheduled yet.</p>}
        </div>
      </div>
    </div>
  );
}

export default CandidateDashboard;
