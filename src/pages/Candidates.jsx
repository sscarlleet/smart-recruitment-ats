import { useState } from 'react';
import { Eye } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import { SAMPLE_CANDIDATES, SAMPLE_JOBS, PIPELINE_STAGES } from '../data/sampleData';

// Candidates page – HR can search, filter and view candidate profiles
function Candidates() {
  const [candidates, setCandidates] = useState(SAMPLE_CANDIDATES);
  const [search, setSearch]         = useState('');
  const [filterStage, setFilterStage] = useState('All');
  const [filterJob, setFilterJob]   = useState('All');
  const [viewCand, setViewCand]     = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Filter candidates based on search text, stage and job
  const filtered = candidates.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.email.toLowerCase().includes(search.toLowerCase());
    const matchStage  = filterStage === 'All' || c.stage === filterStage;
    const matchJob    = filterJob   === 'All' || c.appliedJob === filterJob;
    return matchSearch && matchStage && matchJob;
  });

  // Move candidate to next stage
  function moveStage(candidateId, newStage) {
    setCandidates((prev) =>
      prev.map((c) => c.id === candidateId ? { ...c, stage: newStage } : c)
    );
    setSuccessMsg('Candidate stage updated.');
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  function stageBadge(stage) {
    const map = {
      Applied:'badge-blue', Screening:'badge-yellow', Shortlisted:'badge-purple',
      Interview:'badge-orange', Selected:'badge-green', Offered:'badge-teal', Rejected:'badge-red',
    };
    return map[stage] || 'badge-gray';
  }

  function getJobTitle(jobId) {
    return SAMPLE_JOBS.find((j) => j.id === jobId)?.title || '—';
  }

  return (
    <div>
      {successMsg && <div className="success-banner">{successMsg}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Candidates</h1>
          <p className="page-subtitle">{filtered.length} of {candidates.length} candidates</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email…" />
        <select className="form-control" style={{ width:'auto' }} value={filterStage} onChange={(e)=>setFilterStage(e.target.value)}>
          <option value="All">All Stages</option>
          {PIPELINE_STAGES.map((s)=><option key={s}>{s}</option>)}
        </select>
        <select className="form-control" style={{ width:'auto' }} value={filterJob} onChange={(e)=>setFilterJob(e.target.value)}>
          <option value="All">All Jobs</option>
          {SAMPLE_JOBS.map((j)=><option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrapper">
          {filtered.length === 0 ? (
            <div className="empty-state"><p>No candidates match your filters.</p></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr><th>Candidate</th><th>Applied For</th><th>Date</th><th>Stage</th><th>Move Stage</th><th>View</th></tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight:600 }}>{c.name}</div>
                      <div style={{ fontSize:12, color:'#64748b' }}>{c.email}</div>
                    </td>
                    <td>{getJobTitle(c.appliedJob)}</td>
                    <td>{c.appliedDate}</td>
                    <td><span className={`badge ${stageBadge(c.stage)}`}>{c.stage}</span></td>
                    <td>
                      <select className="form-control" style={{ padding:'4px 8px', fontSize:12 }}
                        value={c.stage}
                        onChange={(e) => moveStage(c.id, e.target.value)}>
                        {PIPELINE_STAGES.map((s)=><option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <button className="btn-icon" onClick={() => setViewCand(c)}>
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Candidate Profile Modal */}
      <Modal isOpen={!!viewCand} onClose={() => setViewCand(null)} title="Candidate Profile"
        footer={<button className="btn btn-ghost" onClick={() => setViewCand(null)}>Close</button>}>
        {viewCand && (
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
              <div style={{ width:52, height:52, background:'#1e3a8a', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:20 }}>
                {viewCand.name[0]}
              </div>
              <div>
                <h3 style={{ marginBottom:2 }}>{viewCand.name}</h3>
                <p style={{ color:'#64748b', fontSize:13 }}>{viewCand.email} · {viewCand.phone}</p>
                <p style={{ color:'#64748b', fontSize:13 }}>📍 {viewCand.location}</p>
              </div>
            </div>
            <p style={{ marginBottom:10, color:'#475569' }}>{viewCand.summary}</p>
            <div className="form-row" style={{ marginBottom:10 }}>
              <div><strong>Experience:</strong> {viewCand.experience}</div>
              <div><strong>Education:</strong> {viewCand.education}</div>
            </div>
            <div><strong>Skills:</strong></div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:6, marginBottom:12 }}>
              {viewCand.skills.map((s)=><span key={s} className="badge badge-blue">{s}</span>)}
            </div>
            <div><strong>Resume:</strong> <span style={{ color:'#0ea5e9' }}>📄 {viewCand.resume}</span></div>
            <div style={{ marginTop:8 }}>
              <strong>Current Stage:</strong>{' '}
              <span className={`badge ${(() => {
                const map={Applied:'badge-blue',Screening:'badge-yellow',Shortlisted:'badge-purple',Interview:'badge-orange',Selected:'badge-green',Offered:'badge-teal',Rejected:'badge-red'};
                return map[viewCand.stage]||'badge-gray';
              })()}`}>{viewCand.stage}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Candidates;

