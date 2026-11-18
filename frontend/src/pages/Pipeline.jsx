import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import '../styles/pipeline.css';

const PIPELINE_STAGES = [
  'APPLIED',
  'SCREENING',
  'INTERVIEW',
  'SELECTED',
  'OFFERED',
  'REJECTED',
  'WITHDRAWN'
];

const STAGE_LABELS = {
  APPLIED: 'Applied',
  SCREENING: 'Screening',
  INTERVIEW: 'Interview',
  SELECTED: 'Selected',
  OFFERED: 'Offered',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn'
};

const STAGE_COLORS = {
  APPLIED: '#3b82f6',
  SCREENING: '#f59e0b',
  INTERVIEW: '#f97316',
  SELECTED: '#10b981',
  OFFERED: '#0d9488',
  REJECTED: '#ef4444',
  WITHDRAWN: '#64748b'
};

const ALLOWED_TRANSITIONS = {
  APPLIED: ['SCREENING', 'REJECTED'],
  SCREENING: ['INTERVIEW', 'REJECTED'],
  INTERVIEW: ['SELECTED', 'REJECTED'],
  SELECTED: ['OFFERED', 'REJECTED'],
  OFFERED: [],
  REJECTED: [],
  WITHDRAWN: []
};

function Pipeline() {
  const [candidates, setCandidates] = useState([]);
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
      setErrorMsg(error.message || 'Unable to load recruitment pipeline.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCandidates();
  }, []);

  async function moveCandidate(applicationId, newStage) {
    try {
      setUpdatingId(applicationId);
      setErrorMsg('');
      setSuccessMsg('');

      await apiRequest(
        `/applications/manage/${applicationId}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status: newStage })
        }
      );

      setSuccessMsg('Application stage updated successfully.');
      await loadCandidates();
    } catch (error) {
      setErrorMsg(error.message || 'Unable to update application stage.');
    } finally {
      setUpdatingId(null);
    }
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
          <h1 className="page-title">Recruitment Pipeline</h1>
          <p className="page-subtitle">
            Track and manage candidate application stages.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading recruitment pipeline...</p>
        </div>
      ) : (
        <div className="pipeline-board">
          {PIPELINE_STAGES.map((stage) => {
            const columnCandidates = candidates.filter(
              (candidate) => candidate.status === stage
            );

            return (
              <div key={stage} className="pipeline-col">
                <div
                  className="pipeline-col-header"
                  style={{ borderTopColor: STAGE_COLORS[stage] }}
                >
                  <span className="pipeline-col-title">
                    {STAGE_LABELS[stage]}
                  </span>

                  <span className="pipeline-col-count">
                    {columnCandidates.length}
                  </span>
                </div>

                <div className="pipeline-cards">
                  {columnCandidates.length === 0 && (
                    <div className="pipeline-empty">
                      No applications
                    </div>
                  )}

                  {columnCandidates.map((candidate) => (
                    <div key={candidate.id} className="pipeline-card">
                      <div className="pipeline-card-name">
                        {candidate.candidate?.name || 'Unknown Candidate'}
                      </div>

                      <div className="pipeline-card-job">
                        {candidate.job?.title || 'Unknown Job'}
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          color: '#64748b',
                          marginTop: 5
                        }}
                      >
                        {candidate.candidate?.email || ''}
                      </div>

                      <div className="pipeline-card-actions">
                        {ALLOWED_TRANSITIONS[stage].map((nextStage) => (
                          <button
                            key={nextStage}
                            className="btn btn-primary btn-sm"
                            disabled={updatingId === candidate.id}
                            onClick={() =>
                              moveCandidate(candidate.id, nextStage)
                            }
                          >
                            {updatingId === candidate.id
                              ? 'Updating...'
                              : nextStage === 'REJECTED'
                                ? 'Reject'
                                : `Move to ${STAGE_LABELS[nextStage]}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Pipeline;