import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { ClaimTimeline } from '../components/ClaimTimeline';
import { SubmitClaimModal } from '../components/SubmitClaimModal';
import { PlusCircle, Search, RefreshCw, AlertCircle, FileText } from 'lucide-react';

export const ClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchNumber, setSearchNumber] = useState('');
  const [trackedClaim, setTrackedClaim] = useState(null);
  const [trackError, setTrackError] = useState('');

  const fetchClaims = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getClaims();
      setClaims(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve claims.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleTrackSearch = async (e) => {
    e.preventDefault();
    if (!searchNumber.trim()) return;

    setTrackError('');
    try {
      const claim = await api.trackClaim(searchNumber.trim().toUpperCase());
      setTrackedClaim(claim);
    } catch (err) {
      setTrackError(`Claim "${searchNumber}" was not found.`);
      setTrackedClaim(null);
    }
  };

  return (
    <div>
      {/* Header and Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>My Insurance Claims</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Monitor real-time status transitions and submit new policy claims
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={fetchClaims} disabled={loading} title="Refresh Claims">
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={18} />
            File New Claim
          </button>
        </div>
      </div>

      {/* Claim Number Quick Lookup Tracker */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Public Claim Status Tracker</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Enter a claim reference number to inspect live review progress
        </p>

        <form onSubmit={handleTrackSearch} style={{ display: 'flex', gap: '0.75rem', maxWidth: 480 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. CLM-2026-001"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            <Search size={16} />
            Track Status
          </button>
        </form>

        {trackError && (
          <div style={{ marginTop: '0.75rem', color: 'var(--status-rejected-text)', fontSize: '0.85rem' }}>
            {trackError}
          </div>
        )}

        {trackedClaim && (
          <div style={{
            marginTop: '1.25rem',
            padding: '1.25rem',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{trackedClaim.claimNumber}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.75rem' }}>
                  Policy: {trackedClaim.policyNumber}
                </span>
              </div>
              <StatusBadge status={trackedClaim.status} />
            </div>

            <ClaimTimeline status={trackedClaim.status} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.85rem', marginTop: '1rem' }}>
              <div><strong>Incident Date:</strong> {trackedClaim.incidentDate}</div>
              <div><strong>Claim Amount:</strong> ${trackedClaim.claimAmount?.toLocaleString()}</div>
              <div><strong>Payout Amount:</strong> ${trackedClaim.payoutAmount?.toLocaleString()}</div>
              <div><strong>Adjuster Notes:</strong> {trackedClaim.adjusterNotes || 'None yet'}</div>
            </div>
          </div>
        )}
      </div>

      {/* Claims List */}
      {error && (
        <div style={{
          background: 'var(--status-rejected-bg)',
          color: 'var(--status-rejected-text)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading active claims...
        </div>
      ) : claims.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <FileText size={42} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3>No claims submitted yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.5rem auto 1.5rem', maxWidth: 400 }}>
            You haven't filed any insurance claims under your policies. Click the button below to start.
          </p>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={18} />
            File Your First Claim
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {claims.map((claim) => (
            <div key={claim.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.15rem' }}>{claim.claimNumber}</h3>
                    <StatusBadge status={claim.status} />
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                    Policy: <strong>{claim.policyNumber}</strong> ({claim.policyHolderName}) • Incident: {claim.incidentDate}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                    ${claim.claimAmount?.toLocaleString()}
                  </div>
                  {claim.payoutAmount > 0 && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                      Payout: ${claim.payoutAmount?.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Lifecycle Progress Stepper */}
              <ClaimTimeline status={claim.status} />

              <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                <p><strong>Description:</strong> {claim.description}</p>
                {claim.adjusterNotes && (
                  <p style={{ marginTop: '0.4rem', color: 'var(--accent-cyan)' }}>
                    <strong>Adjuster Remark:</strong> {claim.adjusterNotes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Claim Modal */}
      <SubmitClaimModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClaimSubmitted={fetchClaims}
      />
    </div>
  );
};
