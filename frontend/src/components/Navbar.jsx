import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, FileText, CheckSquare, Layers, Activity, LogOut, User } from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView }) => {
  const { user, logout, isAdjuster, isAdmin } = useAuth();

  return (
    <header style={{
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.75rem 2rem',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        {/* Brand */}
        <div
          onClick={() => setCurrentView(isAdjuster ? 'adjuster' : 'claims')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.4)',
          }}>
            <Shield size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.15rem',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #ffffff 30%, #9ca3af 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              ClaimShield
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Enterprise Cloud DevOps
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={() => setCurrentView('claims')}
            className={`btn btn-sm ${currentView === 'claims' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <FileText size={15} />
            <span>My Claims</span>
          </button>

          {(isAdjuster || isAdmin) && (
            <button
              onClick={() => setCurrentView('adjuster')}
              className={`btn btn-sm ${currentView === 'adjuster' ? 'btn-primary' : 'btn-secondary'}`}
              style={currentView === 'adjuster' ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)' } : {}}
            >
              <CheckSquare size={15} />
              <span>Adjuster Queue</span>
            </button>
          )}

          <button
            onClick={() => setCurrentView('policies')}
            className={`btn btn-sm ${currentView === 'policies' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Layers size={15} />
            <span>Policies</span>
          </button>

          <button
            onClick={() => setCurrentView('devops')}
            className={`btn btn-sm ${currentView === 'devops' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Activity size={15} />
            <span>DevOps & Infra</span>
          </button>
        </nav>

        {/* User Status & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--bg-tertiary)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
          }}>
            <User size={14} color="#9ca3af" />
            <span style={{ fontWeight: 600 }}>{user?.fullName || user?.username}</span>
            <span style={{
              fontSize: '0.68rem',
              padding: '0.15rem 0.45rem',
              borderRadius: 'var(--radius-full)',
              background: isAdjuster ? 'rgba(245, 158, 11, 0.2)' : isAdmin ? 'rgba(244, 63, 94, 0.2)' : 'rgba(99, 102, 241, 0.2)',
              color: isAdjuster ? '#fbbf24' : isAdmin ? '#fb7185' : '#818cf8',
              fontWeight: 700,
            }}>
              {user?.role?.replace('ROLE_', '')}
            </span>
          </div>

          <button
            onClick={logout}
            className="btn btn-secondary btn-sm"
            title="Log Out"
            style={{ padding: '0.4rem 0.6rem' }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
};
