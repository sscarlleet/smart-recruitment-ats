import { useState } from 'react';
import { SAMPLE_CANDIDATES, SAMPLE_JOBS, PIPELINE_STAGES } from '../data/sampleData';
import '../styles/pipeline.css';

// Pipeline – Kanban-style board showing candidates in each stage
function Pipeline() {
  const [candidates, setCandidates] = useState(SAMPLE_CANDIDATES);

  // Move a candidate to a new stage
  function moveCandidate(candidateId, newStage) {
    setCandidates((prev) =>
      prev.map((c) => c.id === candidateId ? { ...c, stage: newStage } : c)
    );
  }

  // Get job title from job id
  function getJobTitle(jobId) {
    return SAMPLE_JOBS.find((j) => j.id === jobId)?.title || '—';
  }

  // Map stage to a colour used for the column header
  const stageColors = {
    Applied:'#3b82f6', Screening:'#f59e0b', Shortlisted:'#8b5cf6',
    Interview:'#f97316', Selected:'#10b981', Offered:'#0d9488', Rejected:'#ef4444',
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Recruitment Pipeline</h1>
          <p className="page-subtitle">Drag-and-drop style board – use the arrow buttons to move candidates</p>
        </div>
      </div>

      {/* Board */}
      <div className="pipeline-board">
        {PIPELINE_STAGES.map((stage) => {
          const columnCandidates = candidates.filter((c) => c.stage === stage);
          return (
            <div key={stage} className="pipeline-col">

              {/* Column header */}
              <div className="pipeline-col-header" style={{ borderTopColor: stageColors[stage] }}>
                <span className="pipeline-col-title">{stage}</span>
                <span className="pipeline-col-count">{columnCandidates.length}</span>
              </div>

              {/* Candidate cards */}
              <div className="pipeline-cards">
                {columnCandidates.length === 0 && (
                  <div className="pipeline-empty">No candidates</div>
                )}
                {columnCandidates.map((c) => (
                  <div key={c.id} className="pipeline-card">
                    <div className="pipeline-card-name">{c.name}</div>
                    <div className="pipeline-card-job">{getJobTitle(c.appliedJob)}</div>

                    {/* Move buttons */}
                    <div className="pipeline-card-actions">
                      {/* Move backward */}
                      {PIPELINE_STAGES.indexOf(stage) > 0 && (
                        <button className="btn btn-ghost btn-sm"
                          onClick={() => moveCandidate(c.id, PIPELINE_STAGES[PIPELINE_STAGES.indexOf(stage) - 1])}>
                          ← Back
                        </button>
                      )}
                      {/* Move forward */}
                      {PIPELINE_STAGES.indexOf(stage) < PIPELINE_STAGES.length - 1 && (
                        <button className="btn btn-primary btn-sm"
                          onClick={() => moveCandidate(c.id, PIPELINE_STAGES[PIPELINE_STAGES.indexOf(stage) + 1])}>
                          Next →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Pipeline;

