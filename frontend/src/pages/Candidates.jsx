import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import { apiRequest } from '../services/api';

const STAGES = [
  'APPLIED',
  'SCREENING',
  'INTERVIEW',
  'SELECTED',
  'OFFERED',
  'REJECTED',
  'WITHDRAWN'
];

const NEXT_STAGES = {
  APPLIED: ['SCREENING', 'REJECTED'],
  SCREENING: ['INTERVIEW', 'REJECTED'],
  INTERVIEW: ['SELECTED', 'REJECTED'],
  SELECTED: ['OFFERED', 'REJECTED'],
  OFFERED: [],
  REJECTED: [],
  WITHDRAWN: []
};

const STAGE_LABELS = {
  APPLIED: 'Applied',
  SCREENING: 'Screening',
  INTERVIEW: 'Interview',
  SELECTED: 'Selected',
  OFFERED: 'Offered',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn'
};

const STAGE_BADGES = {
  APPLIED: 'badge-blue',
  SCREENING: 'badge-yellow',
  INTERVIEW: 'badge-orange',
  SELECTED: 'badge-green',
  OFFERED: 'badge-teal',
  REJECTED: 'badge-red',
  WITHDRAWN: 'badge-gray'
};

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState('All');
  const [filterJob, setFilterJob] = useState('All');

  const [viewCand, setViewCand] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function loadCandidates() {
  try {
    setErrorMsg('');

    const firstPage = await apiRequest(
      '/applications/manage/all?page=1&limit=50'
    );

    let allApplications = firstPage.applications || [];
    const totalPages = firstPage.pagination?.totalPages || 1;

    for (let page = 2; page <= totalPages; page++) {
      const data = await apiRequest(
        `/applications/manage/all?page=${page}&limit=50`
      );

      allApplications = allApplications.concat(
        data.applications || []
      );
    }

    setCandidates(allApplications);
  } catch (error) {
    setErrorMsg(error.message || 'Unable to load candidates.');
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    loadCandidates();
  }, []);

  const jobs = [
    ...new Map(
      candidates
        .filter((application) => application.job)
        .map((application) => [
          application.job.id,
          application.job
        ])
    ).values()
  ];

  const filtered = candidates.filter((application) => {
    const name = application.candidate?.name || '';
    const email = application.candidate?.email || '';

    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());

    const matchStage =
      filterStage === 'All' ||
      application.status === filterStage;

    const matchJob =
      filterJob === 'All' ||
      application.jobId === filterJob;

    return matchSearch && matchStage && matchJob;
  });

  async function moveStage(applicationId, newStage) {
    try {
      setUpdatingId(applicationId);
      setErrorMsg('');
      setSuccessMsg('');

      await apiRequest(
        `/applications/manage/${applicationId}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            status: newStage
          })
        }
      );

      setSuccessMsg('Candidate stage updated successfully.');

      await loadCandidates();

      if (viewCand?.id === applicationId) {
        const data = await apiRequest(
          `/applications/manage/${applicationId}`
        );

        setViewCand(data.application);
      }
    } catch (error) {
      setErrorMsg(error.message || 'Unable to update candidate stage.');
    } finally {
      setUpdatingId(null);
    }
  }

  async function openCandidate(application) {
    try {
      setErrorMsg('');

      const data = await apiRequest(
        `/applications/manage/${application.id}`
      );

      setViewCand(data.application);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to load candidate details.');
    }
  }

  function formatDate(date) {
    if (!date) return '—';

    return new Date(date).toLocaleDateString();
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
          <h1 className="page-title">Candidates</h1>
          <p className="page-subtitle">
            {filtered.length} of {candidates.length} applications
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
          placeholder="Search by name or email..."
        />

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
        >
          <option value="All">All Stages</option>

          {STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {STAGE_LABELS[stage]}
            </option>
          ))}
        </select>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={filterJob}
          onChange={(e) => setFilterJob(e.target.value)}
        >
          <option value="All">All Jobs</option>

          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          {loading ? (
            <div className="empty-state">
              <p>Loading candidates...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <p>No applications found.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Applied For</th>
                  <th>Date</th>
                  <th>Stage</th>
                  <th>Move Stage</th>
                  <th>View</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((application) => (
                  <tr key={application.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>
                        {application.candidate?.name || '—'}
                      </div>

                      <div style={{
                        fontSize: 12,
                        color: '#64748b'
                      }}>
                        {application.candidate?.email || '—'}
                      </div>
                    </td>

                    <td>
                      {application.job?.title || '—'}
                    </td>

                    <td>
                      {formatDate(application.createdAt)}
                    </td>

                    <td>
                      <span className={`badge ${
                        STAGE_BADGES[application.status] || 'badge-gray'
                      }`}>
                        {STAGE_LABELS[application.status] ||
                          application.status}
                      </span>
                    </td>

                    <td>
                      <select
                        className="form-control"
                        style={{
                          padding: '4px 8px',
                          fontSize: 12
                        }}
                        value={application.status}
disabled={
  updatingId === application.id ||
  (NEXT_STAGES[application.status] || []).length === 0
}
onChange={(e) =>
  moveStage(application.id, e.target.value)
}
>
  {[application.status, ...(NEXT_STAGES[application.status] || [])].map((stage) => (
    <option key={stage} value={stage}>
      {STAGE_LABELS[stage]}
    </option>
  ))}
                      </select>
                    </td>

                    <td>
                      <button
                        className="btn-icon"
                        title="View candidate"
                        onClick={() => openCandidate(application)}
                      >
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

      <Modal
        isOpen={!!viewCand}
        onClose={() => setViewCand(null)}
        title="Candidate Application"
        footer={
          <button
            className="btn btn-ghost"
            onClick={() => setViewCand(null)}
          >
            Close
          </button>
        }
      >
        {viewCand && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h3>{viewCand.candidate?.name || '—'}</h3>

              <p style={{
                color: '#64748b',
                fontSize: 13
              }}>
                {viewCand.candidate?.email || '—'}
              </p>
            </div>

            <div style={{ marginBottom: 12 }}>
              <strong>Applied Position:</strong>{' '}
              {viewCand.job?.title || '—'}
            </div>

            <div style={{ marginBottom: 12 }}>
              <strong>Department:</strong>{' '}
              {viewCand.job?.department || '—'}
            </div>

            <div style={{ marginBottom: 12 }}>
              <strong>Location:</strong>{' '}
              {viewCand.job?.location || '—'}
            </div>

            <div style={{ marginBottom: 12 }}>
              <strong>Application Status:</strong>{' '}
              {STAGE_LABELS[viewCand.status] || viewCand.status}
            </div>

            <div style={{ marginBottom: 12 }}>
              <strong>Applied On:</strong>{' '}
              {formatDate(viewCand.createdAt)}
            </div>

            <div style={{ marginBottom: 12 }}>
              <strong>Cover Letter:</strong>

              <p style={{
                marginTop: 6,
                color: '#475569',
                whiteSpace: 'pre-wrap'
              }}>
                {viewCand.coverLetter || 'No cover letter provided.'}
              </p>
            </div>

            <div>
              <strong>Application History</strong>

              {viewCand.statusHistory?.length > 0 ? (
                <div style={{ marginTop: 10 }}>
                  {viewCand.statusHistory.map((history) => (
                    <div
                      key={history.id}
                      style={{
                        padding: '8px 0',
                        borderBottom: '1px solid #e2e8f0'
                      }}
                    >
                      <strong>
                        {STAGE_LABELS[history.toStatus] || history.toStatus}
                      </strong>

                      <div style={{
                        fontSize: 12,
                        color: '#64748b'
                      }}>
                        {formatDate(history.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#64748b', marginTop: 6 }}>
                  No status history available.
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Candidates;