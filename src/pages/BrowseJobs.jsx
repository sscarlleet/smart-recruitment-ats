import { useState } from 'react';
import { MapPin, Clock, DollarSign, Monitor, Server, Users, Palette, Cloud, Briefcase, BarChart3, Smartphone, PenTool, Shield, Target, CheckSquare } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import { SAMPLE_JOBS } from '../data/sampleData';

// Map icon name (from sampleData) to the actual Lucide component
const ICON_MAP = {
  Monitor, Server, Users, Palette, Cloud, Briefcase,
  BarChart3, Smartphone, PenTool, Shield, Target, CheckSquare,
};

// Fallback banner for jobs that don't have one set
const DEFAULT_BANNER = { gradient: 'linear-gradient(135deg, #64748b, #475569)', icon: 'Briefcase' };

// BrowseJobs – candidates can browse and apply for open jobs
function BrowseJobs() {
  const [search, setSearch]       = useState('');
  const [filterType, setFilterType] = useState('All');
  const [applyJob, setApplyJob]   = useState(null);
  const [form, setForm]           = useState({ name:'', email:'', resumeFile:null });
  const [errors, setErrors]       = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [appliedIds, setAppliedIds] = useState([]);

  // Only show open jobs to candidates
  const openJobs = SAMPLE_JOBS.filter((j) => j.status === 'Open');

  const filtered = openJobs.filter((j) => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
                        j.department.toLowerCase().includes(search.toLowerCase()) ||
                        j.location.toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType === 'All' || j.type === filterType;
    return matchSearch && matchType;
  });

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  // Validate application form
  function validate() {
    const e = {};
    if (!form.name.trim())  e.name  = 'Full name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.resumeFile)   e.resume = 'Please upload your resume.';
    else {
      const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowed.includes(form.resumeFile.type)) e.resume = 'Resume must be PDF or DOCX.';
      if (form.resumeFile.size > 2 * 1024 * 1024)  e.resume = 'Resume must be under 2 MB.';
    }
    return e;
  }

  function handleApply() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setAppliedIds((prev) => [...prev, applyJob.id]);
    setSuccessMsg(`Application submitted for ${applyJob.title}!`);
    setApplyJob(null);
    setForm({ name:'', email:'', resumeFile:null });
    setTimeout(() => setSuccessMsg(''), 4000);
  }

  // Render the banner image for a job card
  function renderBanner(job) {
    const banner = job.banner || DEFAULT_BANNER;
    const IconComponent = ICON_MAP[banner.icon] || Briefcase;
    return (
      <div style={{
        background: banner.gradient,
        borderRadius: '8px 8px 0 0',
        height: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decorative circles */}
        <div style={{
          position:'absolute', top:-20, right:-20,
          width:100, height:100, borderRadius:'50%',
          background:'rgba(255,255,255,0.1)',
        }} />
        <div style={{
          position:'absolute', bottom:-30, left:-10,
          width:80, height:80, borderRadius:'50%',
          background:'rgba(255,255,255,0.08)',
        }} />
        {/* Icon */}
        <IconComponent size={48} color="rgba(255,255,255,0.9)" strokeWidth={1.5} />
      </div>
    );
  }

  const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

  return (
    <div>
      {successMsg && <div className="success-banner">{successMsg}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Browse Jobs</h1>
          <p className="page-subtitle">{filtered.length} open positions</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by title, department, location…" />
        <select className="form-control" style={{ width:'auto' }} value={filterType} onChange={(e)=>setFilterType(e.target.value)}>
          {jobTypes.map((t)=><option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Job cards */}
      {filtered.length === 0 ? (
        <div className="empty-state"><p>No jobs match your search.</p></div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 }}>
          {filtered.map((job) => {
            const alreadyApplied = appliedIds.includes(job.id);
            return (
              <div key={job.id} style={{
                background:'#fff', borderRadius:8,
                boxShadow:'0 1px 3px rgba(0,0,0,0.1)', overflow:'hidden',
                display:'flex', flexDirection:'column',
                transition:'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 20px rgba(0,0,0,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'; }}
              >
                {/* Banner image */}
                {renderBanner(job)}

                {/* Card body */}
                <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:10, flex:1 }}>
                  <div>
                    <h3 style={{ fontSize:16, fontWeight:700, color:'#1e293b' }}>{job.title}</h3>
                    <p style={{ fontSize:13, color:'#64748b' }}>{job.department}</p>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#475569' }}>
                      <MapPin size={13}/> {job.location}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#475569' }}>
                      <Clock size={13}/> {job.type} · {job.experience}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#475569' }}>
                      <DollarSign size={13}/> {job.salary}
                    </div>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                    {job.skills.map((s)=><span key={s} className="badge badge-blue">{s}</span>)}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto', paddingTop:8 }}>
                    <span style={{ fontSize:11, color:'#94a3b8' }}>Deadline: {job.deadline}</span>
                    <button
                      className={`btn ${alreadyApplied ? 'btn-ghost' : 'btn-primary'} btn-sm`}
                      disabled={alreadyApplied}
                      onClick={() => { if (!alreadyApplied) setApplyJob(job); }}>
                      {alreadyApplied ? '✓ Applied' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      <Modal isOpen={!!applyJob} onClose={() => setApplyJob(null)} title={`Apply – ${applyJob?.title}`}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setApplyJob(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleApply}>Submit Application</button>
          </>
        }>
        <div className="form-group">
          <label>Full Name *</label>
          <input className={`form-control ${errors.name?'error':''}`} value={form.name} onChange={(e)=>handleChange('name',e.target.value)} />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label>Email Address *</label>
          <input type="email" className={`form-control ${errors.email?'error':''}`} value={form.email} onChange={(e)=>handleChange('email',e.target.value)} />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label>Resume * (PDF or DOCX, max 2 MB)</label>
          <input type="file" accept=".pdf,.docx" className="form-control"
            onChange={(e) => handleChange('resumeFile', e.target.files[0] || null)} />
          {errors.resume && <p className="field-error">{errors.resume}</p>}
        </div>
      </Modal>
    </div>
  );
}

export default BrowseJobs;
