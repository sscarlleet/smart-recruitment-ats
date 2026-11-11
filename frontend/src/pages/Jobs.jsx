import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import { SAMPLE_JOBS } from '../data/sampleData';

// Initial state used when opening the add/edit job form
const EMPTY_FORM = {
  title:'', department:'', location:'', type:'Full-time', experience:'',
  salary:'', deadline:'', skills:'', description:'', status:'Open',
};

// Jobs page – HR can view, add, edit, delete jobs
function Jobs() {
  const [jobs, setJobs]           = useState(SAMPLE_JOBS);
  const [search, setSearch]       = useState('');
  const [showForm, setShowForm]   = useState(false);
  const [showView, setShowView]   = useState(false);
  const [editJob, setEditJob]     = useState(null);  // null = adding new
  const [viewJob, setViewJob]     = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  // Filter jobs by search text
  const filtered = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.department.toLowerCase().includes(search.toLowerCase())
  );

  // Open form to add a new job
  function openAdd() {
    setEditJob(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(true);
  }

  // Open form to edit an existing job
  function openEdit(job) {
    setEditJob(job);
    setForm({ ...job, skills: job.skills.join(', ') });
    setErrors({});
    setShowForm(true);
  }

  // Open detail view modal
  function openView(job) {
    setViewJob(job);
    setShowView(true);
  }

  // Update a form field
  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  // Validate required fields
  function validate() {
    const e = {};
    if (!form.title.trim())       e.title       = 'Job title is required.';
    if (!form.department.trim())  e.department  = 'Department is required.';
    if (!form.location.trim())    e.location    = 'Location is required.';
    if (!form.deadline)           e.deadline    = 'Deadline is required.';
    return e;
  }

  // Save job (add or update)
  function handleSave() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const skillsArray = form.skills.split(',').map((s) => s.trim()).filter(Boolean);
    if (editJob) {
      setJobs((prev) => prev.map((j) => j.id === editJob.id ? { ...form, id: editJob.id, skills: skillsArray } : j));
      setSuccessMsg('Job updated successfully.');
    } else {
      const newJob = { ...form, id: `J${Date.now()}`, skills: skillsArray, postedDate: new Date().toISOString().slice(0,10) };
      setJobs((prev) => [newJob, ...prev]);
      setSuccessMsg('Job added successfully.');
    }
    setShowForm(false);
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  // Delete a job
  function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setSuccessMsg('Job deleted.');
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  // Badge colour by job status
  function statusBadge(status) {
    if (status === 'Open')   return 'badge-green';
    if (status === 'Closed') return 'badge-red';
    return 'badge-gray';
  }

  return (
    <div>
      {successMsg && <div className="success-banner">{successMsg}</div>}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Job Openings</h1>
          <p className="page-subtitle">{jobs.length} total jobs</p>
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search jobs…" />
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={15} /> Add Job
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrapper">
          {filtered.length === 0 ? (
            <div className="empty-state"><p>No jobs found.</p></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr><th>Title</th><th>Department</th><th>Location</th><th>Type</th><th>Deadline</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((j) => (
                  <tr key={j.id}>
                    <td style={{ fontWeight:600 }}>{j.title}</td>
                    <td>{j.department}</td>
                    <td>{j.location}</td>
                    <td>{j.type}</td>
                    <td>{j.deadline}</td>
                    <td><span className={`badge ${statusBadge(j.status)}`}>{j.status}</span></td>
                    <td>
                      <div style={{ display:'flex', gap:4 }}>
                        <button className="btn-icon" title="View"   onClick={() => openView(j)}><Eye    size={15}/></button>
                        <button className="btn-icon" title="Edit"   onClick={() => openEdit(j)}><Pencil size={15}/></button>
                        <button className="btn-icon" title="Delete" onClick={() => handleDelete(j.id)} style={{ color:'#ef4444' }}><Trash2 size={15}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}
        title={editJob ? 'Edit Job' : 'Add New Job'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save Job</button>
          </>
        }>
        <div className="form-row">
          <div className="form-group">
            <label>Job Title *</label>
            <input className={`form-control ${errors.title?'error':''}`} value={form.title} onChange={(e)=>handleChange('title',e.target.value)} />
            {errors.title && <p className="field-error">{errors.title}</p>}
          </div>
          <div className="form-group">
            <label>Department *</label>
            <input className={`form-control ${errors.department?'error':''}`} value={form.department} onChange={(e)=>handleChange('department',e.target.value)} />
            {errors.department && <p className="field-error">{errors.department}</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Location *</label>
            <input className={`form-control ${errors.location?'error':''}`} value={form.location} onChange={(e)=>handleChange('location',e.target.value)} />
            {errors.location && <p className="field-error">{errors.location}</p>}
          </div>
          <div className="form-group">
            <label>Employment Type</label>
            <select className="form-control" value={form.type} onChange={(e)=>handleChange('type',e.target.value)}>
              {['Full-time','Part-time','Contract','Internship','Remote'].map((t)=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Experience Required</label>
            <input className="form-control" placeholder="e.g. 2-4 years" value={form.experience} onChange={(e)=>handleChange('experience',e.target.value)} />
          </div>
          <div className="form-group">
            <label>Salary Range</label>
            <input className="form-control" placeholder="e.g. ₹8L – ₹14L" value={form.salary} onChange={(e)=>handleChange('salary',e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Application Deadline *</label>
            <input type="date" className={`form-control ${errors.deadline?'error':''}`} value={form.deadline} onChange={(e)=>handleChange('deadline',e.target.value)} />
            {errors.deadline && <p className="field-error">{errors.deadline}</p>}
          </div>
          <div className="form-group">
            <label>Status</label>
            <select className="form-control" value={form.status} onChange={(e)=>handleChange('status',e.target.value)}>
              {['Open','Draft','Closed'].map((s)=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Required Skills (comma-separated)</label>
          <input className="form-control" placeholder="React, CSS, JavaScript" value={form.skills} onChange={(e)=>handleChange('skills',e.target.value)} />
        </div>
        <div className="form-group">
          <label>Job Description</label>
          <textarea className="form-control" rows={3} value={form.description} onChange={(e)=>handleChange('description',e.target.value)} />
        </div>
      </Modal>

      {/* View Detail Modal */}
      <Modal isOpen={showView} onClose={() => setShowView(false)}
        title="Job Details"
        footer={<button className="btn btn-ghost" onClick={() => setShowView(false)}>Close</button>}>
        {viewJob && (
          <div>
            <h2 style={{ marginBottom:4 }}>{viewJob.title}</h2>
            <p style={{ color:'#64748b', marginBottom:16 }}>{viewJob.department} · {viewJob.location}</p>
            <div className="form-row" style={{ marginBottom:12 }}>
              <div><strong>Type:</strong> {viewJob.type}</div>
              <div><strong>Experience:</strong> {viewJob.experience}</div>
              <div><strong>Salary:</strong> {viewJob.salary}</div>
              <div><strong>Deadline:</strong> {viewJob.deadline}</div>
            </div>
            <p><strong>Description:</strong></p>
            <p style={{ marginTop:6, marginBottom:12, color:'#475569' }}>{viewJob.description}</p>
            <p><strong>Skills:</strong></p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:6 }}>
              {viewJob.skills.map((s)=><span key={s} className="badge badge-blue">{s}</span>)}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Jobs;

