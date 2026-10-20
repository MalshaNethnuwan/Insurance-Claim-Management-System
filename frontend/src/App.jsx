import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { ClaimsPage } from './pages/ClaimsPage';
import { AdjusterDashboard } from './pages/AdjusterDashboard';
import { PoliciesPage } from './pages/PoliciesPage';
import { DevOpsStatusPage } from './pages/DevOpsStatusPage';

const MainLayout = () => {
  const { user, isAdjuster } = useAuth();
  const [currentView, setCurrentView] = useState(() => (isAdjuster ? 'adjuster' : 'claims'));

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app-container">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      <main className="main-content">
        {currentView === 'claims' && <ClaimsPage />}
        {currentView === 'adjuster' && <AdjusterDashboard />}
        {currentView === 'policies' && <PoliciesPage />}
        {currentView === 'devops' && <DevOpsStatusPage />}
      </main>

      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        background: 'rgba(11, 15, 25, 0.7)'
      }}>
        <div>Insurance Claim Management System • Enterprise Cloud DevOps Architecture</div>
        <div style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
          Insurance Claim Management System • Enterprise Cloud DevOps Architectur
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
