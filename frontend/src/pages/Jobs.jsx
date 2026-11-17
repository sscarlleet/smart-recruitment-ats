import { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Eye,
  Send,
  Ban,
  Archive
} from 'lucide-react';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import { apiRequest } from '../services/api';

const EMPTY_FORM = {
  title: '',
  department: '',
  location: '',
  employmentType: 'FULL_TIME',
  salaryMin: '',
  salaryMax: '',
  description: ''
};

const EMPLOYMENT_TYPES = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship'
};

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);

  const [editJob, setEditJob] = useState(null);
  const [viewJob, setViewJob] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function loadJobs() {
    try {
      setErrorMsg('');

      const data = await apiRequest('/jobs/manage/all');

      setJobs(data.jobs || []);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to load jobs.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  const filtered = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.department.toLowerCase().includes(search.toLowerCase())
  );

  function showSuccess(message) {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  function openAdd() {
    setEditJob(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(true);
  }

  function openEdit(job) {
    setEditJob(job);

    setForm({
      title: job.title || '',
      department: job.department || '',
      location: job.location || '',
      employmentType: job.employmentType || 'FULL_TIME',
      salaryMin: job.salaryMin ?? '',
      salaryMax: job.salaryMax ?? '',
      description: job.description || ''
    });

    setErrors({});
    setShowForm(true);
  }

  function openView(job) {
    setViewJob(job);
    setShowView(true);
  }

  function handleChange(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: ''
    }));
  }

  function validate() {
    const e = {};

    if (form.title.trim().length < 3) {
      e.title = 'Title must contain at least 3 characters.';
    }

    if (form.department.trim().length < 2) {
      e.department = 'Department is required.';
    }

    if (form.location.trim().length < 2) {
      e.location = 'Location is required.';
    }

    if (form.description.trim().length < 20) {
      e.description = 'Description must contain at least 20 characters.';
    }

    if (
      form.salaryMin !== '' &&
      (!Number.isInteger(Number(form.salaryMin)) ||
        Number(form.salaryMin) < 0)
    ) {
      e.salaryMin = 'Enter a valid minimum salary.';
    }

    if (
      form.salaryMax !== '' &&
      (!Number.isInteger(Number(form.salaryMax)) ||
        Number(form.salaryMax) < 0)
    ) {
      e.salaryMax = 'Enter a valid maximum salary.';
    }

    if (
      form.salaryMin !== '' &&
      form.salaryMax !== '' &&
      Number(form.salaryMin) > Number(form.salaryMax)
    ) {
      e.salaryMax = 'Maximum salary must be greater than minimum salary.';
    }

    return e;
  }

  async function handleSave() {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const jobData = {
      title: form.title.trim(),
      department: form.department.trim(),
      location: form.location.trim(),
      employmentType: form.employmentType,
      description: form.description.trim()
    };

    if (form.salaryMin !== '') {
      jobData.salaryMin = Number(form.salaryMin);
    }

    if (form.salaryMax !== '') {
      jobData.salaryMax = Number(form.salaryMax);
    }

    try {
      setSaving(true);
      setErrorMsg('');

      if (editJob) {
        await apiRequest(`/jobs/${editJob.id}`, {
          method: 'PATCH',
          body: JSON.stringify(jobData)
        });

        showSuccess('Job updated successfully.');
      } else {
        await apiRequest('/jobs', {
          method: 'POST',
          body: JSON.stringify(jobData)
        });

        showSuccess('Job created successfully. It is currently a draft.');
      }

      setShowForm(false);
      setEditJob(null);
      setForm(EMPTY_FORM);

      await loadJobs();
    } catch (error) {
      setErrorMsg(error.message || 'Unable to save job.');
    } finally {
      setSaving(false);
    }
  }

  async function handleJobAction(job, action) {
    const actionDetails = {
      publish: {
        endpoint: 'publish',
        message: 'Job published successfully.'
      },
      close: {
        endpoint: 'close',
        message: 'Job closed successfully.'
      },
      archive: {
        endpoint: 'archive',
        message: 'Job archived successfully.'
      }
    };

    const selectedAction = actionDetails[action];

    if (!selectedAction) return;

    if (
      !window.confirm(
        `Are you sure you want to ${action} "${job.title}"?`
      )
    ) {
      return;
    }

    try {
      setActionId(job.id);
      setErrorMsg('');

      await apiRequest(`/jobs/${job.id}/${selectedAction.endpoint}`, {
        method: 'PATCH'
      });

      showSuccess(selectedAction.message);

      await loadJobs();
    } catch (error) {
      setErrorMsg(error.message || `Unable to ${action} job.`);
    } finally {
      setActionId(null);
    }
  }

  function statusBadge(status) {
    if (status === 'PUBLISHED') return 'badge-green';
    if (status === 'CLOSED') return 'badge-red';
    if (status === 'DRAFT') return 'badge-gray';

    return 'badge-gray';
  }

  function formatSalary(job) {
    if (job.salaryMin == null && job.salaryMax == null) {
      return 'Not specified';
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
          <h1 className="page-title">Job Openings</h1>
          <p className="page-subtitle">
            {jobs.length} total jobs
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search jobs..."
          />

          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={15} /> Add Job
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          {loading ? (
            <div className="empty-state">
              <p>Loading jobs...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <p>No jobs found.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((job) => (
                  <tr key={job.id}>
                    <td style={{ fontWeight: 600 }}>
                      {job.title}
                    </td>

                    <td>{job.department}</td>
                    <td>{job.location}</td>

                    <td>
                      {EMPLOYMENT_TYPES[job.employmentType] ||
                        job.employmentType}
                    </td>

                    <td>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>

                    <td>
                      <span className={`badge ${statusBadge(job.status)}`}>
                        {job.status}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="btn-icon"
                          title="View"
                          onClick={() => openView(job)}
                        >
                          <Eye size={15} />
                        </button>

                        {job.status !== 'ARCHIVED' && (
                          <button
                            className="btn-icon"
                            title="Edit"
                            onClick={() => openEdit(job)}
                          >
                            <Pencil size={15} />
                          </button>
                        )}

                        {job.status === 'DRAFT' ||
                        job.status === 'CLOSED' ? (
                          <button
                            className="btn-icon"
                            title="Publish"
                            disabled={actionId === job.id}
                            onClick={() => handleJobAction(job, 'publish')}
                          >
                            <Send size={15} />
                          </button>
                        ) : null}

                        {job.status === 'PUBLISHED' && (
                          <button
                            className="btn-icon"
                            title="Close"
                            disabled={actionId === job.id}
                            onClick={() => handleJobAction(job, 'close')}
                          >
                            <Ban size={15} />
                          </button>
                        )}

                        {job.status !== 'PUBLISHED' &&
                        job.status !== 'ARCHIVED' && (
                          <button
                            className="btn-icon"
                            title="Archive"
                            disabled={actionId === job.id}
                            onClick={() => handleJobAction(job, 'archive')}
                          >
                            <Archive size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => !saving && setShowForm(false)}
        title={editJob ? 'Edit Job' : 'Add New Job'}
        footer={
          <>
            <button
              className="btn btn-ghost"
              onClick={() => setShowForm(false)}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Job'}
            </button>
          </>
        }
      >
        <div className="form-row">
          <div className="form-group">
            <label>Job Title *</label>

            <input
              className={`form-control ${errors.title ? 'error' : ''}`}
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />

            {errors.title && (
              <p className="field-error">{errors.title}</p>
            )}
          </div>

          <div className="form-group">
            <label>Department *</label>

            <input
              className={`form-control ${errors.department ? 'error' : ''}`}
              value={form.department}
              onChange={(e) => handleChange('department', e.target.value)}
            />

            {errors.department && (
              <p className="field-error">{errors.department}</p>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location *</label>

            <input
              className={`form-control ${errors.location ? 'error' : ''}`}
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />

            {errors.location && (
              <p className="field-error">{errors.location}</p>
            )}
          </div>

          <div className="form-group">
            <label>Employment Type</label>

            <select
              className="form-control"
              value={form.employmentType}
              onChange={(e) =>
                handleChange('employmentType', e.target.value)
              }
            >
              {Object.entries(EMPLOYMENT_TYPES).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Minimum Salary (₹)</label>

            <input
              type="number"
              min="0"
              step="1"
              className={`form-control ${errors.salaryMin ? 'error' : ''}`}
              value={form.salaryMin}
              onChange={(e) => handleChange('salaryMin', e.target.value)}
            />

            {errors.salaryMin && (
              <p className="field-error">{errors.salaryMin}</p>
            )}
          </div>

          <div className="form-group">
            <label>Maximum Salary (₹)</label>

            <input
              type="number"
              min="0"
              step="1"
              className={`form-control ${errors.salaryMax ? 'error' : ''}`}
              value={form.salaryMax}
              onChange={(e) => handleChange('salaryMax', e.target.value)}
            />

            {errors.salaryMax && (
              <p className="field-error">{errors.salaryMax}</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Job Description *</label>

          <textarea
            className={`form-control ${errors.description ? 'error' : ''}`}
            rows={5}
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />

          {errors.description && (
            <p className="field-error">{errors.description}</p>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showView}
        onClose={() => setShowView(false)}
        title="Job Details"
        footer={
          <button
            className="btn btn-ghost"
            onClick={() => setShowView(false)}
          >
            Close
          </button>
        }
      >
        {viewJob && (
          <div>
            <h2 style={{ marginBottom: 4 }}>
              {viewJob.title}
            </h2>

            <p style={{ color: '#64748b', marginBottom: 16 }}>
              {viewJob.department} · {viewJob.location}
            </p>

            <div className="form-row" style={{ marginBottom: 12 }}>
              <div>
                <strong>Type:</strong>{' '}
                {EMPLOYMENT_TYPES[viewJob.employmentType]}
              </div>

              <div>
                <strong>Salary:</strong>{' '}
                {formatSalary(viewJob)}
              </div>

              <div>
                <strong>Status:</strong> {viewJob.status}
              </div>

              <div>
                <strong>Created:</strong>{' '}
                {new Date(viewJob.createdAt).toLocaleDateString()}
              </div>
            </div>

            <p><strong>Description:</strong></p>

            <p style={{
              marginTop: 6,
              marginBottom: 12,
              color: '#475569',
              whiteSpace: 'pre-wrap'
            }}>
              {viewJob.description}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Jobs;