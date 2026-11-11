import { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { SAMPLE_NOTIFICATIONS } from '../data/sampleData';

// Notifications page – shows a list of system notifications
function Notifications() {
  const [notifs, setNotifs] = useState(SAMPLE_NOTIFICATIONS);

  // Mark a single notification as read
  function markRead(id) {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  // Mark all as read
  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const unreadCount = notifs.filter((n) => !n.read).length;

  // Pick icon colour by notification type
  function typeColor(type) {
    if (type === 'application') return '#3b82f6';
    if (type === 'interview')   return '#f59e0b';
    if (type === 'offer')       return '#10b981';
    return '#8b5cf6';
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline" onClick={markAllRead}>
            <CheckCheck size={15} /> Mark All Read
          </button>
        )}
      </div>

      <div className="card">
        {notifs.length === 0 ? (
          <div className="empty-state">
            <Bell size={36} />
            <p>No notifications.</p>
          </div>
        ) : (
          <div>
            {notifs.map((n) => (
              <div key={n.id} style={{
                display:'flex', alignItems:'flex-start', gap:14,
                padding:'14px 16px',
                background: n.read ? 'transparent' : '#eff6ff',
                borderBottom:'1px solid #f1f5f9',
                borderRadius:6, marginBottom:2,
              }}>
                {/* Coloured dot */}
                <div style={{ width:10, height:10, borderRadius:'50%', background: typeColor(n.type), marginTop:4, flexShrink:0 }} />

                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, color:'#1e293b', marginBottom:2 }}>{n.message}</p>
                  <p style={{ fontSize:11, color:'#94a3b8' }}>{n.time}</p>
                </div>

                {!n.read && (
                  <button className="btn btn-ghost btn-sm" onClick={() => markRead(n.id)}>
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;

