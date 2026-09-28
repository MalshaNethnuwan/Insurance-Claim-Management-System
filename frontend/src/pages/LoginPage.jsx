import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User, Mail, UserCheck, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const { login, register, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('claimant');
  const [password, setPassword] = useState('password123');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('ROLE_USER');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        await register({ username, password, email, fullName, role });
      } else {
        await login(username, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const setDemoUser = (userType) => {
    setIsRegister(false);
    setError('');
    if (userType === 'claimant') {
      setUsername('claimant');
      setPassword('password123');
    } else if (userType === 'adjuster') {
      setUsername('adjuster');
      setPassword('password123');
    } else if (userType === 'admin') {
      setUsername('admin');
      setPassword('password123');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 120px)',
      padding: '2rem 1rem'
    }}>
      <div className="card" style={{ maxWidth: 460, width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2))',
            marginBottom: '1rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <Shield size={32} color="#6366f1" />
          </div>
          <h1>ShieldFlow Insurance</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Enterprise Claim Management System
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--status-rejected-bg)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--status-rejected-text)',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Credentials Quick-Select */}
        <div style={{
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
            Demo Profiles (1-Click Fill)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setDemoUser('claimant')}
            >
              <User size={13} />
              Claimant (User)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setDemoUser('adjuster')}
            >
              <UserCheck size={13} />
              Adjuster (Staff)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                value={username}
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={fullName}
                  placeholder="e.g. John Doe"
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Account Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="ROLE_USER">Claimant / Policyholder</option>
                  <option value="ROLE_ADJUSTER">Claims Adjuster</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In with JWT')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <button
            type="button"
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};
