import { useEffect, useState } from 'react';
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
const PROGRESS_STAGES = [
  'APPLIED',
  'SCREENING',
  'INTERVIEW',
  'SELECTED',
  'OFFERED'
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

const STAGE_BADGES = {
  APPLIED: 'badge-blue',
  SCREENING: 'badge-yellow',
  INTERVIEW: 'badge-orange',
  SELECTED: 'badge-green',
  OFFERED: 'badge-teal',
  REJECTED: 'badge-red',
  WITHDRAWN: 'badge-gray'
};

function formatDate(date) {
  if (!date) return '—';

  return new Date(date).toLocaleDateString();
}

function MyApplications() {
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  async function loadApplications() {
    try {
      setErrorMsg('');

      const data = await apiRequest('/applications/my');

      setApplications(data.applications || []);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to load your applications.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <div>
      {errorMsg && (
        <div className="error-banner">{errorMsg}</div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">My Applications</h1>

          <p className="page-subtitle">
            Track the status of your submitted applications.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading your applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <p>You haven't submitted any applications yet.</p>
          </div>
        </div>
      ) : (
        applications.map((application) => {
           const currentIndex = PROGRESS_STAGES.indexOf(application.status);

          const history = application.statusHistory || [];

          return (
            <div
              key={application.id}
              className="card"
              style={{ marginBottom: 20 }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div>
                  <h3 style={{
                    fontSize: 17,
                    fontWeight: 700
                  }}>
                    {application.job?.title || 'Job'}
                  </h3>

                  <p style={{
                    color: '#64748b',
                    fontSize: 13
                  }}>
                    {application.job?.department || '—'}
                    {' · '}
                    {application.job?.location || '—'}
                  </p>

                  <p style={{
                    color: '#94a3b8',
                    fontSize: 12,
                    marginTop: 4
                  }}>
                    Applied on {formatDate(application.createdAt)}
                  </p>
                </div>

                <span
                  className={`badge ${
                    STAGE_BADGES[application.status] || 'badge-gray'
                  }`}
                  style={{ height: 'fit-content' }}
                >
                  {STAGE_LABELS[application.status] ||
                    application.status}
                </span>
              </div>

              <div style={{ marginTop: 24 }}>
                <p style={{
                  fontWeight: 600,
                  marginBottom: 12
                }}>
                  Application Progress
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0,
                  overflowX: 'auto'
                }}>
                  {PROGRESS_STAGES.map((stage, index, stages) => {
                    const done =
                      currentIndex >= 0 &&
                      index <= stages.indexOf(application.status);

                    const active =
                      stage === application.status;

                    return (
                      <div
                        key={stage}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flex: 1,
                          minWidth: 75
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          flex: 1
                        }}>
                          <div style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: done ? '#1e3a8a' : '#e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: done ? '#fff' : '#64748b',
                            fontSize: 12,
                            fontWeight: 700,
                            border: active
                              ? '3px solid #0ea5e9'
                              : 'none'
                          }}>
                            {done ? '✓' : index + 1}
                          </div>

                          <p style={{
                            fontSize: 10,
                            marginTop: 4,
                            textAlign: 'center',
                            color: done ? '#1e3a8a' : '#94a3b8',
                            fontWeight: active ? 700 : 400
                          }}>
                            {STAGE_LABELS[stage]}
                          </p>
                        </div>

                        {index < stages.length - 1 && (
                          <div style={{
                            flex: 1,
                            height: 2,
                            background:
                              done && index < currentIndex
                                ? '#1e3a8a'
                                : '#e2e8f0'
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {application.status === 'REJECTED' && (
                  <p style={{
                    marginTop: 12,
                    color: '#dc2626',
                    fontSize: 13
                  }}>
                    Your application has been rejected.
                  </p>
                )}

                {application.status === 'WITHDRAWN' && (
                  <p style={{
                    marginTop: 12,
                    color: '#64748b',
                    fontSize: 13
                  }}>
                    This application has been withdrawn.
                  </p>
                )}
              </div>

              <div style={{ marginTop: 24 }}>
                <h4 style={{ marginBottom: 12 }}>
                  Application History
                </h4>

                {history.length === 0 ? (
                  <p style={{
                    color: '#64748b',
                    fontSize: 13
                  }}>
                    No application history available.
                  </p>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '10px 0',
                        borderBottom: '1px solid #e2e8f0'
                      }}
                    >
                      <span className={`badge ${
                        STAGE_BADGES[item.toStatus] || 'badge-gray'
                      }`}>
                        {STAGE_LABELS[item.toStatus] || item.toStatus}
                      </span>

                      <p style={{
                        color: '#64748b',
                        fontSize: 12,
                        marginTop: 5
                      }}>
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default MyApplications;