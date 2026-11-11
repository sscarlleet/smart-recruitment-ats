import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';
import { SAMPLE_OFFERS, SAMPLE_CANDIDATES, SAMPLE_JOBS } from '../data/sampleData';

const EMPTY_FORM = { candidateId:'', offeredSalary:'', joiningDate:'' };

// Offers page – HR can view and create job offers
function Offers() {
  const [offers, setOffers]       = useState(SAMPLE_OFFERS);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  // Only candidates in 'Selected' stage can receive offers
  const eligibleCandidates = SAMPLE_CANDIDATES.filter((c) => c.stage === 'Selected' || c.stage === 'Offered');

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.candidateId)        e.candidateId    = 'Please select a candidate.';
    if (!form.offeredSalary.trim()) e.offeredSalary = 'Offered salary is required.';
    if (!form.joiningDate)        e.joiningDate    = 'Joining date is required.';
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const cand = SAMPLE_CANDIDATES.find((c) => c.id === form.candidateId);
    const job  = SAMPLE_JOBS.find((j) => j.id === cand?.appliedJob);
    const newOffer = {
      id: `O${Date.now()}`,
      candidateId: form.candidateId,
      candidateName: cand?.name || '',
      jobTitle: job?.title || '',
      offeredSalary: form.offeredSalary,
      joiningDate: form.joiningDate,
      status: 'Pending',
      sentDate: new Date().toISOString().slice(0, 10),
    };
    setOffers((prev) => [newOffer, ...prev]);
    setSuccessMsg('Offer created successfully.');
    setShowForm(false);
    setForm(EMPTY_FORM);
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  // Update offer status
  function updateStatus(id, status) {
    setOffers((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  }

  function statusBadge(status) {
    if (status === 'Accepted') return 'badge-green';
    if (status === 'Rejected') return 'badge-red';
    return 'badge-yellow';
  }

  return (
    <div>
      {successMsg && <div className="success-banner">{successMsg}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Offers</h1>
          <p className="page-subtitle">{offers.length} offers sent</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setErrors({}); setForm(EMPTY_FORM); }}>
          <Plus size={15} /> Create Offer
        </button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          {offers.length === 0 ? (
            <div className="empty-state"><p>No offers yet.</p></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr><th>Candidate</th><th>Job</th><th>Offered Salary</th><th>Joining Date</th><th>Sent On</th><th>Status</th><th>Update</th></tr>
              </thead>
              <tbody>
                {offers.map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight:600 }}>{o.candidateName}</td>
                    <td>{o.jobTitle}</td>
                    <td>{o.offeredSalary}</td>
                    <td>{o.joiningDate}</td>
                    <td>{o.sentDate}</td>
                    <td><span className={`badge ${statusBadge(o.status)}`}>{o.status}</span></td>
                    <td>
                      <select className="form-control" style={{ padding:'4px 8px', fontSize:12 }}
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}>
                        {['Pending','Accepted','Rejected'].map((s)=><option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Offer Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Create Offer"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Send Offer</button>
          </>
        }>
        <div className="form-group">
          <label>Candidate *</label>
          <select className={`form-control ${errors.candidateId?'error':''}`} value={form.candidateId} onChange={(e)=>handleChange('candidateId',e.target.value)}>
            <option value="">— Select candidate —</option>
            {eligibleCandidates.map((c)=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.candidateId && <p className="field-error">{errors.candidateId}</p>}
          <p style={{ fontSize:12, color:'#64748b', marginTop:4 }}>Only candidates in Selected or Offered stage appear here.</p>
        </div>
        <div className="form-group">
          <label>Offered Salary *</label>
          <input className={`form-control ${errors.offeredSalary?'error':''}`} placeholder="e.g. ₹15L per annum" value={form.offeredSalary} onChange={(e)=>handleChange('offeredSalary',e.target.value)} />
          {errors.offeredSalary && <p className="field-error">{errors.offeredSalary}</p>}
        </div>
        <div className="form-group">
          <label>Joining Date *</label>
          <input type="date" className={`form-control ${errors.joiningDate?'error':''}`} value={form.joiningDate} onChange={(e)=>handleChange('joiningDate',e.target.value)} />
          {errors.joiningDate && <p className="field-error">{errors.joiningDate}</p>}
        </div>
      </Modal>
    </div>
  );
}

export default Offers;

