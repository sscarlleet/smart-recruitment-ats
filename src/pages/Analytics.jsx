import { ANALYTICS_DATA, SAMPLE_JOBS, SAMPLE_CANDIDATES } from '../data/sampleData';

// A simple horizontal bar chart using plain CSS divs (no chart library needed)
function BarChart({ data, colorClass }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {data.map((item) => (
        <div key={item.label} style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:110, fontSize:12, color:'#475569', textAlign:'right', flexShrink:0 }}>{item.label}</div>
          <div style={{ flex:1, background:'#f1f5f9', borderRadius:4, height:22, overflow:'hidden' }}>
            <div style={{
              width: `${(item.value / max) * 100}%`,
              height:'100%', background: colorClass,
              borderRadius:4, display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:6,
              transition:'width 0.4s ease'
            }}>
              <span style={{ fontSize:11, color:'#fff', fontWeight:700 }}>{item.value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Analytics page – shows recruitment statistics using simple bar charts
function Analytics() {
  const openJobs  = SAMPLE_JOBS.filter((j) => j.status === 'Open').length;
  const totalApps = SAMPLE_CANDIDATES.length;
  const hired     = SAMPLE_CANDIDATES.filter((c) => c.stage === 'Offered').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Sample recruitment statistics</p>
        </div>
      </div>

      {/* Top numbers */}
      <div className="stats-grid" style={{ marginBottom:24 }}>
        <div className="card" style={{ textAlign:'center' }}>
          <div style={{ fontSize:36, fontWeight:800, color:'#1e3a8a' }}>{totalApps}</div>
          <div style={{ color:'#64748b', marginTop:4 }}>Total Applications</div>
        </div>
        <div className="card" style={{ textAlign:'center' }}>
          <div style={{ fontSize:36, fontWeight:800, color:'#0ea5e9' }}>{openJobs}</div>
          <div style={{ color:'#64748b', marginTop:4 }}>Open Jobs</div>
        </div>
        <div className="card" style={{ textAlign:'center' }}>
          <div style={{ fontSize:36, fontWeight:800, color:'#10b981' }}>{hired}</div>
          <div style={{ color:'#64748b', marginTop:4 }}>Offers Extended</div>
        </div>
      </div>

      {/* Charts */}
      <div className="dashboard-grid">

        {/* Applications by status */}
        <div className="card">
          <h3 className="card-title">Applications by Stage</h3>
          <BarChart data={ANALYTICS_DATA.applicationsByStatus} colorClass="#3b82f6" />
        </div>

        {/* Jobs by department */}
        <div className="card">
          <h3 className="card-title">Jobs by Department</h3>
          <BarChart data={ANALYTICS_DATA.jobsByDepartment} colorClass="#8b5cf6" />
        </div>

        {/* Monthly applications */}
        <div className="card">
          <h3 className="card-title">Monthly Applications</h3>
          <BarChart
            data={ANALYTICS_DATA.monthlyApplications.map((m) => ({ label: m.month, value: m.count }))}
            colorClass="#10b981"
          />
        </div>

        {/* Summary table */}
        <div className="card">
          <h3 className="card-title">Stage Summary</h3>
          <table className="data-table">
            <thead><tr><th>Stage</th><th>Count</th><th>%</th></tr></thead>
            <tbody>
              {ANALYTICS_DATA.applicationsByStatus.map((item) => (
                <tr key={item.label}>
                  <td>{item.label}</td>
                  <td>{item.value}</td>
                  <td>{Math.round((item.value / totalApps) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;

