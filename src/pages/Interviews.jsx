import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';
import { SAMPLE_INTERVIEWS, SAMPLE_CANDIDATES } from '../data/sampleData';

const EMPTY_FORM = { candidateId:'', date:'', time:'', type:'Online', interviewer:'', notes:'' };

// Interviews page – HR can view and schedule interviews
function Interviews() {
  const [interviews, setInterviews] = useState(SAMPLE_INTERVIEWS);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [errors, setErrors]         = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.candidateId) e.candidateId = 'Please select a candidate.';
    if (!form.date)         e.date        = 'Date is required.';
    if (!form.time)         e.time        = 'Time is required.';
    if (!form.interviewer.trim()) e.interviewer = 'Interviewer name is required.';
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const cand = SAMPLE_CANDIDATES.find((c) => c.id === form.candidateId);
    const job  = cand ? cand.appliedJob : '';
    const newInterview = {
      id: `I${Date.now()}`,
      candidateId: form.candidateId,
      candidateName: cand?.name || '',
      jobTitle: cand?.appliedJob || '',
      date: form.date, time: form.time,
      type: form.type, interviewer: form.interviewer,
      status: 'Scheduled', notes: form.notes, link: '',
    };
    setInterviews((prev) => [newInterview, ...prev]);
    setSuccessMsg('Interview scheduled successfully.');
    setShowForm(false);
    setForm(EMPTY_FORM);
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  // Update interview status
  function updateStatus(id, status) {
    setInterviews((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
  }

  function statusBadge(status) {
    if (status === 'Scheduled')  return 'badge-blue';
    if (status === 'Completed')  return 'badge-green';
    if (status === 'Cancelled')  return 'badge-red';
    return 'badge-gray';
  }

  return (
    <div>
      {successMsg && <div className="success-banner">{successMsg}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Interviews</h1>
          <p className="page-subtitle">{interviews.length} interviews</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setErrors({}); setForm(EMPTY_FORM); }}>
          <Plus size={15} /> Schedule Interview
        </button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          {interviews.length === 0 ? (
            <div className="empty-state"><p>No interviews scheduled yet.</p></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr><th>Candidate</th><th>Job</th><th>Date & Time</th><th>Type</th><th>Interviewer</th><th>Status</th><th>Update</th></tr>
              </thead>
              <tbody>
                {interviews.map((i) => (
                  <tr key={i.id}>
                    <td style={{ fontWeight:600 }}>{i.candidateName}</td>
                    <td>{i.jobTitle}</td>
                    <td>{i.date} at {i.time}</td>
                    <td>{i.type}</td>
                    <td>{i.interviewer}</td>
                    <td><span className={`badge ${statusBadge(i.status)}`}>{i.status}</span></td>
                    <td>
                      <select className="form-control" style={{ padding:'4px 8px', fontSize:12 }}
                        value={i.status}
                        onChange={(e) => updateStatus(i.id, e.target.value)}>
                        {['Scheduled','Completed','Cancelled'].map((s)=><option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Schedule Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Schedule Interview"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Schedule</button>
          </>
        }>
        <div className="form-group">
          <label>Candidate *</label>
          <select className={`form-control ${errors.candidateId?'error':''}`} value={form.candidateId} onChange={(e)=>handleChange('candidateId',e.target.value)}>
            <option value="">— Select candidate —</option>
            {SAMPLE_CANDIDATES.map((c)=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.candidateId && <p className="field-error">{errors.candidateId}</p>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Date *</label>
            <input type="date" className={`form-control ${errors.date?'error':''}`} value={form.date} onChange={(e)=>handleChange('date',e.target.value)} />
            {errors.date && <p className="field-error">{errors.date}</p>}
          </div>
          <div className="form-group">
            <label>Time *</label>
            <input type="time" className={`form-control ${errors.time?'error':''}`} value={form.time} onChange={(e)=>handleChange('time',e.target.value)} />
            {errors.time && <p className="field-error">{errors.time}</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Interview Type</label>
            <select className="form-control" value={form.type} onChange={(e)=>handleChange('type',e.target.value)}>
              <option>Online</option><option>Offline</option>
            </select>
          </div>
          <div className="form-group">
            <label>Interviewer Name *</label>
            <input className={`form-control ${errors.interviewer?'error':''}`} value={form.interviewer} onChange={(e)=>handleChange('interviewer',e.target.value)} />
            {errors.interviewer && <p className="field-error">{errors.interviewer}</p>}
          </div>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea className="form-control" rows={3} value={form.notes} onChange={(e)=>handleChange('notes',e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}

export default Interviews;

