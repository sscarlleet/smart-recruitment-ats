import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, Users, GitBranch,
  Calendar, FileText, BarChart2, Bell, Settings,
  LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import '../styles/dashboard.css';

// Nav links for each role
const NAV_CONFIG = {
  hr: [
    { label: 'Dashboard',   icon: LayoutDashboard, path: '/hr'            },
    { label: 'Jobs',        icon: Briefcase,        path: '/hr/jobs'       },
    { label: 'Candidates',  icon: Users,            path: '/hr/candidates' },
    { label: 'Pipeline',    icon: GitBranch,        path: '/hr/pipeline'   },
    { label: 'Interviews',  icon: Calendar,         path: '/hr/interviews' },
    { label: 'Offers',      icon: FileText,         path: '/hr/offers'     },
    { label: 'Analytics',   icon: BarChart2,        path: '/hr/analytics'  },
    { label: 'Notifications',icon: Bell,            path: '/hr/notifications'},
  ],
  admin: [
    { label: 'Dashboard',   icon: LayoutDashboard, path: '/admin'              },
    { label: 'Users',       icon: Users,            path: '/admin/users'        },
    { label: 'Jobs',        icon: Briefcase,        path: '/admin/jobs'         },
    { label: 'Analytics',   icon: BarChart2,        path: '/admin/analytics'    },
    { label: 'Notifications',icon: Bell,            path: '/admin/notifications'},
  ],
  candidate: [
    { label: 'Dashboard',    icon: LayoutDashboard, path: '/candidate'              },
    { label: 'Browse Jobs',  icon: Briefcase,        path: '/candidate/jobs'         },
    { label: 'My Applications',icon: FileText,       path: '/candidate/applications' },
    { label: 'Notifications', icon: Bell,            path: '/candidate/notifications'},
  ],
};

// Page titles shown in the top navbar
const PAGE_TITLES = {
  '/hr': 'HR Dashboard', '/hr/jobs': 'Job Management',
  '/hr/candidates': 'Candidates', '/hr/pipeline': 'Recruitment Pipeline',
  '/hr/interviews': 'Interviews', '/hr/offers': 'Offers',
  '/hr/analytics': 'Analytics', '/hr/notifications': 'Notifications',
  '/admin': 'Admin Dashboard', '/admin/users': 'User Management',
  '/admin/jobs': 'All Jobs', '/admin/analytics': 'Analytics',
  '/admin/notifications': 'Notifications',
  '/candidate': 'My Dashboard', '/candidate/jobs': 'Browse Jobs',
  '/candidate/applications': 'My Applications',
  '/candidate/notifications': 'Notifications',
};

// Sidebar + Topnav layout used by all role dashboards
function AppLayout({ children }) {
  const { user, logout }  = useAuth();
  const navigate          = useNavigate();
  const location          = useLocation();
  const [open, setOpen]   = useState(false);

  const links = NAV_CONFIG[user?.role] || [];
  const title = PAGE_TITLES[location.pathname] || 'SmartATS';

  // Get initials for the avatar (e.g. "Sara HR" → "SH")
  function getInitials(name) {
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  }

  function handleNav(path) {
    navigate(path);
    setOpen(false); // close sidebar on mobile after clicking
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="app-layout">

      {/* Mobile overlay – clicking it closes the sidebar */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <h2>SmartATS</h2>
          <p>Recruitment System</p>
        </div>

        <div className="sidebar-section">Menu</div>

        {links.map((link) => {
          const Icon    = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <button key={link.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => handleNav(link.path)}>
              <Icon size={16} />
              {link.label}
              {isActive && <ChevronRight size={14} style={{ marginLeft:'auto' }} />}
            </button>
          );
        })}

        {/* Logout at the bottom */}
        <div className="sidebar-footer">
          <button className="sidebar-link" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Top navbar */}
      <header className="topnav">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button className="topnav-burger" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span className="topnav-title">{title}</span>
        </div>

        <div className="topnav-right">
          <div className="user-chip">
            <div className="user-avatar">{getInitials(user?.name || 'U')}</div>
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-role-tag">{user?.role}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="main-area">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;

