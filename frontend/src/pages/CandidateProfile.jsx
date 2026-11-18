import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';

const API = 'https://smart-recruitment-ats.onrender.com/api';
const emptyProfile = { phone:'', location:'', headline:'', summary:'', linkedinUrl:'', portfolioUrl:'', skills:[] };
const inputStyle = { width:'100%', padding:10, border:'1px solid #cbd5e1', borderRadius:6, marginTop:5, boxSizing:'border-box' };
const labelStyle = { display:'block', marginBottom:14, fontSize:14, fontWeight:600 };

function CandidateProfile() {
  const [profile,setProfile] = useState(emptyProfile);
  const [education,setEducation] = useState([]);
  const [resume,setResume] = useState(null);
  const [skillText,setSkillText] = useState('');
  const [edu,setEdu] = useState({institution:'',degree:'',fieldOfStudy:'',startYear:'',endYear:'',grade:'',description:''});
  const [loading,setLoading] = useState(true);
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState('');
  const [error,setError] = useState('');

  const load = async () => {
    try {
      const [p,e] = await Promise.all([apiRequest('/profile'),apiRequest('/profile/education')]);
      if (p.profile) {
        setProfile({...emptyProfile,...p.profile});
        setSkillText((p.profile.skills || []).join(', '));
        setResume(p.profile.resumeOriginalName ? {originalName:p.profile.resumeOriginalName,size:p.profile.resumeSize,uploadedAt:p.profile.resumeUploadedAt} : null);
      }
      setEducation(e.education || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  useEffect(()=>{ load(); },[]);

  const change = e => setProfile(v=>({...v,[e.target.name]:e.target.value}));
  const save = async e => {
    e.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const payload = {...profile, skills:skillText.split(',').map(s=>s.trim()).filter(Boolean)};
      ['id','userId','createdAt','updatedAt','education','resumeOriginalName','resumeStoredName','resumeMimeType','resumeSize','resumeUploadedAt'].forEach(k=>delete payload[k]);
      const result = await apiRequest('/profile',{method:'PUT',body:JSON.stringify(payload)});
      setProfile(v=>({...v,...result.profile}));
      setMessage('Profile saved successfully.');
    } catch(err){setError(err.message);} finally{setBusy(false);}
  };
  const addEducation = async e => {
    e.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const payload = {...edu,startYear:edu.startYear ? Number(edu.startYear):undefined,endYear:edu.endYear ? Number(edu.endYear):undefined};
      Object.keys(payload).forEach(k=>{if(payload[k]==='' || payload[k]===undefined) delete payload[k];});
      const result = await apiRequest('/profile/education',{method:'POST',body:JSON.stringify(payload)});
      setEducation(v=>[result.education,...v]);
      setEdu({institution:'',degree:'',fieldOfStudy:'',startYear:'',endYear:'',grade:'',description:''});
      setMessage('Education added.');
    } catch(err){setError(err.message);} finally{setBusy(false);}
  };
  const deleteEducation = async id => {
    if(!window.confirm('Delete this education record?')) return;
    try { await apiRequest('/profile/education/'+id,{method:'DELETE'}); setEducation(v=>v.filter(x=>x.id!==id)); }
    catch(err){setError(err.message);}
  };
  const upload = async e => {
    const file=e.target.files?.[0]; if(!file)return;
    const form=new FormData(); form.append('resume',file);
    setBusy(true);setError('');setMessage('');
    try {
      const r=await fetch(API+'/profile/resume',{method:'POST',headers:{Authorization:'Bearer '+localStorage.getItem('ats_token')},body:form});
      const data=await r.json(); if(!r.ok) throw new Error(data.message||'Upload failed');
      setResume(data.resume);setMessage('Resume uploaded successfully.');
    } catch(err){setError(err.message);} finally{setBusy(false);e.target.value='';}
  };
  const download = async () => {
    try {
      const r=await fetch(API+'/profile/resume',{headers:{Authorization:'Bearer '+localStorage.getItem('ats_token')}});
      if(!r.ok){const d=await r.json();throw new Error(d.message||'Download failed');}
      const blob=await r.blob();const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=resume?.originalName||'resume';a.click();URL.revokeObjectURL(url);
    } catch(err){setError(err.message);}
  };
  const removeResume = async () => {
    if(!window.confirm('Delete your uploaded resume?'))return;
    try{await apiRequest('/profile/resume',{method:'DELETE'});setResume(null);setMessage('Resume deleted.');}
    catch(err){setError(err.message);}
  };

  if(loading)return <div className="card">Loading profile...</div>;
  return <div>
    <div className="page-header"><div><h1 className="page-title">My Profile</h1><p className="page-subtitle">Manage your personal details, education and resume.</p></div></div>
    {error&&<div className="error-banner" style={{marginBottom:12}}>{error}</div>}
    {message&&<div className="card" style={{marginBottom:12,color:'#166534'}}>{message}</div>}
    <form className="card" onSubmit={save} style={{marginBottom:20}}>
      <h3 className="card-title">Personal Information</h3>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14}}>
        {['phone','location','headline','linkedinUrl','portfolioUrl'].map(k=><label style={labelStyle} key={k}>{({phone:'Phone',location:'Location',headline:'Professional headline',linkedinUrl:'LinkedIn URL',portfolioUrl:'Portfolio URL'})[k]}<input style={inputStyle} name={k} value={profile[k]||''} onChange={change} /></label>)}
      </div>
      <label style={labelStyle}>Professional Summary<textarea style={{...inputStyle,minHeight:90}} name="summary" value={profile.summary||''} onChange={change}/></label>
      <label style={labelStyle}>Skills (comma separated)<input style={inputStyle} value={skillText} onChange={e=>setSkillText(e.target.value)} placeholder="React, JavaScript, SQL"/></label>
      <button className="btn btn-primary" disabled={busy}>{busy?'Saving...':'Save Profile'}</button>
    </form>
    <section className="card" style={{marginBottom:20}}>
      <h3 className="card-title">Education</h3>
      {education.length===0?<p style={{color:'#64748b',marginBottom:14}}>No education records added yet.</p>:education.map(x=><div key={x.id} style={{padding:'12px 0',borderBottom:'1px solid #e2e8f0',display:'flex',justifyContent:'space-between',gap:12}}>
        <div><strong>{x.degree}</strong> — {x.institution}<div style={{fontSize:13,color:'#64748b'}}>{x.fieldOfStudy||''} {x.startYear||''}{x.endYear?' – '+x.endYear:''} {x.grade?' · '+x.grade:''}</div></div>
        <button type="button" onClick={()=>deleteEducation(x.id)} className="btn" style={{color:'#b91c1c'}}>Delete</button>
      </div>)}
      <form onSubmit={addEducation} style={{marginTop:16}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12}}>
          {['institution','degree','fieldOfStudy','startYear','endYear','grade'].map(k=><label style={labelStyle} key={k}>{({institution:'Institution *',degree:'Degree *',fieldOfStudy:'Field of study',startYear:'Start year',endYear:'End year',grade:'Grade'})[k]}<input required={['institution','degree'].includes(k)} type={k.includes('Year')?'number':'text'} style={inputStyle} value={edu[k]} onChange={e=>setEdu(v=>({...v,[k]:e.target.value}))}/></label>)}
        </div>
        <label style={labelStyle}>Description<textarea style={inputStyle} value={edu.description} onChange={e=>setEdu(v=>({...v,description:e.target.value}))}/></label>
        <button className="btn btn-primary" disabled={busy}>Add Education</button>
      </form>
    </section>
    <section className="card">
      <h3 className="card-title">Resume</h3>
      {resume?<div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}><span>{resume.originalName}</span><button type="button" className="btn btn-primary" onClick={download}>Download</button><button type="button" className="btn" onClick={removeResume}>Delete</button></div>:<p style={{color:'#64748b',marginBottom:12}}>No resume uploaded.</p>}
      <label style={{display:'inline-block',marginTop:12,fontWeight:600}}>Upload or replace resume (PDF, DOC, DOCX; max 5 MB)<input type="file" accept=".pdf,.doc,.docx" onChange={upload} style={{display:'block',marginTop:8}}/></label>
    </section>
  </div>;
}
export default CandidateProfile;