import { SAMPLE_CANDIDATES, SAMPLE_JOBS, SAMPLE_INTERVIEWS, SAMPLE_OFFERS } from '../data/sampleData';

// MyApplications – candidate view of their own submitted applications
function MyApplications() {
  // Demo: show the sample candidate's application details
  const myCandidate = SAMPLE_CANDIDATES[0]; // John Doe is the demo candidate
  const myJob       = SAMPLE_JOBS.find((j) => j.id === myCandidate.appliedJob);
  const myInterview = SAMPLE_INTERVIEWS.find((i) => i.candidateId === myCandidate.id);
  const myOffer     = SAMPLE_OFFERS.find((o) => o.candidateId === myCandidate.id);

  function stageBadge(stage) {
    const map = { Applied:'badge-blue', Screening:'badge-yellow', Shortlisted:'badge-purple',
      Interview:'badge-orange', Selected:'badge-green', Offered:'badge-teal', Rejected:'badge-red' };
    return map[stage] || 'badge-gray';
  }

  // Show a timeline of stages the application has passed through
  const allStages = ['Applied','Screening','Shortlisted','Interview','Selected','Offered'];
  const currentIndex = allStages.indexOf(myCandidate.stage);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Applications</h1>
          <p className="page-subtitle">Track your application status below</p>
        </div>
      </div>

      {/* Application card */}
      <div className="card" style={{ marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <h3 style={{ fontSize:17, fontWeight:700 }}>{myJob?.title}</h3>
            <p style={{ color:'#64748b', fontSize:13 }}>{myJob?.department} · {myJob?.location}</p>
            <p style={{ color:'#94a3b8', fontSize:12, marginTop:4 }}>Applied on {myCandidate.appliedDate}</p>
          </div>
          <span className={`badge ${stageBadge(myCandidate.stage)}`} style={{ height:'fit-content' }}>
            {myCandidate.stage}
          </span>
        </div>

        {/* Stage timeline */}
        <div style={{ marginTop:24 }}>
          <p style={{ fontWeight:600, marginBottom:12 }}>Application Progress</p>
          <div style={{ display:'flex', alignItems:'center', gap:0, overflowX:'auto' }}>
            {allStages.map((stage, idx) => {
              const done   = idx <= currentIndex;
              const active = idx === currentIndex;
              return (
                <div key={stage} style={{ display:'flex', alignItems:'center', flex:1, minWidth:80 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1 }}>
                    <div style={{
                      width:28, height:28, borderRadius:'50%',
                      background: done ? '#1e3a8a' : '#e2e8f0',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      color:'#fff', fontSize:12, fontWeight:700,
                      border: active ? '3px solid #0ea5e9' : 'none',
                    }}>
                      {done ? '✓' : idx + 1}
                    </div>
                    <p style={{ fontSize:10, marginTop:4, textAlign:'center', color: done ? '#1e3a8a' : '#94a3b8', fontWeight: active ? 700 : 400 }}>
                      {stage}
                    </p>
                  </div>
                  {idx < allStages.length - 1 && (
                    <div style={{ flex:1, height:2, background: idx < currentIndex ? '#1e3a8a' : '#e2e8f0' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interview details */}
      {myInterview && (
        <div className="card" style={{ marginBottom:20 }}>
          <h3 className="card-title">📅 Interview Details</h3>
          <div className="form-row">
            <div><strong>Date:</strong> {myInterview.date}</div>
            <div><strong>Time:</strong> {myInterview.time}</div>
            <div><strong>Type:</strong> {myInterview.type}</div>
            <div><strong>Interviewer:</strong> {myInterview.interviewer}</div>
          </div>
          {myInterview.notes && <p style={{ marginTop:10, color:'#475569' }}>📝 {myInterview.notes}</p>}
          {myInterview.link  && <p style={{ marginTop:8 }}>🔗 <a href={myInterview.link} style={{ color:'#0ea5e9' }}>{myInterview.link}</a></p>}
        </div>
      )}

      {/* Offer details */}
      {myOffer && (
        <div className="card">
          <h3 className="card-title">🎉 Offer Details</h3>
          <div className="form-row">
            <div><strong>Offered Salary:</strong> {myOffer.offeredSalary}</div>
            <div><strong>Joining Date:</strong> {myOffer.joiningDate}</div>
            <div><strong>Sent On:</strong> {myOffer.sentDate}</div>
            <div><strong>Status:</strong>{' '}
              <span className={`badge ${myOffer.status==='Accepted'?'badge-green':myOffer.status==='Rejected'?'badge-red':'badge-yellow'}`}>
                {myOffer.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyApplications;

