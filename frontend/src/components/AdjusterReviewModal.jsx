import React, { useState } from 'react';
import { api } from '../services/api';
import { StatusBadge } from './StatusBadge';
import { ClaimTimeline } from './ClaimTimeline';
import { X, CheckCircle, XCircle, ArrowRight, DollarSign, AlertCircle } from 'lucide-react';

export const AdjusterReviewModal = ({ claim, onClose, onUpdated }) => {
  const [notes, setNotes] = useState(claim.adjusterNotes || '');
  const [payout, setPayout] = useState(claim.payoutAmount || claim.claimAmount || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!claim) return null;

  const handleStatusChange = async (targetStatus) => {
    setError('');
    setLoading(true);

    try {
      await api.updateClaimStatus(claim.id, {
        status: targetStatus,
        adjusterNotes: notes,
        payoutAmount: (targetStatus === 'APPROVED' || targetStatus === 'SETTLED') ? parseFloat(payout) : 0
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update claim status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h2>Review Claim {claim.claimNumber}</h2>
              <StatusBadge status={claim.status} />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Policy: {claim.policyNumber} | Claimant: {claim.policyHolderName} ({claim.claimantEmail})
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <ClaimTimeline status={claim.status} />

        {error && (
          <div style={{
            background: 'var(--status-rejected-bg)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            margin: '1rem 0',
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

        <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div><strong>Incident Date:</strong> {claim.incidentDate}</div>
            <div><strong>Claimed Amount:</strong> ${claim.claimAmount?.toLocaleString()}</div>
            <div><strong>Current Payout:</strong> ${claim.payoutAmount?.toLocaleString()}</div>
            <div><strong>Submitted At:</strong> {new Date(claim.createdAt).toLocaleDateString()}</div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
            <strong>Incident Description:</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{claim.description}</p>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Adjuster Notes & Audit Trail</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="Add internal investigation findings, surveyor remarks, or reasoning..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {(claim.status === 'UNDER_REVIEW' || claim.status === 'APPROVED') && (
          <div className="form-group">
            <label className="form-label">Approved Payout Amount ($ USD)</label>
            <input
              type="number"
              step="0.01"
              max={claim.claimAmount}
              className="form-input"
              value={payout}
              onChange={(e) => setPayout(e.target.value)}
            />
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
            AVAILABLE LIFECYCLE ACTIONS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {claim.status === 'SUBMITTED' && (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={loading}
                  onClick={() => handleStatusChange('UNDER_REVIEW')}
                >
                  <ArrowRight size={16} />
                  Start Under Review
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={loading}
                  onClick={() => handleStatusChange('REJECTED')}
                >
                  <XCircle size={16} />
                  Reject Claim
                </button>
              </>
            )}

            {claim.status === 'UNDER_REVIEW' && (
              <>
                <button
                  type="button"
                  className="btn btn-success"
                  disabled={loading}
                  onClick={() => handleStatusChange('APPROVED')}
                >
                  <CheckCircle size={16} />
                  Approve Claim
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={loading}
                  onClick={() => handleStatusChange('REJECTED')}
                >
                  <XCircle size={16} />
                  Reject Claim
                </button>
              </>
            )}

            {claim.status === 'APPROVED' && (
              <button
                type="button"
                className="btn"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: 'white' }}
                disabled={loading}
                onClick={() => handleStatusChange('SETTLED')}
              >
                <DollarSign size={16} />
                Disburse Payout & Settle Claim
              </button>
            )}

            {(claim.status === 'SETTLED' || claim.status === 'REJECTED') && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                This claim has reached terminal state ({claim.status}) and cannot be transitioned further.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
