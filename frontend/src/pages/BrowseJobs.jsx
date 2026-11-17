import { useEffect, useState } from 'react';
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import { apiRequest } from '../services/api';

const EMPLOYMENT_TYPES = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship'
};

function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  const [applyJob, setApplyJob] = useState(null);

  const [coverLetter, setCoverLetter] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function loadData() {
    try {
      setErrorMsg('');

      const [jobData, applicationData] = await Promise.all([
        apiRequest('/jobs'),
        apiRequest('/applications/my')
      ]);

      setJobs(jobData.jobs || []);
      setApplications(applicationData.applications || []);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to load jobs.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const appliedIds = applications.map((application) => application.jobId);

  const filtered = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());

    const type = EMPLOYMENT_TYPES[job.employmentType];

    const matchType =
      filterType === 'All' || type === filterType;

    return matchSearch && matchType;
  });

  function formatSalary(job) {
    if (job.salaryMin == null && job.salaryMax == null) {
      return 'Salary not specified';
    }

    const min = job.salaryMin != null
      ? `₹${job.salaryMin.toLocaleString('en-IN')}`
      : null;

    const max = job.salaryMax != null
      ? `₹${job.salaryMax.toLocaleString('en-IN')}`
      : null;

    if (min && max) return `${min} - ${max}`;
    if (min) return `From ${min}`;

    return `Up to ${max}`;
  }

  async function handleApply() {
    if (!applyJob) return;

    try {
      setSubmitting(true);
      setErrorMsg('');

      const body = {};

      if (coverLetter.trim()) {
        body.coverLetter = coverLetter.trim();
      }

      await apiRequest(`/applications/apply/${applyJob.id}`, {
        method: 'POST',
        body: JSON.stringify(body)
      });

      setSuccessMsg(
        `Application submitted successfully for ${applyJob.title}!`
      );

      setApplyJob(null);
      setCoverLetter('');

      await loadData();

      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to submit application.');
    } finally {
      setSubmitting(false);
    }
  }

  const jobTypes = [
    'All',
    'Full-time',
    'Part-time',
    'Contract',
    'Internship'
  ];

  return (
    <div>
      {successMsg && (
        <div className="success-banner">{successMsg}</div>
      )}

      {errorMsg && (
        <div className="error-banner">{errorMsg}</div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Browse Jobs</h1>

          <p className="page-subtitle">
            {filtered.length} available positions
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        marginBottom: 20
      }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by title, department, location..."
        />

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          {jobTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading available jobs...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>No published jobs match your search.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
          gap: 20
        }}>
          {filtered.map((job) => {
            const alreadyApplied = appliedIds.includes(job.id);

            return (
              <div
                key={job.id}
                style={{
                  background: '#fff',
                  borderRadius: 8,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.15s,box-shadow 0.15s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 20px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{
                  background: 'linear-gradient(135deg, #64748b, #475569)',
                  borderRadius: '8px 8px 0 0',
                  height: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Briefcase
                    size={48}
                    color="rgba(255,255,255,0.9)"
                    strokeWidth={1.5}
                  />
                </div>

                <div style={{
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  flex: 1
                }}>
                  <div>
                    <h3 style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: '#1e293b'
                    }}>
                      {job.title}
                    </h3>

                    <p style={{
                      fontSize: 13,
                      color: '#64748b'
                    }}>
                      {job.department}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      color: '#475569'
                    }}>
                      <MapPin size={13} />
                      {job.location}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      color: '#475569'
                    }}>
                      <Clock size={13} />
                      {EMPLOYMENT_TYPES[job.employmentType]}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      color: '#475569'
                    }}>
                      <DollarSign size={13} />
                      {formatSalary(job)}
                    </div>
                  </div>

                  <p style={{
                    fontSize: 13,
                    color: '#64748b',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-line'
                  }}>
                    {job.description.length > 150
                      ? `${job.description.slice(0, 150)}...`
                      : job.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                    paddingTop: 8
                  }}>
                    <span style={{
                      fontSize: 11,
                      color: '#94a3b8'
                    }}>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>

                    <button
                      className={`btn ${
                        alreadyApplied ? 'btn-ghost' : 'btn-primary'
                      } btn-sm`}
                      disabled={alreadyApplied}
                      onClick={() => {
                        setApplyJob(job);
                        setCoverLetter('');
                      }}
                    >
                      {alreadyApplied ? '✓ Applied' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={!!applyJob}
        onClose={() => !submitting && setApplyJob(null)}
        title={`Apply – ${applyJob?.title}`}
        footer={
          <>
            <button
              className="btn btn-ghost"
              onClick={() => setApplyJob(null)}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={handleApply}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label>Cover Letter (Optional)</label>

          <textarea
            className="form-control"
            rows={6}
            maxLength={3000}
            placeholder="Explain why you are interested in this position..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />

          <small style={{ color: '#64748b' }}>
            Maximum 3000 characters.
          </small>
        </div>

        <p style={{
          fontSize: 13,
          color: '#64748b',
          marginTop: 10
        }}>
          Your application will be submitted using your logged-in
          candidate account. Upload your resume separately in your
          candidate profile.
        </p>
      </Modal>
    </div>
  );
}

export default BrowseJobs;